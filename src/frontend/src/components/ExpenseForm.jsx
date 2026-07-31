import { useState } from "react";

const CATEGORY_SUGGESTIONS = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Health",
  "Shopping",
  "Other",
];

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ onAdd, submitting }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(todayISO());
  const [formError, setFormError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const parsedAmount = parseFloat(amount);
    if (!title.trim() || !category.trim() || !date || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError("Fill in a title, a positive amount, a category, and a date.");
      return;
    }

    try {
      await onAdd({ title: title.trim(), amount: parsedAmount, category: category.trim(), date });
      setTitle("");
      setAmount("");
      setCategory("");
      setDate(todayISO());
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <form className="entry-slip" onSubmit={handleSubmit}>
      <div className="entry-slip__header">
        <span className="entry-slip__eyebrow">New Entry</span>
        <span className="entry-slip__hash">#{todayISO()}</span>
      </div>

      <div className="field-row">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Groceries"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
        />
      </div>

      <div className="field-row field-row--split">
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mono"
          />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mono"
          />
        </div>
      </div>

      <div className="field-row">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="text"
          list="category-suggestions"
          placeholder="e.g. Food"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          maxLength={40}
        />
        <datalist id="category-suggestions">
          {CATEGORY_SUGGESTIONS.map((c) => (
            <option value={c} key={c} />
          ))}
        </datalist>
      </div>

      {formError && <p className="entry-slip__error" role="alert">{formError}</p>}

      <button type="submit" className="btn-stamp" disabled={submitting}>
        {submitting ? "Recording…" : "Record Expense"}
      </button>
    </form>
  );
}
