const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'admin',
    });

    // Create restaurant for admin users
    if (user.role === 'admin') {
      const Restaurant = require('../models/Restaurant');
      const { slugify } = require('../utils/helpers');
      
      const restaurant = await Restaurant.create({
        name: `${username}'s Restaurant`,
        description: 'Welcome to our restaurant',
        contactNumber: '0000000000',
        email: email,
        address: {
          street: '123 Main St',
          city: 'City',
          state: 'State',
          country: 'Country',
          zipCode: '12345'
        },
        operatingHours: [
          { day: 'Monday', openTime: '09:00', closeTime: '22:00' },
          { day: 'Tuesday', openTime: '09:00', closeTime: '22:00' },
          { day: 'Wednesday', openTime: '09:00', closeTime: '22:00' },
          { day: 'Thursday', openTime: '09:00', closeTime: '22:00' },
          { day: 'Friday', openTime: '09:00', closeTime: '22:00' },
          { day: 'Saturday', openTime: '09:00', closeTime: '22:00' },
          { day: 'Sunday', openTime: '09:00', closeTime: '22:00' }
        ],
        themeColor: '#000000',
        slug: slugify(`${username}-restaurant`)
      });

      // Update user with restaurant ID
      user.restaurantId = restaurant._id;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return the user with restaurant ID and token
    const userToReturn = await User.findById(user._id).select('-password');
    
    res.status(201).json({
      user: userToReturn,
      token: token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return the user with restaurant ID and token
    const userToReturn = await User.findById(user._id).select('-password');

    res.json({
      user: userToReturn,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/profile
// @access  Private
// backend/controllers/authController.js
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('restaurantId');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};