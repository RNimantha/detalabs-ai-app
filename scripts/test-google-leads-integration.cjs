// Local integration tests with mocked HTTP. Never contacts Google or sends mail.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function fixture({ configured = true, respond, endpoint } = {}) {
  const calls = [],
    cache = new Map();
  const env = configured ? { GOOGLE_LEADS_WEBHOOK_SECRET: "mock-secret" } : {};
  if (endpoint) env.GOOGLE_LEADS_WEBHOOK_URL = endpoint;
  let generated = 0;
  function load(relative) {
    const filename = path.resolve(__dirname, "..", relative);
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    const sandbox = {
      module,
      exports: module.exports,
      process: { env },
      console: { error() {} },
      URL,
      AbortSignal,
      Request,
      Response,
      setTimeout: (fn) => {
        fn();
      },
      crypto: { randomUUID: () => `mock-id-${++generated}` },
      fetch: async (url, options) => {
        const payload = JSON.parse(options.body);
        calls.push({ url: String(url), payload });
        if (respond) return respond(payload, calls.length);
        return Response.json({
          ok: true,
          stored: true,
          emailed: true,
          id: payload.leadId,
        });
      },
      require: (name) => {
        if (name === "react") return { useRef: () => ({ current: null }) };
        if (name.startsWith("@/")) return load(name.slice(2) + ".ts");
        return require(name);
      },
    };
    vm.runInNewContext(code, sandbox, { filename });
    return module.exports;
  }
  const valid = {
    name: "Example Person",
    email: "test@example.com",
    company: "Example",
    service: "AI Engineering",
    budget: "Not decided",
    message: "Please help our team build a new website.",
    leadId: "450fc403-caf6-4c46-89a7-56e1b4bb9f63",
  };
  return {
    calls,
    valid,
    load,
    post: (body) =>
      load("app/api/contact/route.ts").POST(
        new Request("http://localhost/api/contact", {
          method: "POST",
          body: JSON.stringify(body),
        }),
      ),
  };
}

test("consultations and StelVoice inquiries reach Google without Supabase or SMTP", async () => {
  for (const extra of [
    {},
    {
      kind: "stelvoice",
      requestType: "demo",
      role: "Manager",
      teamSize: "12",
      volume: "1000",
    },
    { kind: "stelvoice", requestType: "trial" },
    { kind: "stelvoice", requestType: "pricing" },
  ]) {
    const f = fixture(),
      response = await f.post({ ...f.valid, ...extra });
    assert.equal(response.status, 201);
    assert.equal(f.calls.length, 1);
    assert.equal(f.calls[0].payload.secret, "mock-secret");
    assert.equal(f.calls[0].payload.leadId, f.valid.leadId);
    assert(!JSON.stringify(await response.json()).includes("mock-secret"));
  }
});
test("missing secret fails closed without sending a request", async () => {
  const f = fixture({ configured: false });
  assert.equal((await f.post(f.valid)).status, 503);
  assert.equal(f.calls.length, 0);
});
test("invalid lead or client ID is rejected before calling Google", async () => {
  const f = fixture();
  assert.equal((await f.post({ ...f.valid, email: "bad" })).status, 400);
  assert.equal((await f.post({ ...f.valid, leadId: "invalid" })).status, 400);
  assert.equal(f.calls.length, 0);
});
test("Apps Script JSON errors are not mistaken for success despite HTTP 200", async () => {
  const f = fixture({
    respond: () =>
      Response.json({ ok: false, stored: false, code: "UNAUTHORIZED" }),
  });
  assert.equal((await f.post(f.valid)).status, 502);
  assert.equal(f.calls.length, 1);
});
test("stored lead is successful when notification is queued for retry", async () => {
  const f = fixture({
    respond: (payload) =>
      Response.json({
        ok: true,
        stored: true,
        emailed: false,
        id: payload.leadId,
      }),
  });
  assert.equal((await f.post(f.valid)).status, 201);
});
test("retryable failures reuse exactly the same lead ID", async () => {
  const f = fixture({
    respond: (payload, attempt) =>
      attempt === 1
        ? Response.json({ ok: false, retryable: true, code: "BUSY" })
        : Response.json({
            ok: true,
            stored: true,
            id: payload.leadId,
            emailed: true,
          }),
  });
  assert.equal((await f.post(f.valid)).status, 201);
  assert.equal(f.calls.length, 2);
  assert.deepEqual(f.calls[0].payload, f.calls[1].payload);
});
test("an unknown network result never reports success and retries are bounded", async () => {
  const f = fixture({
    respond: () => {
      throw new Error("Timed out after Google may have saved the lead");
    },
  });
  assert.equal((await f.post(f.valid)).status, 502);
  assert.equal(f.calls.length, 2);
  assert.equal(f.calls[0].payload.leadId, f.calls[1].payload.leadId);
});
test("Google sign-in HTML is treated as a failed response", async () => {
  const f = fixture({ respond: () => new Response("<html>Sign in</html>") });
  assert.equal((await f.post(f.valid)).status, 502);
});
test("an unrelated endpoint cannot receive the secret", async () => {
  const f = fixture({ endpoint: "https://example.com/webhook" });
  assert.equal((await f.post(f.valid)).status, 502);
  assert.equal(f.calls.length, 0);
});
test("a mismatched confirmation ID cannot confirm this lead", async () => {
  const f = fixture({
    respond: () =>
      Response.json({ ok: true, stored: true, id: "some-other-id" }),
  });
  assert.equal((await f.post(f.valid)).status, 502);
});
test("browser attempts retain ID for unchanged data, change it for edits, and clear after success", () => {
  const f = fixture(),
    hook = f.load("hooks/use-lead-submission-id.ts").useLeadSubmissionId();
  const first = hook.forPayload({ message: "first" });
  assert.equal(hook.forPayload({ message: "first" }), first);
  assert.notEqual(hook.forPayload({ message: "edited" }), first);
  const last = hook.forPayload({ message: "edited" });
  hook.clear();
  assert.notEqual(hook.forPayload({ message: "edited" }), last);
});

test("remote setup errors remain unavailable rather than claiming a saved lead", async () => {
  const f = fixture({
    respond: () =>
      Response.json({ ok: false, stored: false, code: "NOT_CONFIGURED" }),
  });
  assert.equal((await f.post(f.valid)).status, 503);
  assert.equal(f.calls.length, 1);
});
