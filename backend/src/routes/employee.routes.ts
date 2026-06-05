import { Router } from 'express';
import { createEmployee, listEmployees } from '../controllers/employee.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// POST /employees - Create new employee
// Protected route (authentication required)
router.post('/', authMiddleware, createEmployee);

// GET /employees - List all employees
// Protected route (authentication required)
router.get('/', authMiddleware, listEmployees);

export default router;