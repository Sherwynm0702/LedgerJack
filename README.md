# LedgerJack

A full-stack business management system for tracking employees, expenses, and payroll — built with React, TypeScript, Express, and PostgreSQL.

## Features

- **Authentication** — secure register/login with hashed passwords (bcrypt) and JWT-based sessions
- **Employee Management** — full CRUD: add, edit, and remove employees with salary tracking
- **Expense Tracking** — log, edit, categorize, and delete business expenses (scoped per user)
- **Payroll** — run payroll per employee and view a full historical record of every run
- **Dashboard** — live analytics: total employees, total expenses, and payroll record count

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL with Prisma ORM |
| Auth | JWT, bcrypt |

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/Sherwynm0702/LedgerJack.git
   cd LedgerJack
   ```

2. Install dependencies:
   ```bash
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. Configure environment variables — create `backend/.env` (see `backend/.env.example`):
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/ledgerjack"
   JWT_SECRET="your-strong-secret-here"
   PORT=3000
   ```

4. Run database migrations:
   ```bash
   cd backend && npx prisma migrate dev
   ```

5. Start both servers (from the project root):
   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:5173`, backend on `http://localhost:3000`.

## Project Structure

```
LedgerJack/
├── backend/
│   └── src/
│       ├── controllers/   # Request handlers (auth, employee, expense, payroll)
│       ├── routes/        # Express route definitions
│       ├── middleware/     # JWT auth middleware
│       └── utils/         # Prisma client
└── frontend/
    └── src/
        ├── pages/         # Dashboard, Employees, Expenses, Payroll, Login, Register
        ├── components/    # Navbar, ProtectedRoute
        ├── contexts/      # AuthContext
        └── services/      # Axios API instance
```

## License

MIT
