import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const sourceDirectories = ["api", "lib", "src"];
const rootScripts = fs.readdirSync(root)
  .filter((name) => name.endsWith(".js"))
  .map((name) => path.join(root, name));

function javascriptFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? javascriptFiles(full) : entry.name.endsWith(".js") ? [full] : [];
  });
}

const scripts = [
  ...rootScripts,
  ...sourceDirectories.flatMap((directory) => javascriptFiles(path.join(root, directory))),
];

for (const file of scripts) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }
}

for (const json of ["package.json", "vercel.json"]) {
  JSON.parse(fs.readFileSync(path.join(root, json), "utf8"));
}

for (const required of ["index.html", "404.html", "robots.txt", "sitemap.xml", "assets/logo.png", "assets/logohero.png"]) {
  if (!fs.existsSync(path.join(root, required))) {
    console.error(`Missing required deployable file: ${required}`);
    process.exit(1);
  }
}

console.log(`Static project build passed: ${scripts.length} JavaScript source files have valid syntax and required deployable files are present.`);
