import { useState } from "react";

export default function SearchBar({ onSearch, onClear, searching }) {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  }

  function handleClear() {
    setQuery("");
    onClear();
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Search entries by title or category…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search expenses"
      />
      <button type="submit" className="search-bar__btn" disabled={searching || !query.trim()}>
        {searching ? "…" : "Search"}
      </button>
      {query && (
        <button type="button" className="search-bar__clear" onClick={handleClear}>
          Clear
        </button>
      )}
    </form>
  );
}
