// backend/routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getRestaurant,
  getRestaurantBySlug,
  getRestaurantDishes,
  updateRestaurant,
  createRestaurant,
} = require('../controllers/restaurantController');

// Create restaurant
router.post('/', protect, createRestaurant);

// Get restaurant
router.get('/', protect, getRestaurant);

// Update restaurant
router.put('/:id', protect, updateRestaurant);

// Get restaurant by slug
router.get('/slug/:slug', getRestaurantBySlug);

// Get restaurant dishes
router.get('/:id/dishes', getRestaurantDishes);

module.exports = router;