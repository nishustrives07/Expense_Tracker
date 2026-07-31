const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.errors ? data.errors.join(" ") : data.error || "Request failed.";
    throw new Error(message);
  }

  return data;
}

export function fetchExpenses(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return request(`/expenses${query}`);
}

export function fetchTotals() {
  return request("/expenses/summary/totals");
}

export function searchExpenses(query) {
  return request(`/expenses/search?q=${encodeURIComponent(query)}`);
}

export function fetchMonthlySummary() {
  return request("/expenses/summary/monthly");
}

export function createExpense(payload) {
  return request("/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteExpense(id) {
  return request(`/expenses/${id}`, { method: "DELETE" });
}
