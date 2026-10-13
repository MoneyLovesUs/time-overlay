import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "vitest";

import { signProToken, verifyProToken } from "@/lib/pro/token";

const SECRET = "test-license-secret";

function tamperOnce(value: string): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const first = value[0];
  const replacement = alphabet.split("").find((c) => c !== first) ?? "z";
  return replacement + value.slice(1);
}

describe("pro token", () => {
  it("round-trips a signed payload in the v1.<body>.<signature> format", () => {
    const token = signProToken({ sid: "cs_test_123", iat: 1760000000 }, SECRET);
    const parts = token.split(".");
    assert.equal(parts.length, 3);
    assert.equal(parts[0], "v1");

    const payload = verifyProToken(token, SECRET);
    assert.deepEqual(payload, { sid: "cs_test_123", iat: 1760000000 });
  });

  it("rejects a token whose signature is tampered by one character", () => {
    const token = signProToken({ sid: "cs_test_123", iat: 1760000000 }, SECRET);
    const parts = token.split(".");
    const tampered = [parts[0], parts[1], tamperOnce(parts[2])].join(".");
    assert.equal(verifyProToken(tampered, SECRET), null);
  });

  it("rejects a token whose body is tampered by one character", () => {
    const token = signProToken({ sid: "cs_test_123", iat: 1760000000 }, SECRET);
    const parts = token.split(".");
    const tampered = [parts[0], tamperOnce(parts[1]), parts[2]].join(".");
    assert.equal(verifyProToken(tampered, SECRET), null);
  });

  it("rejects a token signed with a different secret", () => {
    const token = signProToken({ sid: "cs_test_123", iat: 1760000000 }, SECRET);
    assert.equal(verifyProToken(token, "another-secret"), null);
  });

  it("rejects malformed tokens", () => {
    assert.equal(verifyProToken("", SECRET), null);
    assert.equal(verifyProToken("v1.only-two", SECRET), null);
    assert.equal(verifyProToken("v2.abc.def", SECRET), null);
    assert.equal(verifyProToken("not-a-token", SECRET), null);
  });

  it("rejects a structurally valid token whose payload is not the expected shape", () => {
    const body = Buffer.from(JSON.stringify({ sid: 42, iat: "x" }), "utf8").toString(
      "base64url",
    );
    const signature = createHmac("sha256", SECRET).update(body).digest("base64url");
    assert.equal(verifyProToken(["v1", body, signature].join("."), SECRET), null);
  });
});
