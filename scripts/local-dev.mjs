import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import projectPortal from "../api/project-portal.js";

const root = new URL("..", import.meta.url).pathname;
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp" };
const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost:5173");
  if (url.pathname === "/api/project-portal") {
    const chunks = []; for await (const chunk of request) chunks.push(chunk);
    request.body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}") : {};
    request.query = Object.fromEntries(url.searchParams);
    response.status = code => { response.statusCode = code; return response; };
    response.json = body => { response.setHeader("Content-Type", "application/json"); response.end(JSON.stringify(body)); };
    return projectPortal(request, response);
  }
  const pathname = url.pathname.startsWith("/project/") ? "/project.html" : url.pathname === "/" ? "/index.html" : url.pathname;
  const file = normalize(join(root, pathname));
  if (!file.startsWith(root)) return response.writeHead(403).end();
  try { await stat(file); response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" }); createReadStream(file).pipe(response); } catch { response.writeHead(404).end("Not found"); }
});
server.listen(5173, "127.0.0.1", () => console.log("Next Print NY local portal: http://localhost:5173"));
