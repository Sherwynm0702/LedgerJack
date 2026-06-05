import { Router } from 'express';
import { createExpense, listExpenses, getExpense, updateExpense, deleteExpense } from '../controllers/expense.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// POST /expenses - Create new expense
router.post('/', authMiddleware, createExpense);

// GET /expenses - List all expenses for authenticated user
router.get('/', authMiddleware, listExpenses);

// GET /expenses/:id - Get single expense
router.get('/:id', authMiddleware, getExpense);

// PUT /expenses/:id - Update expense
router.put('/:id', authMiddleware, updateExpense);

// DELETE /expenses/:id - Delete expense
router.delete('/:id', authMiddleware, deleteExpense);

export default router;