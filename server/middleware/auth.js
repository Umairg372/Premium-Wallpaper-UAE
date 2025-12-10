import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../database/init.js'; // Import the raw db instance

console.log('DEBUG (Backend): JWT_SECRET loaded:', process.env.JWT_SECRET ? '****** (present)' : 'NOT FOUND');

// --- Helper Functions ---

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// --- Exported Middleware and Functions ---

/**
 * Checks if an admin password has been set in the database.
 * This is now asynchronous and uses a callback/Promise.
 */
export function isAdminPasswordSet() {
  return new Promise((resolve, reject) => {
    db.get('SELECT password_hash FROM admin_password WHERE id = 1', [], (err, row) => {
      if (err) {
        console.error('Error checking password status:', err);
        return reject(err);
      }
      resolve(row !== undefined && row !== null);
    });
  });
}

/**
 * Sets or updates the admin password in the database.
 */
export function setAdminPassword(password) {
    return new Promise((resolve, reject) => {
        if (!password || password.length < 6) {
            return reject(new Error('Password must be at least 6 characters long.'));
        }
        const passwordHash = hashPassword(password);
        db.run(
            `INSERT OR REPLACE INTO admin_password (id, password_hash) VALUES (1, ?)`,
            [passwordHash],
            (err) => {
                if (err) {
                    console.error('Error setting password:', err);
                    return reject(err);
                }
                console.log('Admin password updated in database');
                resolve();
            }
        );
    });
}

/**
 * Express middleware to authenticate a JWT.
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
}

/**
 * Handles the admin login process.
 */
export const login = (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  db.get('SELECT password_hash FROM admin_password WHERE id = 1', [], (err, row) => {
    if (err) {
      console.error('Login error (db access):', err);
      return res.status(500).json({ error: 'Login failed due to a server error.' });
    }

    if (!row) {
      return res.status(401).json({ error: 'No admin password has been set.' });
    }

    const storedPasswordHash = row.password_hash;
    const inputPasswordHash = hashPassword(password);

    if (inputPasswordHash === storedPasswordHash) {
      const payload = { user: 'admin' };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
      return res.json({
        success: true,
        token,
        message: 'Login successful'
      });
    } else {
      return res.status(401).json({ error: 'Invalid password' });
    }
  });
};

/**
 * Handles the admin logout process.
 */
export const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully. Please clear the token on the client.' });
};