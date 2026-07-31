const { v4: uuidv4 } = require("uuid");
const { readExpenses, writeExpenses } = require("../utils/store");
const { validateExpenseInput } = require("../utils/validate");
const { round2 } = require("../utils/money");

/**
 * GET /api/expenses
 * Returns all expenses, optionally filtered by category via ?category=
 */
function getAllExpenses(req, res) {
  const { category } = req.query;
  let expenses = readExpenses();

  if (category) {
    expenses = expenses.filter(
      (e) => e.category.toLowerCase() === category.toLowerCase()
    );
  }

  expenses = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1));

  res.status(200).json({ count: expenses.length, expenses });
}

/**
 * GET /api/expenses/:id
 */
function getExpenseById(req, res) {
  const expenses = readExpenses();
  const expense = expenses.find((e) => e.id === req.params.id);

  if (!expense) {
    return res.status(404).json({ error: `Expense with id ${req.params.id} not found.` });
  }

  res.status(200).json(expense);
}

/**
 * POST /api/expenses
 * Body: { title, amount, category, date }
 */
function createExpense(req, res) {
  const errors = validateExpenseInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { title, amount, category, date } = req.body;

  const expense = {
    id: uuidv4(),
    title: title.trim(),
    amount: Number(amount),
    category: category.trim(),
    date,
    createdAt: new Date().toISOString(),
  };

  const expenses = readExpenses();
  expenses.push(expense);
  writeExpenses(expenses);

  res.status(201).json(expense);
}

/**
 * DELETE /api/expenses/:id
 */
function deleteExpense(req, res) {
  const expenses = readExpenses();
  const index = expenses.findIndex((e) => e.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: `Expense with id ${req.params.id} not found.` });
  }

  const [removed] = expenses.splice(index, 1);
  writeExpenses(expenses);

  res.status(200).json({ message: "Expense deleted.", expense: removed });
}

/**
 * GET /api/expenses/summary/totals
 * Returns overall total and totals broken down by category.
 */
function getTotals(req, res) {
  const expenses = readExpenses();

  const overall = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  res.status(200).json({
    overall: round2(overall),
    byCategory: Object.fromEntries(
      Object.entries(byCategory).map(([k, v]) => [k, round2(v)])
    ),
  });
}

/**
 * GET /api/expenses/search?q=term
 * Bonus feature. Case-insensitive substring search across title and
 * category. Requires a non-empty ?q= — returns 400 without one, so an
 * accidental empty search doesn't silently return the whole dataset.
 */
function searchExpenses(req, res) {
  const q = (req.query.q || "").trim();

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required and cannot be empty." });
  }

  const needle = q.toLowerCase();
  const expenses = readExpenses().filter(
    (e) => e.title.toLowerCase().includes(needle) || e.category.toLowerCase().includes(needle)
  );

  expenses.sort((a, b) => (a.date < b.date ? 1 : -1));

  res.status(200).json({ query: q, count: expenses.length, expenses });
}


function getMonthlySummary(req, res) {
  const expenses = readExpenses();

  const months = {};

  for (const e of expenses) {
    const month = e.date.slice(0, 7); 
    if (!months[month]) {
      months[month] = { total: 0, byCategory: {} };
    }
    months[month].total += e.amount;
    months[month].byCategory[e.category] = (months[month].byCategory[e.category] || 0) + e.amount;
  }

  const summary = Object.entries(months)
    .map(([month, data]) => ({
      month,
      total: round2(data.total),
      byCategory: Object.fromEntries(
        Object.entries(data.byCategory).map(([cat, amt]) => [cat, round2(amt)])
      ),
    }))
    .sort((a, b) => (a.month < b.month ? 1 : -1));

  res.status(200).json({ months: summary });
}

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  deleteExpense,
  getTotals,
  searchExpenses,
  getMonthlySummary,
};
