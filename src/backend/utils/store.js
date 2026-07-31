const fs = require("fs");
const path = require("path");


const DATA_FILE =
  process.env.NODE_ENV === "test"
    ? path.join(__dirname, "..", "data", "expenses.test.json")
    : path.join(__dirname, "..", "data", "expenses.json");


function ensureFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

/**
 * Reads all expenses from the JSON file.
 * @returns {Array<Object>}
 */
function readExpenses() {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw || "[]");
  } catch (err) {
    
    console.error("Failed to parse expenses data file, resetting to []:", err.message);
    return [];
  }
}

/**
 * Overwrites the JSON file with the given array of expenses.
 * @param {Array<Object>} expenses
 */
function writeExpenses(expenses) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2), "utf-8");
}


function resetStore() {
  writeExpenses([]);
}

module.exports = { readExpenses, writeExpenses, resetStore, DATA_FILE };
