import { useEffect, useMemo, useState, useCallback } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import CategoryFilter from "./components/CategoryFilter";
import TotalsSummary from "./components/TotalsSummary";
import SearchBar from "./components/SearchBar";
import MonthlySummary from "./components/MonthlySummary";
import {
  fetchExpenses,
  fetchTotals,
  createExpense,
  deleteExpense,
  searchExpenses,
  fetchMonthlySummary,
} from "./api/expenses";
import "./App.css";

export default function App() {
  const [view, setView] = useState("entries"); 

  const [expenses, setExpenses] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [totals, setTotals] = useState({ overall: 0, byCategory: {} });
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [pageError, setPageError] = useState("");


  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);


  const [months, setMonths] = useState([]);
  const [monthlyLoading, setMonthlyLoading] = useState(false);

  const loadData = useCallback(async (category) => {
    setPageError("");
    try {
      const [expensesRes, totalsRes] = await Promise.all([
        fetchExpenses(category),
        fetchTotals(),
      ]);
      setExpenses(expensesRes.expenses);
      setTotals(totalsRes);

      if (!category) {
        const cats = [...new Set(expensesRes.expenses.map((e) => e.category))].sort();
        setAllCategories(cats);
      }
    } catch (err) {
      setPageError(
        "Could not reach the expense server. Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(activeCategory);
    
  }, [activeCategory]);

  useEffect(() => {
    fetchExpenses()
      .then((res) => setAllCategories([...new Set(res.expenses.map((e) => e.category))].sort()))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (view !== "monthly") return;
    setMonthlyLoading(true);
    fetchMonthlySummary()
      .then((res) => setMonths(res.months))
      .catch((err) => setPageError(err.message))
      .finally(() => setMonthlyLoading(false));
  }, [view]);

  async function handleAdd(payload) {
    setSubmitting(true);
    try {
      await createExpense(payload);
      await loadData(activeCategory);
      const res = await fetchExpenses();
      setAllCategories([...new Set(res.expenses.map((e) => e.category))].sort());
      
      if (view === "monthly") {
        const monthlyRes = await fetchMonthlySummary();
        setMonths(monthlyRes.months);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await deleteExpense(id);
      await loadData(activeCategory);
      if (searchResults) {
        setSearchResults((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      setPageError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSearch(query) {
    setSearching(true);
    setPageError("");
    try {
      const res = await searchExpenses(query);
      setSearchQuery(query);
      setSearchResults(res.expenses);
    } catch (err) {
      setPageError(err.message);
    } finally {
      setSearching(false);
    }
  }

  function handleClearSearch() {
    setSearchQuery("");
    setSearchResults(null);
  }

  const displayedExpenses = searchResults !== null ? searchResults : expenses;

  const subtitle = useMemo(() => {
    const count = displayedExpenses.length;
    if (searchResults !== null) {
      return `${count} ${count === 1 ? "result" : "results"} for "${searchQuery}"`;
    }
    return `${count} ${count === 1 ? "entry" : "entries"}${activeCategory ? ` in ${activeCategory}` : ""}`;
  }, [displayedExpenses.length, activeCategory, searchResults, searchQuery]);

  return (
    <div className="ledger-page">
      <header className="ledger-header">
        <div className="ledger-header__mark">✎</div>
        <div>
          <h1>The Daily Ledger</h1>
          <p className="ledger-header__tagline">Every expense, accounted for.</p>
        </div>
      </header>

      <main className="ledger-main">
        <section className="ledger-column ledger-column--form">
          <ExpenseForm onAdd={handleAdd} submitting={submitting} />
          <TotalsSummary totals={totals} />
        </section>

        <section className="ledger-column ledger-column--list">
          <div className="ledger-column__head">
            <div className="view-toggle" role="tablist" aria-label="Choose view">
              <button
                type="button"
                role="tab"
                aria-selected={view === "entries"}
                className={`view-toggle__btn ${view === "entries" ? "is-active" : ""}`}
                onClick={() => setView("entries")}
              >
                Entries
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === "monthly"}
                className={`view-toggle__btn ${view === "monthly" ? "is-active" : ""}`}
                onClick={() => setView("monthly")}
              >
                Monthly Summary
              </button>
            </div>
            {view === "entries" && <span className="ledger-column__count">{subtitle}</span>}
          </div>

          {pageError && <p className="page-error" role="alert">{pageError}</p>}

          {view === "entries" ? (
            <>
              <SearchBar onSearch={handleSearch} onClear={handleClearSearch} searching={searching} />

              {searchResults === null && (
                <CategoryFilter
                  categories={allCategories}
                  active={activeCategory}
                  onChange={setActiveCategory}
                />
              )}

              {loading ? (
                <p className="loading-text">Loading the ledger…</p>
              ) : (
                <ExpenseList
                  expenses={displayedExpenses}
                  onDelete={handleDelete}
                  deletingId={deletingId}
                />
              )}
            </>
          ) : monthlyLoading ? (
            <p className="loading-text">Adding up the months…</p>
          ) : (
            <MonthlySummary months={months} />
          )}
        </section>
      </main>

      <footer className="ledger-footer">
        <span>Smart Expense Tracker — Express API + React</span>
      </footer>
    </div>
  );
}
