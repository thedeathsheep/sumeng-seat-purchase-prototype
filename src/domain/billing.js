export function floorMoney(value) {
  return Math.floor((value + Number.EPSILON) * 100) / 100;
}

export function ceilCredit(value) {
  return Math.ceil((value - Number.EPSILON) * 100) / 100;
}

export function calculateSeatPurchase({
  unitPrice,
  unitCredits,
  currentSeats,
  addedSeats,
  remainingDays,
  cycleDays,
}) {
  if (!Number.isInteger(addedSeats) || addedSeats < 1) {
    throw new RangeError("addedSeats must be a positive integer");
  }

  if (cycleDays < 1 || remainingDays < 1 || remainingDays > cycleDays) {
    throw new RangeError("remainingDays must be within the billing cycle");
  }

  const remainingRatio = remainingDays / cycleDays;
  const rawAmount = unitPrice * addedSeats * remainingRatio;
  const rawCredits = unitCredits * addedSeats * remainingRatio;
  const newSeatCount = currentSeats + addedSeats;

  return {
    remainingRatio,
    rawAmount,
    payableAmount: floorMoney(rawAmount),
    rawCredits,
    grantedCredits: ceilCredit(rawCredits),
    newSeatCount,
    renewalAmount: unitPrice * newSeatCount,
  };
}
