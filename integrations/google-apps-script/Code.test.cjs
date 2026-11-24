// Offline checks only. No Google account access, sheet edits, or real email.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync(
  require("node:path").join(__dirname, "Code.gs"),
  "utf8",
);

function fixture() {
  const rows = [],
    emails = [],
    properties = new Map([["LEADS_WEBHOOK_SECRET", "test-secret"]]);
  const state = {
    quota: 100,
    mailFailure: false,
    failTo: "",
    busy: false,
    triggers: [],
  };
  const sheet = {
    getLastRow: () => rows.length,
    getSheetId: () => 123,
    setFrozenRows() {},
    setColumnWidth() {},
    getRange(start, column, count = 1, width = 1) {
      const range = {
        getValues: () =>
          Array.from({ length: count }, (_, r) =>
            Array.from(
              { length: width },
              (_, c) => rows[start - 1 + r]?.[column - 1 + c] ?? "",
            ),
          ),
        setValues(values) {
          values.forEach((row, r) => {
            rows[start - 1 + r] ??= Array(19).fill("");
            row.forEach((value, c) => {
              rows[start - 1 + r][column - 1 + c] = String(value).replace(
                /^'/,
                "",
              );
            });
          });
          return range;
        },
        setNumberFormat() {
          return range;
        },
        setFontWeight() {
          return range;
        },
        setBackground() {
          return range;
        },
        setFontColor() {
          return range;
        },
        createTextFinder(id) {
          return {
            matchEntireCell() {
              return this;
            },
            findNext() {
              const index = rows.findIndex(
                (row, i) => i >= start - 1 && row[column - 1] === id,
              );
              return index < 0 ? null : { getRow: () => index + 1 };
            },
          };
        },
      };
      return range;
    },
  };
  const context = vm.createContext({
    console: { log() {} },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (key) => properties.get(key),
        setProperty: (key, value) => properties.set(key, value),
      }),
    },
    LockService: {
      getScriptLock: () => ({
        tryLock: () => !state.busy,
        waitLock() {},
        releaseLock() {},
      }),
    },
    SpreadsheetApp: {
      openById: (id) => {
        assert.equal(id, "1FOuPy9zkU3YT4505YGL_uMP7nijxRRlW8Zjnj7z5upQ");
        return {
          getSheetByName: () => (rows.length ? sheet : null),
          insertSheet: (name) => {
            assert.equal(name, "Website Leads");
            return sheet;
          },
        };
      },
      flush() {},
    },
    MailApp: {
      getRemainingDailyQuota: () => state.quota,
      sendEmail: (mail) => {
        if (state.mailFailure || mail.to === state.failTo)
          throw Error("Temporary outage");
        emails.push(mail);
        state.quota -= mail.to.split(",").length;
      },
    },
    Utilities: {
      getUuid: () => "random-test-uuid",
      formatDate: () => "2026-11-24 22:30:00",
    },
    ScriptApp: {
      getProjectTriggers: () => state.triggers,
      newTrigger: (name) => ({
        timeBased() {
          return this;
        },
        everyMinutes(value) {
          assert.equal(value, 10);
          return this;
        },
        create() {
          state.triggers.push({ getHandlerFunction: () => name });
        },
      }),
    },
    ContentService: {
      MimeType: { JSON: "application/json" },
      createTextOutput: (text) => ({ setMimeType: () => ({ text }) }),
    },
  });
  vm.runInContext(source, context);
  const valid = {
    secret: "test-secret",
    leadId: "lead-test-0001",
    name: "Test Person",
    email: "test@example.com",
    company: "Example",
    service: "AI Engineering",
    budget: "Not decided",
    message: "Please help us build an AI workflow.",
  };
  return {
    context,
    rows,
    emails,
    state,
    properties,
    valid,
    post: (body) =>
      JSON.parse(
        context.doPost({
          postData: {
            contents: typeof body === "string" ? body : JSON.stringify(body),
          },
        }).text,
      ),
  };
}

test("setup initializes a separate tab, keeps the secret, and installs one retry trigger without sending email", () => {
  const f = fixture();
  f.context.setup();
  f.context.setup();
  assert.equal(f.rows.length, 1);
  assert.equal(f.emails.length, 0);
  assert.equal(f.state.triggers.length, 1);
  assert.equal(f.properties.get("LEADS_WEBHOOK_SECRET"), "test-secret");
});
test("a consultation is stored and both recipients are notified with visitor reply-to", () => {
  const f = fixture(),
    response = f.post(f.valid);
  assert.equal(response.stored, true);
  assert.equal(response.emailed, true);
  assert.equal(f.rows.length, 2);
  assert.equal(f.rows[1][13], "Sent");
  assert.equal(f.emails.length, 2);
  assert.equal(f.emails[0].to, "nimantha@detalabsai.com,info@detalabsai.com");
  assert.equal(f.emails[0].replyTo, "test@example.com");
});
test("StelVoice demo, trial, and pricing requests retain their additional fields", () => {
  for (const requestType of ["demo", "trial", "pricing"]) {
    const f = fixture(),
      body = {
        ...f.valid,
        kind: "stelvoice",
        requestType,
        role: "Manager",
        teamSize: "12",
        volume: "1000",
        message: "",
      };
    const result = f.post(body);
    assert.equal(result.stored, true);
    assert.equal(f.rows[1][3], requestType);
    assert.equal(f.rows[1][9], "Manager");
    assert.equal(f.rows[1][10], "12");
    assert.equal(f.rows[1][11], "1000");
  }
});
test("unauthorized, malformed, oversized, and invalid requests cannot write or email", () => {
  for (const body of [
    "{",
    "x".repeat(30001),
    { secret: "wrong" },
    { ...fixture().valid, email: "bad" },
    { ...fixture().valid, kind: "stelvoice", requestType: "demo", company: "" },
  ]) {
    const f = fixture();
    assert.equal(f.post(body).ok, false);
    assert.equal(f.rows.length, 0);
    assert.equal(f.emails.length, 0);
  }
});
test("missing configuration and concurrent lock failure return retryable errors without writes", () => {
  const f = fixture();
  f.properties.clear();
  assert.equal(f.post(f.valid).code, "NOT_CONFIGURED");
  assert.equal(f.rows.length, 0);
  const g = fixture();
  g.state.busy = true;
  assert.equal(g.post(g.valid).code, "BUSY");
  assert.equal(g.rows.length, 0);
});
test("retries reuse the saved lead and do not resend a completed notification", () => {
  const f = fixture();
  f.post(f.valid);
  const result = f.post(f.valid);
  assert.equal(result.duplicate, true);
  assert.equal(f.rows.length, 2);
  assert.equal(f.emails.length, 2);
  assert.equal(
    f.post({ ...f.valid, name: "Different Person" }).code,
    "ID_CONFLICT",
  );
});
test("quota exhaustion saves the lead, then the retry job sends once quota returns", () => {
  const f = fixture();
  f.state.quota = 0;
  const result = f.post(f.valid);
  assert.equal(result.stored, true);
  assert.equal(result.emailed, false);
  assert.equal(f.rows[1][13], "Pending");
  assert.equal(f.emails.length, 0);
  f.state.quota = 100;
  f.context.retryPendingNotifications();
  f.context.retryPendingNotifications();
  assert.equal(f.rows[1][13], "Sent");
  assert.equal(f.emails.length, 2);
});
test("email failure never loses the saved lead; a repeated request retries notification", () => {
  const f = fixture();
  f.state.mailFailure = true;
  assert.equal(f.post(f.valid).stored, true);
  assert.equal(f.rows[1][13], "Pending");
  f.state.mailFailure = false;
  assert.equal(f.post(f.valid).emailed, true);
  assert.equal(f.rows.length, 2);
  assert.equal(f.emails.length, 2);
});
test("spreadsheet formula text is neutralized, remains idempotent, and does not corrupt reply-to", () => {
  const f = fixture();
  assert.equal(f.context.safeCell_('=IMPORTXML("url")'), '\'=IMPORTXML("url")');
  const body = {
    ...f.valid,
    company: "=1+1",
    email: "+sales@example.com",
    message: "=This is a test inquiry with formula-like text.",
  };
  assert.equal(f.post(body).stored, true);
  assert.equal(f.post(body).duplicate, true);
  assert.equal(f.emails.length, 2);
  assert.equal(f.emails[0].replyTo, "+sales@example.com");
});
test("unexpected sheet headers are never overwritten", () => {
  const f = fixture();
  f.rows.push(["Existing data"]);
  const result = f.post(f.valid);
  assert.equal(result.code, "STORAGE_ERROR");
  assert.deepEqual(f.rows, [["Existing data"]]);
  assert.equal(f.emails.length, 0);
});

test("visitor receives a branded HTML confirmation with a company reply-to", () => {
  const f = fixture();
  const response = f.post(f.valid);
  assert.equal(response.acknowledged, true);
  const mail = f.emails.find((mail) => mail.to === f.valid.email);
  assert.equal(mail.replyTo, "info@detalabsai.com");
  assert.match(mail.subject, /received your request/);
  assert.match(mail.htmlBody, /#0B1F3A/);
  assert.match(mail.htmlBody, /#C9A227/);
  assert.match(mail.htmlBody, /as soon as possible/);
  assert.match(mail.body, /What happens next/);
  assert.equal(f.rows[1][16], "Sent");
  assert(!mail.htmlBody.includes("docs.google.com")); // Never expose the private leads sheet to visitors.
});

test("confirmation failure retries only the visitor email, not a sent team notification", () => {
  const f = fixture();
  f.state.failTo = f.valid.email;
  const result = f.post(f.valid);
  assert.equal(result.emailed, true);
  assert.equal(result.acknowledged, false);
  assert.equal(f.rows[1][16], "Pending");
  assert.equal(f.emails.length, 1);
  f.state.failTo = "";
  f.context.retryPendingNotifications();
  f.context.retryPendingNotifications();
  assert.equal(f.rows[1][16], "Sent");
  assert.equal(f.emails.length, 2);
  assert.equal(f.emails.filter((mail) => mail.to === f.valid.email).length, 1);
});

test("team email failure does not block the confirmation or resend it later", () => {
  const f = fixture();
  f.state.failTo = "nimantha@detalabsai.com,info@detalabsai.com";
  f.post(f.valid);
  assert.equal(f.rows[1][13], "Pending");
  assert.equal(f.rows[1][16], "Sent");
  assert.equal(f.emails.length, 1);
  f.state.failTo = "";
  f.context.retryPendingNotifications();
  assert.equal(f.emails.length, 2);
  assert.equal(f.emails.filter((mail) => mail.to === f.valid.email).length, 1);
});

test("one remaining quota slot can send the visitor confirmation and queue the team notification", () => {
  const f = fixture();
  f.state.quota = 1;
  f.post(f.valid);
  assert.equal(f.rows[1][13], "Pending");
  assert.equal(f.rows[1][16], "Sent");
  assert.equal(f.emails.length, 1);
});

test("HTML input is escaped in both templates and is not reflected as a message in the receipt", () => {
  const f = fixture();
  f.post({
    ...f.valid,
    name: "<img src=x onerror=alert(1)>",
    message: "<script>alert(1)</script> & test inquiry",
  });
  for (const mail of f.emails) {
    assert(!mail.htmlBody.includes("<img src=x"));
    assert(!mail.htmlBody.includes("<script>"));
    assert(mail.htmlBody.includes("&lt;img"));
  }
  assert(!f.emails[1].htmlBody.includes("&lt;script"));
  assert(f.emails[0].htmlBody.includes("&lt;script&gt;"));
});

test("legacy sheet upgrade appends status columns without emailing historical customers", () => {
  const f = fixture();
  f.rows.push(Array.from(f.context.LEAD_HEADERS).slice(0, 16));
  f.rows.push([
    "old-lead-0001",
    "2026-11-01",
    "consultation",
    "consultation",
    "Previous Customer",
    "previous@example.com",
    "Example",
    "AI Engineering",
    "Not decided",
    "",
    "",
    "",
    "Previous message",
    "Sent",
    "2026-11-01",
    "",
  ]);
  f.context.setup();
  assert.equal(f.rows[1][16], "Not requested");
  assert.equal(f.rows[0].length, 19);
  f.context.retryPendingNotifications();
  assert.equal(f.emails.length, 0);
  f.context.setup();
  assert.equal(f.emails.length, 0);
  f.post(f.valid);
  assert.equal(f.emails.length, 2);
  assert.equal(f.rows[1][4], "Previous Customer");
});

test("legacy upgrade refuses to overwrite unrelated extra columns", () => {
  const f = fixture();
  f.rows.push([...Array.from(f.context.LEAD_HEADERS).slice(0, 16), "", "", ""]);
  f.rows.push(Array(16).fill("").concat(["Keep this", "", ""]));
  assert.equal(f.post(f.valid).code, "STORAGE_ERROR");
  assert.equal(f.rows[1][16], "Keep this");
  assert.equal(f.emails.length, 0);
});

test("an interrupted legacy upgrade can finish safely without sending receipts", () => {
  const f = fixture();
  f.rows.push(Array.from(f.context.LEAD_HEADERS).slice(0, 16));
  f.rows.push(Array(16).fill("").concat(["Not requested", "", ""]));
  f.context.setup();
  assert.equal(f.rows[0][16], "Confirmation status");
  assert.equal(f.emails.length, 0);
});

test("recipient separators cannot create extra confirmation recipients", () => {
  for (const email of [
    "first,second@example.com",
    "first;second@example.com",
    "<test@example.com>",
  ]) {
    const f = fixture();
    assert.equal(f.post({ ...f.valid, email }).ok, false);
    assert.equal(f.emails.length, 0);
  }
});
