import FoodItem from '../models/FoodItem.js';

// Get all food items
export const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ isAvailable: true })
      .populate('restaurant', 'name location')
      .sort({ createdAt: -1 });

    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get food item by ID
export const getFoodItemById = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id)
      .populate('restaurant', 'name location');

    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get food items by restaurant
export const getFoodItemsByRestaurant = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ 
      restaurant: req.params.restaurantId,
      isAvailable: true 
    }).populate('restaurant', 'name');

    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create food item (for seeding data)
export const createFoodItem = async (req, res) => {
  try {
    const foodItem = new FoodItem(req.body);
    await foodItem.save();

    res.status(201).json({
      message: 'Food item created successfully',
      foodItem
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
