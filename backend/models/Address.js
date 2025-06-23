import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  label: {
    type: String,
    required: [true, 'Address label is required'],
    trim: true,
    maxLength: [50, 'Label cannot be more than 50 characters']
  },
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true,
    maxLength: [200, 'Street address cannot be more than 200 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxLength: [50, 'City cannot be more than 50 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxLength: [50, 'State cannot be more than 50 characters']
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required'],
    match: [/^\d{5,6}$/, 'Please enter a valid ZIP code']
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Address', addressSchema);
