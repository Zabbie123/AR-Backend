// backend/routes/dishRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish,
  toggleVisibility,
} = require('../controllers/dishController');

// Get all dishes for a restaurant
router.get('/', protect, getDishes);

// Get a single dish
router.get('/:id', protect, getDish);

// Create a new dish
router.post('/', createDish);
// router.post('/', protect, createDish);

// Update a dish
router.put('/:id', protect, updateDish);

// Delete a dish
router.delete('/:id', protect, deleteDish);

// Toggle dish visibility
router.put('/:id/toggle-visibility', protect, toggleVisibility);

module.exports = router;