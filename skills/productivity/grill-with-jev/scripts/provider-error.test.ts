import assert from "node:assert/strict";
import test from "node:test";
import { providerErrorDetail, safeTokenUsage } from "./ask-jev.js";

test("provider errors expose only valid HTTP statuses and recognized network codes", () => {
  assert.equal(providerErrorDetail({ statusCode: 401 }), "HTTP 401");
  assert.equal(providerErrorDetail({ cause: { code: "ECONNREFUSED" } }), "network error: ECONNREFUSED");
  assert.equal(providerErrorDetail({ statusCode: 999 }), "provider request failed");
  assert.equal(providerErrorDetail({ cause: { code: "SECRET_VALUE" } }), "provider request failed");
});

test("token usage keeps only non-negative integer counts", () => {
  assert.deepEqual(safeTokenUsage({ inputTokens: 12, outputTokens: 4, totalTokens: 16, debug: "private" }), { inputTokens: 12, outputTokens: 4, totalTokens: 16 });
  assert.deepEqual(safeTokenUsage({ inputTokens: -1, outputTokens: "private" }), {});
});
