import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from './models/Restaurant.js';
import FoodItem from './models/FoodItem.js';

dotenv.config();

const restaurants = [
  {
    name: "Spice Garden",
    description: "Authentic Indian cuisine with a modern twist. Experience the rich flavors of traditional spices.",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=300&fit=crop",
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: "123 Main Street, New Delhi"
    },
    cuisine: ["Indian", "Vegetarian", "Spicy"],
    rating: 4.5,
    deliveryTime: "30-40 mins"
  },
  {
    name: "Pizza Paradise",
    description: "Wood-fired pizzas made with fresh ingredients and love. Your slice of heaven awaits!",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop",
    location: {
      latitude: 28.6129,
      longitude: 77.2295,
      address: "456 Pizza Street, New Delhi"
    },
    cuisine: ["Italian", "Pizza", "Fast Food"],
    rating: 4.3,
    deliveryTime: "25-35 mins"
  },
  {
    name: "Burger Barn",
    description: "Juicy burgers and crispy fries. Comfort food at its finest with premium ingredients.",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop",
    location: {
      latitude: 28.6149,
      longitude: 77.2077,
      address: "789 Burger Avenue, New Delhi"
    },
    cuisine: ["American", "Burgers", "Fast Food"],
    rating: 4.2,
    deliveryTime: "20-30 mins"
  },
  {
    name: "Sushi Zen",
    description: "Fresh sushi and Japanese delicacies. Experience the art of Japanese cuisine.",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop",
    location: {
      latitude: 28.6169,
      longitude: 77.2065,
      address: "321 Zen Road, New Delhi"
    },
    cuisine: ["Japanese", "Sushi", "Seafood"],
    rating: 4.7,
    deliveryTime: "35-45 mins"
  },  {
    name: "Taco Fiesta",
    description: "Vibrant Mexican flavors with authentic tacos, burritos, and more. ¡Vamos a comer!",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop",
    location: {
      latitude: 28.6189,
      longitude: 77.2045,
      address: "654 Fiesta Lane, New Delhi"
    },
    cuisine: ["Mexican", "Tacos", "Spicy"],
    rating: 4.4,
    deliveryTime: "25-35 mins"
  },
  {
    name: "Noodle House",
    description: "Slurp-worthy noodles and Asian comfort food. From ramen to pad thai, we've got it all.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=300&fit=crop",
    location: {
      latitude: 28.6199,
      longitude: 77.2088,
      address: "987 Noodle Street, New Delhi"
    },
    cuisine: ["Asian", "Chinese", "Thai"],
    rating: 4.1,
    deliveryTime: "30-40 mins"
  },
  {
    name: "Healthy Bites",
    description: "Nutritious and delicious meals for health-conscious foodies. Eat well, feel great!",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop",
    location: {
      latitude: 28.6179,
      longitude: 77.2111,
      address: "147 Health Avenue, New Delhi"
    },
    cuisine: ["Healthy", "Salads", "Vegan"],
    rating: 4.6,
    deliveryTime: "20-30 mins"
  },
  {
    name: "Dessert Dreams",
    description: "Sweet treats and heavenly desserts. Satisfy your sweet tooth with our divine creations.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=300&fit=crop",
    location: {
      latitude: 28.6209,
      longitude: 77.2055,
      address: "258 Sweet Street, New Delhi"
    },
    cuisine: ["Desserts", "Ice Cream", "Bakery"],
    rating: 4.8,
    deliveryTime: "15-25 mins"
  },  {
    name: "BBQ Masters",
    description: "Smoky BBQ and grilled perfection. Meat lovers paradise with finger-licking good flavors.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=300&fit=crop",
    location: {
      latitude: 28.6219,
      longitude: 77.2033,
      address: "369 Grill Road, New Delhi"
    },
    cuisine: ["BBQ", "Grilled", "American"],
    rating: 4.3,
    deliveryTime: "40-50 mins"
  },
  {
    name: "Coffee & More",
    description: "Artisan coffee and light bites. Perfect spot for coffee lovers and quick snacks.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&h=300&fit=crop",
    location: {
      latitude: 28.6159,
      longitude: 77.2099,
      address: "741 Coffee Corner, New Delhi"
    },
    cuisine: ["Coffee", "Snacks", "Beverages"],
    rating: 4.0,
    deliveryTime: "15-20 mins"
  }
];

const getFoodItemsForRestaurant = (restaurantName, restaurantId) => {
  const foodItemsMap = {    "Spice Garden": [
      { name: "Butter Chicken", description: "Creamy tomato-based curry with tender chicken pieces", price: 320, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop" },
      { name: "Paneer Tikka Masala", description: "Grilled cottage cheese in rich spiced gravy", price: 280, category: "main-course", isVegetarian: true, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop" },
      { name: "Biryani Special", description: "Aromatic basmati rice with spices and your choice of meat", price: 350, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1563379091339-03246954d14e?w=400&h=300&fit=crop" },
      { name: "Samosa (2 pcs)", description: "Crispy pastries filled with spiced potatoes", price: 80, category: "starter", isVegetarian: true, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop" },
      { name: "Gulab Jamun", description: "Sweet milk dumplings in sugar syrup", price: 120, category: "dessert", isVegetarian: true, image: "https://images.unsplash.com/photo-1571197119282-7d67d75d7806?w=400&h=300&fit=crop" }
    ],
    "Pizza Paradise": [
      { name: "Margherita Pizza", description: "Classic pizza with fresh tomatoes, mozzarella, and basil", price: 280, category: "main-course", isVegetarian: true, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop" },
      { name: "Pepperoni Pizza", description: "Spicy pepperoni with mozzarella cheese", price: 350, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop" },
      { name: "Garlic Bread", description: "Crispy bread with garlic butter and herbs", price: 120, category: "starter", isVegetarian: true, image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop" },
      { name: "Caesar Salad", description: "Fresh romaine lettuce with Caesar dressing", price: 180, category: "starter", isVegetarian: true, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop" },
      { name: "Chocolate Brownie", description: "Rich chocolate brownie with vanilla ice cream", price: 150, category: "dessert", isVegetarian: true, image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop" }
    ],
    "Burger Barn": [
      { name: "Classic Beef Burger", description: "Juicy beef patty with lettuce, tomato, and special sauce", price: 250, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop" },
      { name: "Chicken Deluxe", description: "Grilled chicken breast with avocado and bacon", price: 280, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop" },
      { name: "Veggie Burger", description: "Plant-based patty with fresh vegetables", price: 220, category: "main-course", isVegetarian: true, image: "https://images.unsplash.com/photo-1525059696034-4967a729002e?w=400&h=300&fit=crop" },
      { name: "Loaded Fries", description: "Crispy fries with cheese, bacon, and sour cream", price: 180, category: "snack", isVegetarian: false, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop" },
      { name: "Chocolate Milkshake", description: "Thick chocolate milkshake with whipped cream", price: 120, category: "beverage", isVegetarian: true, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop" }
    ],    "Sushi Zen": [
      { name: "California Roll", description: "Crab, avocado, and cucumber roll with sesame", price: 320, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop" },
      { name: "Salmon Nigiri", description: "Fresh salmon over seasoned rice (2 pieces)", price: 280, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop" },
      { name: "Vegetable Tempura", description: "Lightly battered and fried mixed vegetables", price: 220, category: "starter", isVegetarian: true, image: "https://images.unsplash.com/photo-1606270842813-0869a22e4e80?w=400&h=300&fit=crop" },
      { name: "Miso Soup", description: "Traditional Japanese soup with tofu and seaweed", price: 80, category: "starter", isVegetarian: true, image: "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=400&h=300&fit=crop" },
      { name: "Mochi Ice Cream", description: "Sweet rice cake filled with ice cream", price: 150, category: "dessert", isVegetarian: true, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" }
    ],    "Taco Fiesta": [
      { name: "Chicken Tacos (3 pcs)", description: "Soft tacos with grilled chicken and fresh salsa", price: 220, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1565299585323-38174c26ade2?w=400&h=300&fit=crop" },
      { name: "Beef Burrito", description: "Large tortilla filled with beef, rice, and beans", price: 280, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop" },
      { name: "Veggie Quesadilla", description: "Grilled tortilla with cheese and vegetables", price: 200, category: "main-course", isVegetarian: true, image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&h=300&fit=crop" },
      { name: "Guacamole & Chips", description: "Fresh avocado dip with crispy tortilla chips", price: 150, category: "starter", isVegetarian: true, image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop" },
      { name: "Churros", description: "Fried dough sticks with cinnamon sugar", price: 120, category: "dessert", isVegetarian: true, image: "https://images.unsplash.com/photo-1541544181051-e46607bc22a4?w=400&h=300&fit=crop" }
    ],    "Noodle House": [
      { name: "Chicken Ramen", description: "Rich broth with noodles, chicken, and egg", price: 250, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&fit=crop" },
      { name: "Pad Thai", description: "Stir-fried rice noodles with shrimp and peanuts", price: 280, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1559314809-0f31657dcc5e?w=400&h=300&fit=crop" },
      { name: "Vegetable Fried Rice", description: "Wok-fried rice with mixed vegetables", price: 180, category: "main-course", isVegetarian: true, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop" },
      { name: "Spring Rolls (4 pcs)", description: "Crispy rolls filled with vegetables", price: 120, category: "starter", isVegetarian: true, image: "https://images.unsplash.com/photo-1563379091339-03246954d14e?w=400&h=300&fit=crop" },
      { name: "Green Tea", description: "Traditional Asian green tea", price: 60, category: "beverage", isVegetarian: true, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop" }
    ],    "Healthy Bites": [
      { name: "Quinoa Buddha Bowl", description: "Nutritious bowl with quinoa, vegetables, and tahini", price: 280, category: "main-course", isVegetarian: true, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop" },
      { name: "Grilled Chicken Salad", description: "Fresh greens with grilled chicken and vinaigrette", price: 250, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop" },
      { name: "Avocado Toast", description: "Multigrain bread with smashed avocado and seeds", price: 180, category: "snack", isVegetarian: true, image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop" },
      { name: "Smoothie Bowl", description: "Acai bowl topped with fresh fruits and granola", price: 220, category: "snack", isVegetarian: true, image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop" },
      { name: "Fresh Juice", description: "Cold-pressed orange or green juice", price: 120, category: "beverage", isVegetarian: true, image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop" }
    ],    "Dessert Dreams": [
      { name: "Chocolate Lava Cake", description: "Warm chocolate cake with molten center", price: 180, category: "dessert", isVegetarian: true, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop" },
      { name: "Strawberry Cheesecake", description: "Creamy cheesecake with strawberry topping", price: 200, category: "dessert", isVegetarian: true, image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=300&fit=crop" },
      { name: "Ice Cream Sundae", description: "Three scoops with chocolate sauce and nuts", price: 150, category: "dessert", isVegetarian: true, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
      { name: "Macarons (6 pcs)", description: "Colorful French macarons in assorted flavors", price: 250, category: "dessert", isVegetarian: true, image: "https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=400&h=300&fit=crop" },
      { name: "Hot Chocolate", description: "Rich hot chocolate with marshmallows", price: 100, category: "beverage", isVegetarian: true, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop" }
    ],    "BBQ Masters": [
      { name: "BBQ Ribs", description: "Slow-cooked pork ribs with smoky BBQ sauce", price: 450, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop" },
      { name: "Grilled Steak", description: "Premium beef steak grilled to perfection", price: 520, category: "main-course", isVegetarian: false, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
      { name: "BBQ Chicken Wings", description: "Spicy chicken wings with BBQ glaze", price: 280, category: "starter", isVegetarian: false, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop" },
      { name: "Corn on the Cob", description: "Grilled corn with butter and spices", price: 120, category: "starter", isVegetarian: true, image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop" },
      { name: "Apple Pie", description: "Classic apple pie with vanilla ice cream", price: 180, category: "dessert", isVegetarian: true, image: "https://images.unsplash.com/photo-1535920527002-b35e96722406?w=400&h=300&fit=crop" }
    ],    "Coffee & More": [
      { name: "Cappuccino", description: "Espresso with steamed milk and foam", price: 120, category: "beverage", isVegetarian: true, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop" },
      { name: "Latte", description: "Espresso with steamed milk and light foam", price: 140, category: "beverage", isVegetarian: true, image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop" },
      { name: "Croissant", description: "Buttery, flaky pastry perfect with coffee", price: 80, category: "snack", isVegetarian: true, image: "https://images.unsplash.com/photo-1555507036-ab794f27f799?w=400&h=300&fit=crop" },
      { name: "Sandwich", description: "Fresh sandwich with your choice of filling", price: 180, category: "snack", isVegetarian: true, image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop" },
      { name: "Muffin", description: "Freshly baked muffin in chocolate or blueberry", price: 100, category: "snack", isVegetarian: true, image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop" }
    ]
  };

  return (foodItemsMap[restaurantName] || []).map(item => ({
    ...item,
    restaurant: restaurantId,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10 // Random rating between 3.0 and 5.0
  }));
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    console.log('Cleared existing data');

    // Create restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`Created ${createdRestaurants.length} restaurants`);

    // Create food items for each restaurant
    let totalFoodItems = 0;
    for (const restaurant of createdRestaurants) {
      const foodItems = getFoodItemsForRestaurant(restaurant.name, restaurant._id);
      if (foodItems.length > 0) {
        await FoodItem.insertMany(foodItems);
        totalFoodItems += foodItems.length;
      }
    }

    console.log(`Created ${totalFoodItems} food items`);
    console.log('Database seeded successfully!');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
