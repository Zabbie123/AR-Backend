const Dish = require('../models/Dish');

// Get all dishes for a restaurant
exports.getDishesByRestaurant = async (restaurantId) => {
  return await Dish.find({ restaurantId });
};

// Get a single dish
exports.getDishById = async (id) => {
  const dish = await Dish.findById(id);
  
  if (!dish) {
    throw new Error('Dish not found');
  }
  
  return dish;
};

// Create a new dish
exports.createDish = async (dishData) => {
  return await Dish.create(dishData);
};

// Update a dish
exports.updateDish = async (id, dishData) => {
  const dish = await Dish.findByIdAndUpdate(id, dishData, { new: true });
  
  if (!dish) {
    throw new Error('Dish not found');
  }
  
  return dish;
};

// Delete a dish
exports.deleteDish = async (id) => {
  const dish = await Dish.findById(id);
  
  if (!dish) {
    throw new Error('Dish not found');
  }
  
  await dish.remove();
  return { message: 'Dish removed' };
};

// Toggle dish visibility
exports.toggleDishVisibility = async (id) => {
  const dish = await Dish.findById(id);
  
  if (!dish) {
    throw new Error('Dish not found');
  }
  
  dish.isVisible = !dish.isVisible;
  await dish.save();
  
  return dish;
};