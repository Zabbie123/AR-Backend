const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

// @desc    Get all dishes for a restaurant
// @route   GET /api/dishes
// @access  Private
// backend/controllers/dishController.js
// const Dish = require('../models/Dish');

// @desc    Get all dishes for a restaurant
// @route   GET /api/dishes
// @access  Private
exports.getDishes = async (req, res) => {
  try {
    if (!req.user.restaurantId) {
      return res.status(400).json({ message: 'Restaurant not found1' });
    }

    const dishes = await Dish.find({ restaurant: req.user.restaurantId });
    res.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new dish
// @route   POST /api/dishes
// @access  Private
// @access  Private

exports.createDish = async (req, res) => {
  try {
    const { restaurantId, name, price, category, description, image, model3dglb, model3dusdz, tags } = req.body;

    // Debug info
    const debugInfo = {
      incomingRestaurantId: restaurantId,
      typeOfRestaurantId: typeof restaurantId
    };

    let restaurant_data = null;
    try {
      restaurant_data = await Restaurant.findById(new mongoose.Types.ObjectId(restaurantId));
    } catch (err) {
      return res.status(400).json({
        message: "Invalid restaurantId format",
        debug: { ...debugInfo, error: err.message }
      });
    }

    if (!restaurant_data) {
      return res.status(404).json({
        message: "Restaurant not found",
        debug: debugInfo
      });
    }

    const dish = await Dish.create({
      restaurant: restaurant_data._id,
      name,
      price,
      category,
      description,
      image,
      model3dglb,
      model3dusdz,
      tags
    });

    return res.status(201).json({
      message: "Dish created successfully",
      dish,
      debug: {
        ...debugInfo,
        restaurantFound: restaurant_data._id.toString()
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      debug: { stack: error.stack }
    });
  }
};


// @desc    Get a single dish
// @route   GET /api/dishes/:id
// @access  Private
exports.getDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    // Check if the dish belongs to the user's restaurant
    if (dish.restaurant.toString() !== req.user.restaurantId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    return res.json(dish);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new dish
// @route   POST /api/dishes
// @access  Private
// exports.createDish = async (req, res) => {
//   try {
//     const dishData = {
//       ...req.body,
//       restaurantId: req.user.restaurantId,
//     };

//     const dish = await Dish.create(dishData);
//     res.status(201).json(dish);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// @desc    Update a dish
// @route   PUT /api/dishes/:id
// @access  Private
exports.updateDish = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Dish ID" });
    }

    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.status(200).json(dish);
  } catch (error) {
    console.error("Update Dish Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a dish
// @route   DELETE /api/dishes/:id
// @access  Private
exports.deleteDish = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Dish ID" });
    }

    const dish = await Dish.findByIdAndDelete(req.params.id);

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.status(200).json({ message: "Dish deleted successfully" });
  } catch (error) {
    console.error("Delete Dish Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle dish visibility
// @route   PUT /api/dishes/:id/toggle-visibility
// @access  Private
exports.toggleVisibility = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    // Check if the dish belongs to the user's restaurant
    if (dish.restaurantId.toString() !== req.user.restaurantId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    dish.isVisible = !dish.isVisible;
    await dish.save();

    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};