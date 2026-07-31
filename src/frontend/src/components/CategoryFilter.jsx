export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="ledger-tabs" role="tablist" aria-label="Filter by category">
      <button
        type="button"
        role="tab"
        aria-selected={active === ""}
        className={`ledger-tab ${active === "" ? "is-active" : ""}`}
        onClick={() => onChange("")}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          type="button"
          role="tab"
          key={cat}
          aria-selected={active === cat}
          className={`ledger-tab ${active === cat ? "is-active" : ""}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
