import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxLength: [100, 'Restaurant name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Restaurant description is required'],
    maxLength: [500, 'Description cannot be more than 500 characters']
  },
  image: {
    type: String,
    default: null
  },
  location: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    }
  },
  cuisine: {
    type: [String],
    required: [true, 'At least one cuisine type is required']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },  deliveryTime: {
    type: String,
    default: '30-45 mins'
  },
  keywords: {
    type: [String],
    default: []
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  deliveryFee: {
    type: Number,
    default: 3.99
  },
  minimumOrder: {
    type: Number,
    default: 15.00
  },
  specialOffers: {
    type: [String],
    default: []
  },
  hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  foodItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem'
  }]
}, {
  timestamps: true
});

export default mongoose.model('Restaurant', restaurantSchema);
