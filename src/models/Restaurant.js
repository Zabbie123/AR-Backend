// backend/models/Restaurant.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const restaurantSchema = new mongoose.Schema({
  restaurantId: {
    type: Number,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please add a restaurant name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: String,
  logo: String,
  contactNumber: {
    type: String,
    required: [true, 'Please add a contact number'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  operatingHours: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      openTime: String,
      closeTime: String,
    },
  ],
  themeColor: {
    type: String,
    default: '#000000',
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

restaurantSchema.plugin(AutoIncrement, { inc_field: 'restaurantId' });

restaurantSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
