import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from './models/Restaurant.js';
import FoodItem from './models/FoodItem.js';

dotenv.config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to jarvis-delivers database');
    
    const restaurants = await Restaurant.find({});
    console.log(`Found ${restaurants.length} restaurants:`);
    
    for (const restaurant of restaurants) {
      const foodItems = await FoodItem.find({ restaurant: restaurant._id });
      console.log(`- ${restaurant.name}: ${foodItems.length} food items`);
    }
    
    const totalFoodItems = await FoodItem.countDocuments();
    console.log(`Total food items: ${totalFoodItems}`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();
