import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = new URL("..", import.meta.url).pathname;
const files = [];
async function walk(directory) { for (const entry of await readdir(directory, { withFileTypes: true })) { const path = join(directory, entry.name); if (["node_modules", ".git"].includes(entry.name)) continue; if (entry.isDirectory()) await walk(path); else if (path.endsWith(".js") || path.endsWith(".mjs")) files.push(path); } }
await walk(root);
await Promise.all(files.map(file => execFileAsync(process.execPath, ["--check", file])));
console.log(`Static project build passed: ${files.length} JavaScript source files checked.`);
