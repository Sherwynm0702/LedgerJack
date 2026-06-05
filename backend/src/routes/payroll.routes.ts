import { Router } from 'express';
import { calculatePayroll } from '../controllers/payroll.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// POST /payroll/calculate - Calculate payroll for an employee
router.post('/calculate', authMiddleware, calculatePayroll);

export default router;