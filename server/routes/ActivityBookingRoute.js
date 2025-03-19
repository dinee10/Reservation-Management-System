const express = require("express");
const router = express.Router();
const {
    addBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking
} = require("../controllers/ActivityBookController");

// Define Routes
router.post("/", addBooking);         // Add a new booking
router.get("/", getAllBookings);       // Get all bookings
router.get("/:id", getBookingById);    // Get a single booking by ID
router.put("/:id", updateBooking);     // Update a booking
router.delete("/:id", deleteBooking);  // Delete a booking

module.exports = router;
