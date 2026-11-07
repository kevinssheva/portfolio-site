import assert from "node:assert/strict";
import { test } from "node:test";
import { formatMonth } from "./format";

test("content month strings display the intended month and year", () => {
  assert.equal(formatMonth("2025-01"), "January 2025");
  assert.equal(formatMonth("2025-04"), "April 2025");
  assert.equal(formatMonth("2024-12"), "December 2024");
});
