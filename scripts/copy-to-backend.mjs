import path from "node:path";
import { existsSync } from "node:fs";
import { cp, mkdir, readdir, rm } from "node:fs/promises";

const source = path.resolve("out");
const rawTarget = process.argv[2] || process.env.EIF_BACKEND_STATIC_DIR;

if (!rawTarget) {
  console.error(
    "Usage: npm run copy:backend -- ../backend/web/static\n" +
      "or set EIF_BACKEND_STATIC_DIR.",
  );
  process.exit(1);
}

if (!existsSync(source)) {
  console.error("Missing ./out. Run `npm run build` first.");
  process.exit(1);
}

const target = path.resolve(rawTarget);
const dangerousTargets = new Set([
  path.parse(target).root,
  process.cwd(),
  path.resolve("."),
]);
if (dangerousTargets.has(target)) {
  console.error(`Refusing unsafe destination: ${target}`);
  process.exit(1);
}

await mkdir(target, { recursive: true });
for (const entry of await readdir(target)) {
  if (entry === ".gitkeep") {
    continue;
  }
  await rm(path.join(target, entry), { recursive: true, force: true });
}

await cp(source, target, { recursive: true });
console.log(`Copied ${source} -> ${target}`);
