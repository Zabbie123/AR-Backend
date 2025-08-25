const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const Dish = require("../models/Dish");
const { slugify } = require('../utils/helpers');

exports.createRestaurant = async (req, res) => {
  try {

    // Create restaurant
    const restaurant = await Restaurant.create({
      ...req.body,
      slug: slugify(req.body.name),
    });

    // Update user with restaurant ID
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { restaurantId: restaurant._id },
      { new: true }
    );

    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Check if the restaurant belongs to the user
    if (restaurant._id.toString() !== req.user.restaurantId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get restaurant details
// @route   GET /api/restaurants
// @access  Private
exports.getRestaurant = async (req, res) => {
  try {
    
    if (!req.user.restaurantId) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    const restaurant = await Restaurant.findById(req.user.restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get restaurant by slug (public)
// @route   GET /api/restaurants/slug/:slug
// @access  Public
exports.getRestaurantBySlug = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json(restaurant);
  } catch (error) {
    console.error('Error in getRestaurantBySlug:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get restaurant dishes (public)
// @route   GET /api/restaurants/:id/dishes
// @access  Public
exports.getRestaurantDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({ 
      restaurant: req.params.id,
      isVisible: true
    });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update restaurant details
// @route   PUT /api/restaurants/:id
// @access  Private
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Check if the restaurant belongs to the user
    if (restaurant._id.toString() !== req.user.restaurantId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};