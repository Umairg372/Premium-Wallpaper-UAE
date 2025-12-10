import express from 'express';
import { db } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all customer messages
router.get('/', authenticateToken, (req, res) => {
  const sql = `
    SELECT 
      id,
      name,
      email,
      phone,
      message,
      preferred_date as preferredDate,
      created_at as createdAt
    FROM contact_messages
    ORDER BY created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching customer messages:', err);
      return res.status(500).json({ error: 'Failed to fetch customer messages' });
    }
    res.json(rows);
  });
});

// DELETE a specific message
router.delete('/:id', authenticateToken, (req, res) => {
  const messageId = req.params.id;

  const sql = 'DELETE FROM contact_messages WHERE id = ?';

  db.run(sql, [messageId], function(err) {
    if (err) {
      console.error('Error deleting customer message:', err);
      return res.status(500).json({ error: 'Failed to delete customer message' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({ message: 'Message deleted successfully' });
  });
});

// DELETE all messages
router.delete('/', authenticateToken, (req, res) => {
  const sql = 'DELETE FROM contact_messages';

  db.run(sql, [], function(err) {
    if (err) {
      console.error('Error deleting all customer messages:', err);
      return res.status(500).json({ error: 'Failed to delete customer messages' });
    }
    
    res.json({ message: `${this.changes} messages deleted successfully` });
  });
});

export default router;