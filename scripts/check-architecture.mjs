import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

const root = process.cwd();
const rules = [
  {
    directory: path.join(root, "src", "global"),
    forbidden: ["@modules/", "@/modules/"],
    message: "global must not depend on feature modules",
  },
  {
    directory: path.join(root, "src", "modules"),
    forbidden: ["@/app/", "@app/"],
    message: "feature modules must not depend on app composition",
  },
];

async function sourcesFiles(directory) {
  const out = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await sourcesFiles(fullPath)));
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      out.push(fullPath);
    }
  }

  return out;
}

let failed = false;

for (const rule of rules) {
  for (const file of await sourcesFiles(rule.directory)) {
    const content = await readFile(file, "utf8");

    for (const specifier of rule.forbidden) {
      if (!content.includes(specifier)) {
        continue;
      }

      failed = true;
      console.error(
        `${path.relative(root, file)}: ${rule.message} (${specifier})`,
      );
    }
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log("Architecture boundaries: OK");
}
