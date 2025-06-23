import express from 'express';
import {
  getAllFoodItems,
  getFoodItemById,
  getFoodItemsByRestaurant,
  createFoodItem
} from '../controllers/foodItemController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllFoodItems);
router.get('/:id', getFoodItemById);
router.get('/restaurant/:restaurantId', getFoodItemsByRestaurant);

// For seeding data (in production, this would be admin-only)
router.post('/', createFoodItem);

export default router;
