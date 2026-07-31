process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../src/backend/app");
const { resetStore } = require("../src/backend/utils/store");


beforeEach(() => {
  resetStore();
});

describe("Health check", () => {
  it("GET /api/health returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("POST /api/expenses", () => {
  it("creates a valid expense and returns 201", async () => {
    const payload = { title: "Groceries", amount: 45.5, category: "Food", date: "2026-07-15" };
    const res = await request(app).post("/api/expenses").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: "Groceries",
      amount: 45.5,
      category: "Food",
      date: "2026-07-15",
    });
    expect(res.body.id).toBeDefined();
  });

  it("rejects a missing title with 400", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .send({ amount: 10, category: "Food", date: "2026-07-15" });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.stringContaining("title")])
    );
  });

  it("rejects a negative or zero amount with 400", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .send({ title: "Bad expense", amount: -5, category: "Food", date: "2026-07-15" });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.stringContaining("amount")])
    );
  });

  it("rejects a malformed date with 400", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .send({ title: "Bad date", amount: 10, category: "Food", date: "15-07-2026" });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([expect.stringContaining("date")])
    );
  });

  it("rejects a non-numeric amount with 400", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .send({ title: "Bad amount", amount: "ten", category: "Food", date: "2026-07-15" });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/expenses", () => {
  it("returns an empty list initially", async () => {
    const res = await request(app).get("/api/expenses");
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.expenses).toEqual([]);
  });

  it("returns all created expenses", async () => {
    await request(app).post("/api/expenses").send({ title: "Coffee", amount: 4, category: "Food", date: "2026-07-01" });
    await request(app).post("/api/expenses").send({ title: "Bus ticket", amount: 2.5, category: "Transport", date: "2026-07-02" });

    const res = await request(app).get("/api/expenses");
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
  });

  it("filters by category, case-insensitively", async () => {
    await request(app).post("/api/expenses").send({ title: "Coffee", amount: 4, category: "Food", date: "2026-07-01" });
    await request(app).post("/api/expenses").send({ title: "Bus ticket", amount: 2.5, category: "Transport", date: "2026-07-02" });

    const res = await request(app).get("/api/expenses").query({ category: "food" });
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.expenses[0].title).toBe("Coffee");
  });

  it("returns an empty list for a category with no matches", async () => {
    await request(app).post("/api/expenses").send({ title: "Coffee", amount: 4, category: "Food", date: "2026-07-01" });

    const res = await request(app).get("/api/expenses").query({ category: "Entertainment" });
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
  });
});

describe("GET /api/expenses/:id", () => {
  it("returns a single expense by id", async () => {
    const created = await request(app).post("/api/expenses").send({ title: "Coffee", amount: 4, category: "Food", date: "2026-07-01" });

    const res = await request(app).get(`/api/expenses/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Coffee");
  });

  it("returns 404 for an unknown id", async () => {
    const res = await request(app).get("/api/expenses/does-not-exist");
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/expenses/:id", () => {
  it("deletes an existing expense", async () => {
    const created = await request(app).post("/api/expenses").send({ title: "Coffee", amount: 4, category: "Food", date: "2026-07-01" });

    const del = await request(app).delete(`/api/expenses/${created.body.id}`);
    expect(del.status).toBe(200);

    const getAfter = await request(app).get(`/api/expenses/${created.body.id}`);
    expect(getAfter.status).toBe(404);
  });

  it("returns 404 when deleting a non-existent expense", async () => {
    const res = await request(app).delete("/api/expenses/does-not-exist");
    expect(res.status).toBe(404);
  });
});

describe("GET /api/expenses/summary/totals", () => {
  it("returns zero totals when there are no expenses", async () => {
    const res = await request(app).get("/api/expenses/summary/totals");
    expect(res.status).toBe(200);
    expect(res.body.overall).toBe(0);
    expect(res.body.byCategory).toEqual({});
  });

  it("calculates overall total and per-category totals correctly", async () => {
    await request(app).post("/api/expenses").send({ title: "Coffee", amount: 4.5, category: "Food", date: "2026-07-01" });
    await request(app).post("/api/expenses").send({ title: "Lunch", amount: 12.25, category: "Food", date: "2026-07-02" });
    await request(app).post("/api/expenses").send({ title: "Bus ticket", amount: 2.5, category: "Transport", date: "2026-07-03" });

    const res = await request(app).get("/api/expenses/summary/totals");
    expect(res.status).toBe(200);
    expect(res.body.overall).toBe(19.25);
    expect(res.body.byCategory).toEqual({
      Food: 16.75,
      Transport: 2.5,
    });
  });
});

describe("GET /api/expenses/search", () => {
  it("finds expenses by a case-insensitive title match", async () => {
    await request(app).post("/api/expenses").send({ title: "Morning Coffee", amount: 4, category: "Food", date: "2026-07-01" });
    await request(app).post("/api/expenses").send({ title: "Bus ticket", amount: 2.5, category: "Transport", date: "2026-07-02" });

    const res = await request(app).get("/api/expenses/search").query({ q: "coffee" });
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.expenses[0].title).toBe("Morning Coffee");
  });

  it("also matches on category, not just title", async () => {
    await request(app).post("/api/expenses").send({ title: "Coffee", amount: 4, category: "Food", date: "2026-07-01" });
    await request(app).post("/api/expenses").send({ title: "Bus ticket", amount: 2.5, category: "Transport", date: "2026-07-02" });

    const res = await request(app).get("/api/expenses/search").query({ q: "transport" });
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.expenses[0].title).toBe("Bus ticket");
  });

  it("returns an empty result set for no matches", async () => {
    await request(app).post("/api/expenses").send({ title: "Coffee", amount: 4, category: "Food", date: "2026-07-01" });

    const res = await request(app).get("/api/expenses/search").query({ q: "zzz-no-match" });
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
  });

  it("returns 400 when q is missing or empty", async () => {
    const res = await request(app).get("/api/expenses/search");
    expect(res.status).toBe(400);

    const res2 = await request(app).get("/api/expenses/search").query({ q: "   " });
    expect(res2.status).toBe(400);
  });
});

describe("GET /api/expenses/summary/monthly", () => {
  it("returns an empty months array when there are no expenses", async () => {
    const res = await request(app).get("/api/expenses/summary/monthly");
    expect(res.status).toBe(200);
    expect(res.body.months).toEqual([]);
  });

  it("groups totals by month, most recent first, with per-category breakdown", async () => {
    await request(app).post("/api/expenses").send({ title: "Coffee", amount: 4, category: "Food", date: "2026-06-15" });
    await request(app).post("/api/expenses").send({ title: "Lunch", amount: 10, category: "Food", date: "2026-07-01" });
    await request(app).post("/api/expenses").send({ title: "Bus ticket", amount: 2.5, category: "Transport", date: "2026-07-02" });

    const res = await request(app).get("/api/expenses/summary/monthly");
    expect(res.status).toBe(200);
    expect(res.body.months).toEqual([
      { month: "2026-07", total: 12.5, byCategory: { Food: 10, Transport: 2.5 } },
      { month: "2026-06", total: 4, byCategory: { Food: 4 } },
    ]);
  });
});

describe("Unknown routes", () => {
  it("returns 404 for an undefined route", async () => {
    const res = await request(app).get("/api/not-a-real-route");
    expect(res.status).toBe(404);
  });
});
