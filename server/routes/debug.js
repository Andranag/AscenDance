import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// This is a temporary endpoint for debugging purposes
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Don't return passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
