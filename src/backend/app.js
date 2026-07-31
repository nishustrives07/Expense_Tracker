const express = require("express");
const cors = require("cors");
const expensesRouter = require("./routes/expenses");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/expenses", expensesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed JSON in request body." });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

module.exports = app;
