/**
 * DetaLabs AI website leads → Google Sheets + branded team and visitor emails.
 *
 * UPGRADING AN EXISTING DEPLOYMENT
 * Replace Code.gs, run setup(), then Deploy → Manage deployments → Edit
 * → New version → Deploy. Keep the existing URL and webhook secret.
 * setup() appends confirmation-status columns and preserves existing leads.
 * Historical leads do not receive retrospective confirmation emails.
 *
 * SETUP
 * 1. Open the supplied spreadsheet → Extensions → Apps Script.
 * 2. Paste this entire file into Code.gs and save.
 * 3. Run setup() once; authorize Sheets, email, and the retry trigger.
 *    This creates the "Website Leads" tab without modifying other tabs.
 * 4. Project Settings → Script properties → copy LEADS_WEBHOOK_SECRET
 *    into the website's SERVER-ONLY GOOGLE_LEADS_WEBHOOK_SECRET variable.
 *    Never put the secret in NEXT_PUBLIC_* variables or browser code.
 * 5. Deploy → New deployment → Web app. Execute as: Me.
 *    Who has access: Anyone (the secret authenticates the website server).
 *    If your Workspace policy blocks this option, ask your administrator.
 * 6. Copy the deployed /exec URL. It will be used as GOOGLE_LEADS_WEBHOOK_URL
 *    when the website integration is added. Do not use the /dev testing URL.
 * 7. After editing a deployed script, deploy a new version of that deployment.
 *
 * JSON POST CONTRACT (sent by the website server, not directly by the browser)
 * {
 *   "secret": "same value as LEADS_WEBHOOK_SECRET",
 *   "leadId": "a-unique-id-reused-for-retries",
 *   "name": "Visitor name", "email": "visitor@example.com",
 *   "company": "Optional for consultations",
 *   "service": "AI Engineering", "budget": "Not decided",
 *   "message": "Optional project details (up to 5,000 characters)."
 * }
 * StelVoice requests instead include kind:"stelvoice", requestType:"demo",
 * "trial", or "pricing"; company is required. role, teamSize, volume, and
 * message are optional. message is optional for consultations too. service and budget are not needed for StelVoice.
 *
 * RESPONSE CONTRACT
 * ContentService returns JSON, including errors, normally with HTTP 200.
 * The website MUST check response.ok === true AND response.stored === true.
 * {ok:true,stored:true,id:"...",emailed:true|false,acknowledged:true|false,duplicate:true|false}
 * A saved lead remains successful if email is temporarily unavailable.
 * Pending email is retried every 10 minutes, subject to Google's quotas.
 * Unknown/network outcomes should be retried with the SAME leadId.
 *
 * No script is executed or email sent merely by adding these files to the repo.
 * setup() prepares the sheet and retry trigger, but sends no test emails.
 * Mail is sent from the Google account executing the web app. Team emails
 * reply to the visitor; visitor confirmations reply to info@detalabsai.com.
 * Each email is tracked separately. This does not impersonate either address.
 * Rare failure between mail delivery and marking a row Sent can cause a
 * repeated notification on retry; Sheets and email cannot commit atomically.
 */

var LEADS_CONFIG = Object.freeze({
  spreadsheetId: "1FOuPy9zkU3YT4505YGL_uMP7nijxRRlW8Zjnj7z5upQ",
  sheetName: "Website Leads",
  recipients: ["nimantha@detalabsai.com", "info@detalabsai.com"],
  timezone: "Asia/Colombo",
  replyTo: "info@detalabsai.com",
  website: "https://detalabsai.com",
  maxBodyLength: 30000,
  retryBatchSize: 20,
});
var LEAD_HEADERS = [
  "Lead ID",
  "Received (Asia/Colombo)",
  "Form",
  "Request type",
  "Name",
  "Email",
  "Company",
  "Service",
  "Budget (USD)",
  "Role",
  "Sales team size",
  "Monthly recording minutes",
  "Message",
  "Email status",
  "Email sent at",
  "Email issue",
  "Confirmation status",
  "Confirmation sent at",
  "Confirmation issue",
];
var LEAD_EMAIL_STATUS = 13; // Zero-based indexes in a row array.
var LEAD_EMAIL_SENT_AT = 14;
var LEAD_EMAIL_ISSUE = 15;
var LEAD_CONFIRMATION_STATUS = 16;
var LEAD_CONFIRMATION_SENT_AT = 17;
var LEAD_CONFIRMATION_ISSUE = 18;

function setup() {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var properties = PropertiesService.getScriptProperties();
    if (!properties.getProperty("LEADS_WEBHOOK_SECRET")) {
      properties.setProperty(
        "LEADS_WEBHOOK_SECRET",
        Utilities.getUuid() + Utilities.getUuid(),
      );
    }
    getLeadsSheet_();
    MailApp.getRemainingDailyQuota(); // Request email authorization; do not send mail.
    var installed = ScriptApp.getProjectTriggers().some(function (trigger) {
      return trigger.getHandlerFunction() === "retryPendingNotifications";
    });
    if (!installed) {
      ScriptApp.newTrigger("retryPendingNotifications")
        .timeBased()
        .everyMinutes(10)
        .create();
    }
    console.log(
      "Setup complete. Copy the secret from Project Settings > Script properties. No test mail was sent.",
    );
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: "DetaLabs AI leads webhook" });
}

function doPost(event) {
  var body;
  try {
    var raw = event && event.postData && event.postData.contents;
    if (
      typeof raw !== "string" ||
      !raw.length ||
      raw.length > LEADS_CONFIG.maxBodyLength
    ) {
      return json_({ ok: false, stored: false, code: "INVALID_BODY" });
    }
    body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error("Invalid JSON object");
  } catch (_) {
    return json_({ ok: false, stored: false, code: "INVALID_BODY" });
  }
  var expected = PropertiesService.getScriptProperties().getProperty(
    "LEADS_WEBHOOK_SECRET",
  );
  if (!expected)
    return json_({ ok: false, stored: false, code: "NOT_CONFIGURED" });
  if (typeof body.secret !== "string" || body.secret !== expected) {
    return json_({ ok: false, stored: false, code: "UNAUTHORIZED" });
  }
  var lead;
  try {
    lead = validateLead_(body);
  } catch (_) {
    return json_({ ok: false, stored: false, code: "INVALID_LEAD" });
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000))
    return json_({ ok: false, stored: false, code: "BUSY", retryable: true });
  var stored = false;
  try {
    var sheet = getLeadsSheet_();
    var rowNumber = findLeadRow_(sheet, lead.leadId);
    var duplicate = !!rowNumber;
    var row;
    if (duplicate) {
      row = sheet.getRange(rowNumber, 1, 1, LEAD_HEADERS.length).getValues()[0];
      var incoming = leadRow_(lead);
      // Reusing an ID for different lead data is an error, not a new submission.
      if (
        row.slice(2, 13).some(function (value, index) {
          return plainCell_(value) !== plainCell_(incoming[index + 2]);
        })
      ) {
        return json_({ ok: false, stored: false, code: "ID_CONFLICT" });
      }
    } else {
      row = leadRow_(lead);
      rowNumber = sheet.getLastRow() + 1;
      sheet
        .getRange(rowNumber, 1, 1, row.length)
        .setNumberFormat("@")
        .setValues([row]);
      SpreadsheetApp.flush(); // Save before attempting notification.
    }
    stored = true;
    sendLeadEmails_(sheet, rowNumber, row);
    return json_({
      ok: true,
      stored: true,
      id: lead.leadId,
      emailed: row[LEAD_EMAIL_STATUS] === "Sent",
      acknowledged: row[LEAD_CONFIRMATION_STATUS] === "Sent",
      duplicate: duplicate,
    });
  } catch (_) {
    // If a row was saved, keep the visitor's submission successful even if a
    // subsequent notification/status operation failed. The trigger retries it.
    return json_(
      stored
        ? { ok: true, stored: true, id: lead.leadId, emailed: false }
        : { ok: false, stored: false, code: "STORAGE_ERROR", retryable: true },
    );
  } finally {
    lock.releaseLock();
  }
}

function retryPendingNotifications() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    var sheet = getLeadsSheet_();
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return;
    var rows = sheet
      .getRange(2, 1, lastRow - 1, LEAD_HEADERS.length)
      .getValues();
    var attempts = 0;
    for (
      var i = 0;
      i < rows.length && attempts < LEADS_CONFIG.retryBatchSize;
      i++
    ) {
      if (
        rows[i][LEAD_EMAIL_STATUS] !== "Pending" &&
        rows[i][LEAD_CONFIRMATION_STATUS] !== "Pending"
      )
        continue;
      if (MailApp.getRemainingDailyQuota() < 1) break;
      attempts++;
      sendLeadEmails_(sheet, i + 2, rows[i]);
    }
  } finally {
    lock.releaseLock();
  }
}

function validateLead_(body) {
  function text(key, required, min, max) {
    if (body[key] === undefined && !required) return "";
    if (typeof body[key] !== "string") throw new Error("Invalid field");
    var value = body[key].trim();
    if (value.length > max || (required && value.length < min))
      throw new Error("Invalid field length");
    return value;
  }
  var lead = {
    leadId: text("leadId", true, 8, 100),
    name: text("name", true, 2, 100),
    email: text("email", true, 3, 254),
    kind: body.kind === undefined ? "consultation" : body.kind,
  };
  if (!/^[A-Za-z0-9_-]+$/.test(lead.leadId)) throw new Error("Invalid ID");
  if (
    /[,;<>"]/.test(lead.email) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)
  )
    throw new Error("Invalid email");
  if (lead.kind !== "consultation" && lead.kind !== "stelvoice")
    throw new Error("Invalid form");
  var product = lead.kind === "stelvoice";
  lead.company = text("company", product, 2, 200);
  lead.requestType = product
    ? text("requestType", true, 1, 20)
    : "consultation";
  if (product && ["demo", "trial", "pricing"].indexOf(lead.requestType) === -1)
    throw new Error("Invalid request");
  lead.service = product ? "StelVoice" : text("service", true, 1, 100);
  if (
    [
      "AI Engineering",
      "AI Marketing",
      "Web Development",
      "StelVoice",
      "Not sure yet",
    ].indexOf(lead.service) === -1
  )
    throw new Error("Invalid service");
  lead.budget = product ? "" : text("budget", true, 1, 100);
  if (
    !product &&
    [
      "Not decided",
      "Under $5,000",
      "$5,000–$15,000",
      "$15,000–$50,000",
      "$50,000+",
    ].indexOf(lead.budget) === -1
  )
    throw new Error("Invalid budget");
  lead.role = text("role", false, 0, 200);
  lead.teamSize = text("teamSize", false, 0, 200);
  lead.volume = text("volume", false, 0, 200);
  lead.message = text("message", false, 0, 5000);
  return lead;
}

function leadRow_(lead) {
  return [
    lead.leadId,
    timestamp_(),
    lead.kind,
    lead.requestType,
    lead.name,
    lead.email,
    lead.company,
    lead.service,
    lead.budget,
    lead.role,
    lead.teamSize,
    lead.volume,
    lead.message,
    "Pending",
    "",
    "",
    "Pending",
    "",
    "",
  ].map(safeCell_);
}

function safeCell_(value) {
  // Plain-text formatting plus an apostrophe prevents spreadsheet formulas.
  var text = String(value);
  return /^\s*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text) ? "'" + text : text;
}

function getLeadsSheet_() {
  var book = SpreadsheetApp.openById(LEADS_CONFIG.spreadsheetId);
  var sheet =
    book.getSheetByName(LEADS_CONFIG.sheetName) ||
    book.insertSheet(LEADS_CONFIG.sheetName);
  if (!sheet.getLastRow()) {
    sheet
      .getRange(1, 1, 1, LEAD_HEADERS.length)
      .setValues([LEAD_HEADERS])
      .setFontWeight("bold")
      .setBackground("#0B1F3A")
      .setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(13, 400);
  } else {
    var headers = sheet.getRange(1, 1, 1, LEAD_HEADERS.length).getValues()[0];
    var legacy = LEAD_HEADERS.slice(0, 16).every(function (header, index) {
      return headers[index] === header;
    });
    var missingConfirmationHeaders = headers.slice(16).every(function (value) {
      return value === "";
    });
    if (legacy && missingConfirmationHeaders) {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        var previous = sheet.getRange(2, 17, lastRow - 1, 3).getValues();
        if (
          previous.some(function (row) {
            return (
              row.some(function (value) {
                return value !== "";
              }) &&
              !(row[0] === "Not requested" && row[1] === "" && row[2] === "")
            );
          })
        )
          throw new Error("Existing columns contain data; migration stopped");
        // Backfill before the headers so an interrupted migration is safe.
        sheet.getRange(2, 17, lastRow - 1, 3).setValues(
          previous.map(function () {
            return ["Not requested", "", ""];
          }),
        );
      }
      sheet
        .getRange(1, 17, 1, 3)
        .setValues([LEAD_HEADERS.slice(16)])
        .setFontWeight("bold")
        .setBackground("#0B1F3A")
        .setFontColor("#FFFFFF");
    } else if (
      LEAD_HEADERS.some(function (header, index) {
        return headers[index] !== header;
      })
    ) {
      throw new Error(
        "Unexpected sheet headers; existing data was not modified",
      );
    }
  }
  return sheet;
}

function findLeadRow_(sheet, id) {
  if (sheet.getLastRow() < 2) return 0;
  var match = sheet
    .getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(id)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function sendLeadEmails_(sheet, rowNumber, row) {
  if (row[LEAD_EMAIL_STATUS] === "Pending") {
    sendTrackedEmail_(
      sheet,
      rowNumber,
      row,
      LEAD_EMAIL_STATUS,
      LEADS_CONFIG.recipients.length,
      teamEmail_(sheet, row),
    );
  }
  if (row[LEAD_CONFIRMATION_STATUS] === "Pending") {
    sendTrackedEmail_(
      sheet,
      rowNumber,
      row,
      LEAD_CONFIRMATION_STATUS,
      1,
      confirmationEmail_(row),
    );
  }
}

function sendTrackedEmail_(
  sheet,
  rowNumber,
  row,
  offset,
  recipientCount,
  message,
) {
  try {
    if (MailApp.getRemainingDailyQuota() < recipientCount)
      throw new Error("Quota");
    MailApp.sendEmail(message);
    row[offset] = "Sent";
    row[offset + 1] = timestamp_();
    row[offset + 2] = "";
  } catch (_) {
    row[offset] = "Pending";
    row[offset + 2] =
      "Email pending. Check Apps Script executions and MailApp quota if this persists.";
  }
  // Persist each delivery independently so a failed confirmation never resends
  // an already recorded team notification, or vice versa.
  sheet
    .getRange(rowNumber, offset + 1, 1, 3)
    .setValues([row.slice(offset, offset + 3)]);
  SpreadsheetApp.flush();
}

function escapeHtml_(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[character];
  });
}

function requestLabel_(row) {
  if (row[2] !== "stelvoice") return "Project inquiry";
  return (
    {
      demo: "StelVoice demo request",
      trial: "StelVoice trial request",
      pricing: "StelVoice pricing request",
    }[row[3]] || "StelVoice inquiry"
  );
}

function emailShell_(preheader, eyebrow, title, content, action) {
  var button = action
    ? '<table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0"><tr><td bgcolor="#C9A227" style="border-radius:6px"><a href="' +
      escapeHtml_(action.href) +
      '" style="display:inline-block;padding:15px 24px;font-family:Arial,sans-serif;font-size:15px;line-height:22px;font-weight:bold;color:#0B1F3A;text-decoration:none">' +
      escapeHtml_(action.label) +
      "</a></td></tr></table>"
    : "";
  return (
    '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' +
    escapeHtml_(title) +
    "</title></head>" +
    '<body style="margin:0;padding:0;background:#F7F8FB;color:#334155;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">' +
    escapeHtml_(preheader) +
    "</div>" +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#F7F8FB"><tr><td align="center" style="padding:32px 12px"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;background:#FFFFFF">' +
    '<tr><td bgcolor="#0B1F3A" style="padding:28px 28px;border-bottom:4px solid #C9A227"><span style="font-size:25px;line-height:32px;font-weight:bold;letter-spacing:-1px;color:#FFFFFF">DetaLabs <span style="color:#E8D48A">AI</span></span><p style="margin:7px 0 0;font-size:12px;line-height:20px;color:#E2E8F0">AI engineering · Marketing · Web development</p></td></tr>' +
    '<tr><td style="padding:32px 28px"><p style="margin:0 0 14px;font-size:12px;line-height:20px;font-weight:bold;letter-spacing:1.5px;color:#1E3A5F">' +
    escapeHtml_(eyebrow) +
    '</p><h1 style="margin:0 0 24px;font-size:29px;line-height:37px;letter-spacing:-0.8px;color:#0B1F3A">' +
    escapeHtml_(title) +
    "</h1>" +
    content +
    button +
    "</td></tr>" +
    '<tr><td bgcolor="#F7F8FB" style="padding:24px 28px;border-top:1px solid #E2E8F0"><p style="margin:0 0 8px;font-size:13px;line-height:21px;color:#334155"><strong>DetaLabs AI</strong> · Colombo, Sri Lanka</p><p style="margin:0;font-size:13px;line-height:22px"><a href="mailto:info@detalabsai.com" style="color:#1E3A5F">info@detalabsai.com</a> · <a href="' +
    escapeHtml_(LEADS_CONFIG.website) +
    '" style="color:#1E3A5F">detalabsai.com</a></p></td></tr></table></td></tr></table></body></html>'
  );
}

function detailTable_(details) {
  return (
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-top:1px solid #E2E8F0">' +
    details
      .map(function (item) {
        return (
          '<tr><td width="36%" valign="top" style="padding:13px 10px 13px 0;border-bottom:1px solid #E2E8F0;font-size:13px;line-height:21px;color:#64748B">' +
          escapeHtml_(item[0]) +
          '</td><td valign="top" style="padding:13px 0;border-bottom:1px solid #E2E8F0;font-size:14px;line-height:21px;color:#0B1F3A;word-break:break-word;overflow-wrap:anywhere">' +
          escapeHtml_(item[1]) +
          "</td></tr>"
        );
      })
      .join("") +
    "</table>"
  );
}

function teamEmail_(sheet, row) {
  var details = [
    ["Name", plainCell_(row[4])],
    ["Email", plainCell_(row[5])],
    ["Company", plainCell_(row[6]) || "Not provided"],
    ["Service", plainCell_(row[7])],
    ["Request", requestLabel_(row)],
    ["Received", plainCell_(row[1]) + " (Sri Lanka)"],
  ];
  [
    ["Budget (USD)", row[8]],
    ["Role", row[9]],
    ["Sales team size", row[10]],
    ["Monthly recording minutes", row[11]],
  ].forEach(function (item) {
    if (item[1]) details.push([item[0], plainCell_(item[1])]);
  });
  var label = requestLabel_(row);
  var sheetUrl =
    "https://docs.google.com/spreadsheets/d/" +
    LEADS_CONFIG.spreadsheetId +
    "/edit#gid=" +
    sheet.getSheetId() +
    "&range=A" +
    findLeadRow_(sheet, row[0]);
  var message = plainCell_(row[12]);
  var content =
    '<p style="font-size:16px;line-height:26px;margin:0 0 24px">A new inquiry has been saved to your leads sheet. Review the details below and reply directly to connect with the sender.</p>' +
    detailTable_(details) +
    (message
      ? '<h2 style="font-size:17px;line-height:25px;color:#0B1F3A;margin:28px 0 12px">Project details</h2><div style="padding:20px;background:#F7F8FB;border-left:3px solid #C9A227;font-size:15px;line-height:25px;word-break:break-word;overflow-wrap:anywhere">' +
        escapeHtml_(message).replace(/\r?\n/g, "<br>") +
        "</div>"
      : "") +
    '<p style="font-size:12px;line-height:20px;color:#64748B;margin:24px 0 0">Reference: ' +
    escapeHtml_(row[0]) +
    "</p>";
  return {
    to: LEADS_CONFIG.recipients.join(","),
    replyTo: plainCell_(row[5]),
    name: "DetaLabs AI",
    subject: "New inquiry: " + label + " | DetaLabs AI",
    body:
      "New " +
      label +
      "\n\n" +
      details
        .map(function (item) {
          return item[0] + ": " + item[1];
        })
        .join("\n") +
      (message ? "\n\nProject details:\n" + message : "") +
      "\n\nReference: " +
      row[0] +
      "\nOpen lead: " +
      sheetUrl,
    htmlBody: emailShell_(
      "New " + label + " from " + plainCell_(row[4]),
      "NEW WEBSITE INQUIRY",
      "A new conversation starts here.",
      content,
      { href: sheetUrl, label: "View lead in Google Sheets" },
    ),
  };
}

function confirmationEmail_(row) {
  var name = plainCell_(row[4]);
  var label = requestLabel_(row);
  var intro =
    "Thank you for getting in touch with DetaLabs AI. Your request is with our team, and we’ll contact you as soon as possible.";
  var content =
    '<p style="font-size:16px;line-height:26px;margin:0 0 16px">Hi ' +
    escapeHtml_(name) +
    ',</p><p style="font-size:16px;line-height:26px;margin:0 0 24px">' +
    escapeHtml_(intro) +
    "</p>" +
    detailTable_([
      ["Your request", label],
      ["Service", plainCell_(row[7])],
      ["Reference", plainCell_(row[0])],
    ]) +
    '<h2 style="font-size:18px;line-height:26px;color:#0B1F3A;margin:28px 0 12px">What happens next?</h2><p style="font-size:15px;line-height:25px;margin:0 0 12px">We’ll review the details you shared and follow up using this email address.</p><p style="font-size:15px;line-height:25px;margin:0 0 24px">Have something to add? Simply reply to this email. We’d be happy to hear more.</p><p style="font-size:15px;line-height:25px;margin:0">Speak soon,<br><strong style="color:#0B1F3A">The DetaLabs AI team</strong></p>';
  return {
    to: plainCell_(row[5]),
    replyTo: LEADS_CONFIG.replyTo,
    name: "DetaLabs AI",
    subject: "We’ve received your request | DetaLabs AI",
    body:
      "Hi " +
      name +
      ",\n\n" +
      intro +
      "\n\nYour request: " +
      label +
      "\nService: " +
      plainCell_(row[7]) +
      "\nReference: " +
      row[0] +
      "\n\nWhat happens next?\nWe’ll review the details you shared and follow up using this email address.\n\nHave something to add? Simply reply to this email.\n\nSpeak soon,\nThe DetaLabs AI team\ninfo@detalabsai.com | https://detalabsai.com",
    htmlBody: emailShell_(
      "Thank you for reaching out. Our team will be in touch as soon as possible.",
      "THANK YOU FOR GETTING IN TOUCH",
      "We’ve received your request.",
      content,
      { href: "mailto:" + LEADS_CONFIG.replyTo, label: "Contact our team" },
    ),
  };
}

function plainCell_(value) {
  return String(value).replace(/^'/, "");
}

function timestamp_() {
  return Utilities.formatDate(
    new Date(),
    LEADS_CONFIG.timezone,
    "yyyy-MM-dd HH:mm:ss",
  );
}
function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
