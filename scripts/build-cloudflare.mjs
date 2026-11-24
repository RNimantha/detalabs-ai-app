import { spawnSync } from "node:child_process";

// Use a separate Next output directory so an open local dev server cannot
// overwrite production files while OpenNext assembles the Worker.
const build = spawnSync(
  process.execPath,
  ["node_modules/@opennextjs/cloudflare/dist/cli/index.js", "build"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      DETALABS_NEXT_DIST_DIR: ".next-cloudflare",
      CLOUDFLARE_BUILD: "1",
    },
  },
);
if (build.error) {
  console.error("Could not start the Cloudflare build.");
  process.exit(1);
}
process.exit(build.status ?? 1);
