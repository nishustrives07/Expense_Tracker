# The Daily Ledger – Smart Expense Tracker API

## Overview

The Daily Ledger is a RESTful Expense Tracker API built using **Node.js** and **Express.js** for managing personal expenses. The application allows users to create, retrieve, filter, summarize, and delete expenses while persisting data in a local JSON file without requiring a database.

Beyond implementing the required functionality, this project was approached as a software engineering exercise. The focus was not only on building a working API but also on following a structured development workflow—understanding requirements, designing the solution, implementing modular code, validating the implementation through testing, and documenting the project clearly. Details of the AI-assisted development process are provided in **AI_NOTES.md**.

---

## Features

- Add a new expense
- View all expenses
- Filter expenses by category
- Calculate overall expense total
- Calculate category-wise expense totals
- Delete an expense
- Store expense data in a local JSON file (no database required)

## Bonus Feature

### Search Expenses

As an optional enhancement, I implemented an **Expense Search** endpoint that allows users to quickly locate expenses without manually browsing the complete list.

The endpoint performs **case-insensitive partial matching** on both the **title** and **category** fields, making it easier to retrieve relevant expense records.

**Endpoint**

```http
GET /api/expenses/search?q=<keyword>
```

**Example**

```http
GET /api/expenses/search?q=groceries
```

**Example Response**

```json
[
  {
    "id": "b7d2c4f1",
    "title": "Groceries",
    "amount": 45.50,
    "category": "Food",
    "date": "2026-07-15"
  }
]
```

### Why this feature?

Searching is a common requirement in real-world expense management applications, where users often need to quickly locate a specific transaction based on its title or category. This enhancement improves the usability of the API while keeping the implementation lightweight and consistent with the overall project architecture.

## Tech Stack

- Node.js
- Express.js
- Jest
- Supertest
- Git & GitHub
- Local JSON File Storage

---

## Project Structure

```text
Expense_Tracker/
│
├── README.md
├── AI_NOTES.md
├── package.json
├── jest.config.js
│
├── src/
│   ├── backend/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── data/
│   │
│   └── frontend/
│
└── tests/
```

---

## Installation

### Backend

From the project root, install the backend dependencies:

```bash
npm install
```

### Frontend 

The repository also includes a React frontend.

Navigate to the frontend directory and install its dependencies:

```bash
cd src/frontend
npm install
```

---
## Running the Backend Server

From the project root, start the Express backend server:

```bash
npm start
```

The backend server starts on:

```
http://localhost:5000
```

For development with automatic restart:

```bash
npm run dev
```

---

## Running the Frontend 

Open a new terminal and navigate to the frontend directory:

```bash
cd src/frontend
```

Start the React development server:

```bash
npm run dev
```

The frontend starts on:

```
http://localhost:5173
```

The frontend communicates with the backend running on:

```
http://localhost:5000
```

---

## Running the Tests

From the project root, execute the automated test suite:

```bash
npm test
```

The Jest and Supertest tests run directly against the Express application and do not require the backend server to be running.

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Health Check |
| GET | `/api/expenses` | View all expenses |
| GET | `/api/expenses?category=Food` | Filter expenses by category |
| POST | `/api/expenses` | Add a new expense |
| DELETE | `/api/expenses/:id` | Delete an expense |
| GET | `/api/expenses/summary/totals` | Overall and category-wise totals |
| GET | `/api/expenses/search?q=<keyword>` | Bonus – Search expenses |

---

## Expense Object

```json
{
  "title": "Groceries",
  "amount": 45.50,
  "category": "Food",
  "date": "2026-07-15"
}
```

### Validation Rules

- Title must be a non-empty string.
- Amount must be greater than 0.
- Category must be a non-empty string.
- Date must follow the `YYYY-MM-DD` format.

---

## Engineering Approach

I approached this assignment with the mindset of building software in a professional engineering environment rather than simply completing a coding task. Having previously contributed to an expense management application during my internship, I understood the importance of first analyzing the requirements, identifying the application's workflow, and designing the solution before implementation. I followed the same engineering approach for this assignment.
Before writing any code, I carefully analyzed the assignment requirements and broke the problem into smaller functional modules, including expense management, filtering, summary calculation, validation, persistence, and testing. This helped me understand the complete workflow and design the API structure before implementation.

Once the requirements were clear, I organized the project into separate layers for routing, controllers, utilities, storage, and testing. Establishing this structure early made the code easier to understand, maintain, and extend.

To improve development efficiency, I used AI tools as engineering assistants during implementation. Instead of treating the generated output as the final solution, I considered it an initial implementation. Every module was reviewed individually to understand the underlying logic, verify that it satisfied the assignment requirements, and refine the implementation wherever necessary.

The completed application was validated using both automated tests and manual API testing to verify endpoint behaviour, input validation, error handling, and data persistence.

This workflow reflects the software engineering approach I aim to follow while contributing to a product engineering team—understanding the problem first, designing the solution, using AI responsibly to improve productivity, critically reviewing generated code, validating the implementation through testing, and documenting the final project clearly.

---

## Design Decisions

- Used a local JSON file for persistence because it satisfies the assignment requirements while keeping the project lightweight.
- Structured the project into controllers, routes, and utility modules to improve separation of concerns.
- Implemented input validation before persisting data.
- Wrote automated tests using Jest and Supertest.
- Added a health check endpoint for quick API verification.

---

## Testing

The application was verified using automated tests written with **Jest** and **Supertest**. In addition, the API endpoints were manually tested to validate request handling, response behaviour, data persistence, and error scenarios.

Before submission, the installation, server startup, and test commands documented in this README were verified on a clean project setup to ensure they execute successfully without additional configuration.

---

## Future Improvements

If this project were extended further, the following enhancements could be considered:

- User authentication and authorization
- Database integration
- Pagination and sorting
- Expense analytics dashboard
- Role-based access control

---

