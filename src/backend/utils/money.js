/**
 * Rounds a number to 2 decimal places, avoiding floating point artifacts
 * like 19.249999999999996.
 * @param {number} n
 * @returns {number}
 */
function round2(n) {
  return Math.round(n * 100) / 100;
}

module.exports = { round2 };
