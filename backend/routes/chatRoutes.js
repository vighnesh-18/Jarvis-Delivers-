import express from 'express';
import { processUserQuery, getRecommendations, addToCartFromChat } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Optional auth middleware - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const jwt = await import('jsonwebtoken');
      const User = (await import('../models/User.js')).default;
      
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Process user query with AI agents (optional auth for better UX)
router.post('/process', optionalAuth, processUserQuery);

// Get AI recommendations (optional auth)
router.post('/recommendations', optionalAuth, getRecommendations);

// Add item to cart from chat (requires auth)
router.post('/add-to-cart', authMiddleware, addToCartFromChat);

export default router;
