import Restaurant from '../models/Restaurant.js';
import FoodItem from '../models/FoodItem.js';

// Get all restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true })
      .populate('foodItems')
      .sort({ createdAt: -1 });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('foodItems');

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get food items for a restaurant
export const getRestaurantFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ 
      restaurant: req.params.id,
      isAvailable: true 
    }).populate('restaurant', 'name');

    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create restaurant (for seeding data)
export const createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
