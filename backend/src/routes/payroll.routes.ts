import { Router } from 'express';
import { calculatePayroll, getPayrollRecords } from '../controllers/payroll.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// POST /payroll/calculate - Calculate payroll for an employee
router.post('/calculate', authMiddleware, calculatePayroll);
router.get('/records', authMiddleware, getPayrollRecords);

export default router;