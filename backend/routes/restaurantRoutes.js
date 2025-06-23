import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantFoodItems,
  createRestaurant
} from '../controllers/restaurantController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (accessible without authentication for now)
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/food-items', getRestaurantFoodItems);

// For seeding data (in production, this would be admin-only)
router.post('/', createRestaurant);

export default router;
