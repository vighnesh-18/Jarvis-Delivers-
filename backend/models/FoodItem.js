import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food item name is required'],
    trim: true,
    maxLength: [100, 'Food item name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Food item description is required'],
    maxLength: [300, 'Description cannot be more than 300 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    default: null
  },  category: {
    type: String,
    required: [true, 'Category is required'],
    default: 'main-course'
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  tags: {
    type: [String],
    default: []
  },
  keywords: {
    type: [String],
    default: []
  },
  calories: {
    type: Number,
    default: 0
  },
  spiceLevel: {
    type: String,
    enum: ['None', 'Mild', 'Medium', 'Hot', 'Very Hot'],
    default: 'None'
  },
  allergens: {
    type: [String],
    default: []
  },
  nutritionInfo: {
    protein: String,
    carbs: String,
    fat: String,
    fiber: String
  },
  ingredients: {
    type: [String],
    default: []
  },
  servingSize: {
    type: String,
    default: '1 portion'
  },  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant reference is required']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  preparationTime: {
    type: String,
    default: '15-20 mins'
  }
}, {
  timestamps: true
});

export default mongoose.model('FoodItem', foodItemSchema);
