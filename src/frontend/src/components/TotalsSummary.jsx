const formatMoney = (n) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TotalsSummary({ totals }) {
  const categoryEntries = Object.entries(totals.byCategory || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="summary-card">
      <div className="summary-card__perforation" aria-hidden="true" />
      <div className="summary-card__body">
        <span className="summary-card__eyebrow">Total Spent</span>
        <span className="mono summary-card__grand-total">₹{formatMoney(totals.overall || 0)}</span>

        {categoryEntries.length > 0 && (
          <dl className="summary-card__breakdown">
            {categoryEntries.map(([cat, amount]) => (
              <div className="summary-card__row" key={cat}>
                <dt>{cat}</dt>
                <dd className="mono">₹{formatMoney(amount)}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
