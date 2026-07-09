import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// POST /auth/register - Create new user
// Public route (no authentication required)
router.post('/register', register);

// POST /auth/login - Authenticate user and get token
// Public route (no authentication required)
router.post('/login', login);

export default router;