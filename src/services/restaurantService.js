const Restaurant = require('../models/Restaurant');

// Get restaurant by ID
exports.getRestaurantById = async (id) => {
  const restaurant = await Restaurant.findById(id);
  
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  
  return restaurant;
};

// Get restaurant by slug
exports.getRestaurantBySlug = async (slug) => {
  const restaurant = await Restaurant.findOne({ slug });
  
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  
  return restaurant;
};

// Get restaurant dishes
exports.getRestaurantDishes = async (restaurantId) => {
  const dishes = await Dish.find({ 
    restaurantId,
    isVisible: true
  });
  
  return dishes;
};

// Update restaurant
exports.updateRestaurant = async (id, restaurantData) => {
  const restaurant = await Restaurant.findByIdAndUpdate(id, restaurantData, { new: true });
  
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  
  return restaurant;
};