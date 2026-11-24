// Generate local HTML previews with sample data. Never sends email or accesses Google.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const context = vm.createContext({
  Utilities: { formatDate: () => "2026-11-24 22:50:00" },
});
vm.runInContext(
  fs.readFileSync(path.join(__dirname, "Code.gs"), "utf8"),
  context,
);
const lead = context.validateLead_({
  leadId: "sample-preview-0001",
  name: "Sample Customer",
  email: "customer@example.com",
  company: "Example Company",
  service: "AI Engineering",
  budget: "Not decided",
  message:
    "Sample inquiry: We would like to discuss an AI assistant for our team.\nPlease contact us about the next steps.",
});
const row = context.leadRow_(lead);
const sheet = {
  getSheetId: () => 123,
  getLastRow: () => 2,
  getRange: () => ({
    createTextFinder: () => ({
      matchEntireCell() {
        return this;
      },
      findNext: () => ({ getRow: () => 2 }),
    }),
  }),
};
const destination = path.join(__dirname, "previews");
fs.mkdirSync(destination, { recursive: true });
for (const [name, mail] of [
  ["team-notification", context.teamEmail_(sheet, row)],
  ["customer-confirmation", context.confirmationEmail_(row)],
]) {
  fs.writeFileSync(path.join(destination, name + ".html"), mail.htmlBody);
  console.log("Created " + name + ".html (sample data; no email sent)");
}
