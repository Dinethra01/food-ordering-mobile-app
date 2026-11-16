const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FoodItem = require('./models/FoodItem');
const connectDB = require('./config/db');

dotenv.config();

const sampleFoodItems = [
  {
    name: 'Classic Cheeseburger',
    price: 1650.0,
    description: 'Juicy grilled beef patty topped with melted cheddar cheese, fresh lettuce, tomatoes, and special house sauce on a toasted brioche bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    stockQuantity: 25,
    category: 'Main Course',
    isAvailable: true,
  },
  {
    name: 'Pepperoni Supreme Pizza',
    price: 2850.0,
    description: 'Crispy stone-baked crust loaded with rich tomato sauce, premium mozzarella cheese, and generous slices of smoky pepperoni.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
    stockQuantity: 15,
    category: 'Main Course',
    isAvailable: true,
  },
  {
    name: 'Sri Lankan Chicken Kottu',
    price: 1450.0,
    description: 'Aromatic chopped godamba roti tossed on hot griddle with spiced tender chicken, eggs, green chillies, and rich curry gravy.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    stockQuantity: 30,
    category: 'Main Course',
    isAvailable: true,
  },
  {
    name: 'Seafood Nasi Goreng',
    price: 1950.0,
    description: 'Fragrant wok-tossed spicy rice with fresh prawns, calamari rings, fried egg, chicken satay skewer, and crispy prawn crackers.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    stockQuantity: 20,
    category: 'Main Course',
    isAvailable: true,
  },
  {
    name: 'Crispy Chicken Tender Bucket',
    price: 2200.0,
    description: 'Golden crispy crumbed chicken tenders served with honey mustard and homemade garlic mayo dips.',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',
    stockQuantity: 30,
    category: 'Starters',
    isAvailable: true,
  },
  {
    name: 'Garlic Butter Fries',
    price: 850.0,
    description: 'Crunchy French fries tossed in aromatic garlic herb butter and freshly chopped parsley.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
    stockQuantity: 40,
    category: 'Starters',
    isAvailable: true,
  },
  {
    name: 'Chocolate Lava Cake',
    price: 1150.0,
    description: 'Warm chocolate cake with a rich liquid chocolate molten center, served with creamy vanilla ice cream.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    stockQuantity: 20,
    category: 'Desserts',
    isAvailable: true,
  },
  {
    name: 'Iced Caramel Macchiato',
    price: 950.0,
    description: 'Freshly pulled espresso combined with cold milk and vanilla syrup, poured over ice and drizzled with sweet caramel.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
    stockQuantity: 50,
    category: 'Beverages',
    isAvailable: true,
  },
  {
    name: 'Fresh Mango Smoothie',
    price: 750.0,
    description: 'Blended sweet tropical Sri Lankan mangoes with chilled creamy yogurt and a touch of wild bee honey.',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80',
    stockQuantity: 35,
    category: 'Beverages',
    isAvailable: true,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing food items...');
    await FoodItem.deleteMany({});

    console.log('Inserting sample food items with suitable LKR prices...');
    await FoodItem.insertMany(sampleFoodItems);

    console.log('✅ Sample Food Items successfully seeded into MongoDB with LKR (Rs.) prices!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
