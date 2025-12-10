import express from 'express';
import { login, logout, isAdminPasswordSet } from '../middleware/auth.js';

const router = express.Router();

// Check if admin password is set
router.get('/status', async (req, res) => {
  try {
    const isPasswordSet = await isAdminPasswordSet();
    res.json({
      success: true,
      isPasswordSet
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Status check failed' });
  }
});

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

export default router;