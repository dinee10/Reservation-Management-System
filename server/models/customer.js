// models/customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  travellingForWork: {
    type: String,
    default: 'No',
    enum: ['Yes', 'No']
  },
  title: {
    type: String,
    required: true,
    enum: ['Mr', 'Mrs', 'Ms', 'Dr']
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    type: String,
    required: true,
    match: /^\+94\d{9}$/
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Customer', customerSchema);