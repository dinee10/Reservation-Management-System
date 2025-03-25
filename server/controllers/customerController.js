// controllers/customerController.js
const Customer = require('../models/customer');

class CustomerController {
  // Validation middleware
  static validateBookingData(req, res, next) {
    const {
      travellingForWork,
      title,
      firstName,
      lastName,
      email,
      confirmEmail,
      phone
    } = req.body;

    if (!title || !firstName || !lastName || !email || !confirmEmail || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (email !== confirmEmail) {
      return res.status(400).json({ error: 'Email addresses do not match' });
    }

    if (!/^\d{9}$/.test(phone)) {
      return res.status(400).json({ error: 'Phone number must be 9 digits' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    next();
  }

  // Create booking
  static async createBooking(req, res) {
    try {
      const bookingData = {
        travellingForWork: req.body.travellingForWork || 'No',
        title: req.body.title,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: `+94${req.body.phone}`
      };

      const booking = await Customer.create(bookingData);
      res.status(201).json({
        message: 'Booking confirmed successfully',
        bookingId: booking._id
      });
    } catch (error) {
      console.error('Booking error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all bookings
  static async getAllBookings(req, res) {
    try {
      const bookings = await Customer.find();
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = CustomerController;