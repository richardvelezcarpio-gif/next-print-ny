import test from "node:test";
import assert from "node:assert/strict";
import retiredHandler from "../api/seo-retired.js";

function responseRecorder() {
  const result = { statusCode: 200, headers: {}, body: "" };
  return {
    result,
    setHeader(name, value) { result.headers[name] = value; },
    status(code) { result.statusCode = code; return this; },
    send(body) { result.body = body; return this; },
  };
}

test("retired placeholder routes return 410 with a noindex response", () => {
  const res = responseRecorder();
  retiredHandler({ query: { route: "blog" } }, res);
  assert.equal(res.result.statusCode, 410);
  assert.equal(res.result.headers["X-Robots-Tag"], "noindex, nofollow");
});

test("unlisted routes are not treated as retired", () => {
  const res = responseRecorder();
  retiredHandler({ query: { route: "quote" } }, res);
  assert.equal(res.result.statusCode, 404);
});
