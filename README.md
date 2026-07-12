# LedgerJack

LedgerJack is a small business management app for tracking employees, expenses, and payroll in one place. I built it as a full-stack project to get more comfortable with the things real apps need — auth, keeping each user's data separate, some actual business logic, and a UI that looks reasonably polished.

It's a learning project, but I tried to build it like something that could actually be used rather than just a demo.

**Live demo:** https://ledger-jack.vercel.app

You can log in with the demo account instead of registering:

- Email: `admin@biztrack.com`
- Password: `password123`

> Note: the backend is hosted on a free tier that sleeps when idle, so the first request can take 30–50 seconds to spin up. It's fast after that.

![LedgerJack dashboard](docs/screenshot-dashboard.png)

## What it does

- Register and log in (passwords are hashed, sessions use JWTs, and the app's pages are protected)
- Add, edit, and remove employees along with their salaries
- Log business expenses by category, and edit or delete them
- Run payroll for an employee and keep a history of every run
- View a dashboard with totals and an expenses-by-category chart

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Prisma
- **Auth:** JWT + bcrypt
- **Hosting:** Vercel (frontend), Render (backend), Neon (database)

## A few things I put thought into

- **Data is scoped per user.** You only see your own employees, expenses, and payroll, and that's checked on the server — not just hidden in the UI. Requesting a record that isn't yours returns a 404.
- **Payroll can't run twice in a month** for the same employee, and each record stores the salary as it was at the time. So editing someone's salary later doesn't change their past payroll records.
- **Small UX details** like toast notifications, confirm dialogs before deleting, and proper loading/empty/error states.

## Things I'd add next

Stuff I left out to keep the scope manageable, but would do for a real version:

- Dashboard totals filtered by time period (e.g. this month) instead of all-time
- Soft-deletes for payroll records instead of deleting them outright
- Tests and a CI pipeline
- Rate limiting and better security headers

## Running it locally

You'll need Node.js 18+ and a PostgreSQL database.

```bash
# 1. Clone
git clone https://github.com/Sherwynm0702/LedgerJack.git
cd LedgerJack

# 2. Install (root, backend, frontend)
npm install
npm install --prefix backend
npm install --prefix frontend
```

Create a `backend/.env` file (there's a `.env.example` to copy from):

```
DATABASE_URL="postgresql://user:password@localhost:5432/ledgerjack"
JWT_SECRET="your-strong-secret-here"
PORT=3000
```

Then set up the database and start both servers:

```bash
cd backend && npx prisma migrate dev && cd ..
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3000`.

## Project structure

```
LedgerJack/
├── backend/
│   └── src/
│       ├── controllers/   # Auth, employee, expense, payroll logic
│       ├── routes/        # Express routes
│       ├── middleware/    # JWT auth check
│       └── utils/         # Prisma client
└── frontend/
    └── src/
        ├── pages/         # Dashboard, Employees, Expenses, Payroll, Login, Register
        ├── components/    # Navbar, UI components
        ├── contexts/      # Auth context
        └── services/      # Axios setup
```

## License

MIT
