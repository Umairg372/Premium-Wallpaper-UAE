import express from 'express';
import { setAdminPassword, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Set admin password (initial setup)
router.post('/setup', async (req, res) => {
  try {
    const { password } = req.body;

    // Basic validation
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Set the admin password
    await setAdminPassword(password);

    res.json({
      success: true,
      message: 'Admin password set successfully'
    });
  } catch (error) {
    console.error('Password setup error:', error);
    res.status(500).json({ error: 'Password setup failed' });
  }
});

// Change admin password (requires authentication)
router.post('/change', authenticateToken, async (req, res) => {
  try {
    const { newPassword } = req.body;

    // Basic validation
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Set the new admin password
    await setAdminPassword(newPassword);

    res.json({
      success: true,
      message: 'Admin password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Password change failed' });
  }
});

export default router;