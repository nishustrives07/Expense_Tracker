const formatMoney = (n) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatDate = (isoDate) => {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
};

export default function ExpenseList({ expenses, onDelete, deletingId }) {
  if (expenses.length === 0) {
    return (
      <div className="empty-tape">
        <p>No entries here yet.</p>
        <p className="empty-tape__sub">Record your first expense above to start the tape.</p>
      </div>
    );
  }

  return (
    <ul className="receipt-tape">
      {expenses.map((exp) => (
        <li className="tape-line" key={exp.id}>
          <div className="tape-line__main">
            <span className="tape-line__title">{exp.title}</span>
            <span className="tape-line__meta">
              {formatDate(exp.date)} · <span className="tape-line__category">{exp.category}</span>
            </span>
          </div>
          <div className="tape-line__side">
            <span className="mono tape-line__amount">₹{formatMoney(exp.amount)}</span>
            <button
              type="button"
              className="btn-void"
              onClick={() => onDelete(exp.id)}
              disabled={deletingId === exp.id}
              aria-label={`Delete ${exp.title}`}
            >
              {deletingId === exp.id ? "…" : "void"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
