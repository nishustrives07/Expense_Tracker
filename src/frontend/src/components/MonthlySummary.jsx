const formatMoney = (n) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatMonthLabel = (monthStr) => {
  const [y, m] = monthStr.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
};

export default function MonthlySummary({ months }) {
  if (months.length === 0) {
    return (
      <div className="empty-tape">
        <p>No monthly data yet.</p>
        <p className="empty-tape__sub">Record an expense to see a monthly breakdown.</p>
      </div>
    );
  }

  
  return (
    <ul className="month-stack">
      {months.map((m) => (
        <li className="month-card" key={m.month}>
          <div className="month-card__head">
            <span className="month-card__label">{formatMonthLabel(m.month)}</span>
            <span className="mono month-card__total">₹{formatMoney(m.total)}</span>
          </div>
          <dl className="month-card__breakdown">
            {Object.entries(m.byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amt]) => (
                <div className="month-card__row" key={cat}>
                  <dt>{cat}</dt>
                  <dd className="mono">₹{formatMoney(amt)}</dd>
                </div>
              ))}
          </dl>
        </li>
      ))}
    </ul>
  );
}
