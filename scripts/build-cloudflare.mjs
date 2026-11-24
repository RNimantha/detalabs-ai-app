import { spawnSync } from "node:child_process";

// OpenNext reads the Next.js build from the default ".next" directory, so the
// build must not override distDir. Stop any local `next dev` server first, as
// it writes to the same directory.
const build = spawnSync(
  process.execPath,
  ["node_modules/@opennextjs/cloudflare/dist/cli/index.js", "build"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      CLOUDFLARE_BUILD: "1",
    },
  },
);
if (build.error) {
  console.error("Could not start the Cloudflare build.");
  process.exit(1);
}
process.exit(build.status ?? 1);
