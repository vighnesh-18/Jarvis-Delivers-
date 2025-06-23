import Order from '../models/Order.js';
import FoodItem from '../models/FoodItem.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, totalAmount, paymentMethod, specialInstructions } = req.body;

    // Validate food items and calculate total
    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const foodItem = await FoodItem.findById(item._id).populate('restaurant');
      if (!foodItem) {
        return res.status(404).json({ message: `Food item not found: ${item._id}` });
      }

      if (!foodItem.isAvailable) {
        return res.status(400).json({ message: `Food item not available: ${foodItem.name}` });
      }

      const itemTotal = foodItem.price * item.quantity;
      calculatedTotal += itemTotal;

      orderItems.push({
        foodItem: foodItem._id,
        name: foodItem.name,
        price: foodItem.price,
        quantity: item.quantity
      });
    }

    // Add delivery fee and taxes
    const deliveryFee = 50;
    const taxes = Math.round(calculatedTotal * 0.18);
    const finalTotal = calculatedTotal + deliveryFee + taxes;

    // Get restaurant from first food item (assuming all items are from same restaurant)
    const firstFoodItem = await FoodItem.findById(items[0]._id);
    const restaurantId = firstFoodItem.restaurant;

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      restaurant: restaurantId,
      deliveryAddress,
      totalAmount: finalTotal,
      deliveryFee,
      taxes,
      paymentMethod,
      specialInstructions
    });

    await order.save();
    await order.populate(['restaurant', 'items.foodItem']);

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name')
      .populate('items.foodItem', 'name image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    })
      .populate('restaurant', 'name location')
      .populate('items.foodItem', 'name image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (for testing purposes)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    
    if (orderStatus === 'delivered') {
      order.actualDeliveryTime = new Date();
      order.paymentStatus = 'paid';
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
