import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateSeatPurchase,
  ceilCredit,
  floorMoney,
} from "./billing.js";

test("floors payment amounts to two decimals", () => {
  assert.equal(floorMoney(4.93548), 4.93);
});

test("ceils granted credits to two decimals", () => {
  assert.equal(ceilCredit(4.93548), 4.94);
});

test("calculates the approved July proration example", () => {
  assert.deepEqual(
    calculateSeatPurchase({
      unitPrice: 9,
      unitCredits: 9,
      currentSeats: 2,
      addedSeats: 1,
      remainingDays: 17,
      cycleDays: 31,
    }),
    {
      remainingRatio: 17 / 31,
      rawAmount: 9 * 17 / 31,
      payableAmount: 4.93,
      rawCredits: 9 * 17 / 31,
      grantedCredits: 4.94,
      newSeatCount: 3,
      renewalAmount: 27,
    },
  );
});

test("supports buying multiple seats", () => {
  const result = calculateSeatPurchase({
    unitPrice: 9,
    unitCredits: 9,
    currentSeats: 2,
    addedSeats: 3,
    remainingDays: 17,
    cycleDays: 31,
  });

  assert.equal(result.payableAmount, 14.80);
  assert.equal(result.grantedCredits, 14.81);
  assert.equal(result.newSeatCount, 5);
  assert.equal(result.renewalAmount, 45);
});
