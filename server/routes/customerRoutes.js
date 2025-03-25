// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');

// Routes
router.post('/bookings', 
  CustomerController.validateBookingData,
  CustomerController.createBooking
);

router.get('/bookinglist', CustomerController.getAllBookings);

module.exports = router;