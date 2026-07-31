const express = require("express");
const router = express.Router();
const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  deleteExpense,
  getTotals,
  searchExpenses,
  getMonthlySummary,
} = require("../controllers/expensesController");


router.get("/summary/totals", getTotals);
router.get("/summary/monthly", getMonthlySummary); 
router.get("/search", searchExpenses); 

router.get("/", getAllExpenses);
router.get("/:id", getExpenseById);
router.post("/", createExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
