const VALID_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates the payload for creating an expense.
 * Returns an array of error strings; empty array means valid.
 * @param {Object} body
 * @returns {string[]}
 */
function validateExpenseInput(body) {
  const errors = [];

  if (!body || typeof body !== "object") {
    return ["Request body must be a JSON object."];
  }

  const { title, amount, category, date } = body;

  if (!title || typeof title !== "string" || !title.trim()) {
    errors.push("title is required and must be a non-empty string.");
  }

  if (amount === undefined || amount === null || typeof amount !== "number" || Number.isNaN(amount)) {
    errors.push("amount is required and must be a number.");
  } else if (amount <= 0) {
    errors.push("amount must be greater than 0.");
  }

  if (!category || typeof category !== "string" || !category.trim()) {
    errors.push("category is required and must be a non-empty string.");
  }

  if (!date || typeof date !== "string" || !VALID_DATE_REGEX.test(date)) {
    errors.push("date is required and must be in YYYY-MM-DD format.");
  } else {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      errors.push("date is not a valid calendar date.");
    }
  }

  return errors;
}

module.exports = { validateExpenseInput };
