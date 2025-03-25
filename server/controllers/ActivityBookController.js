const Booking = require("../models/ActivityBooking");

const addBooking = async (req, res) => {
    const { guestName, email, phoneNumber, noOfPassengers, date, activityId } = req.body;

    console.log("Received booking request:", req.body); // Debug log

    if (!guestName || !email || !phoneNumber || !noOfPassengers || !date || !activityId) {
        return res.status(400).json({ message: "All fields are required", missingFields: { guestName, email, phoneNumber, noOfPassengers, date, activityId } });
    }

    const today = new Date().toISOString().split("T")[0]; // Get today's date
    if (date < today) {
        return res.status(400).json({ error: "You cannot book a past date!" });
    }

    const newBooking = new Booking({
        guestName,
        email,
        phoneNumber,
        noOfPassengers,
        date,
        activityId,
    });

    try {
        await newBooking.save();
        return res.status(201).json({ message: "Booking added successfully", booking: newBooking });
    } catch (err) {
        console.error("Error saving booking:", err); // Debug log
        return res.status(500).json({ message: "Failed to add booking", error: err.message });
    }
};

// Get all bookings (populate activity name)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("activityId", "name"); // Populate activity name
        return res.status(200).json({ bookings });
    } catch (err) {
        return res.status(500).json({ message: "Failed to retrieve bookings", error: err });
    }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json({ booking });
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch booking", error: err });
    }
};

// Update a booking
const updateBooking = async (req, res) => {
    const { id } = req.params;
    const { guestName, email, phoneNumber, noOfPassengers } = req.body;

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { guestName, email, phoneNumber, noOfPassengers },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        return res.status(200).json({ message: "Booking updated successfully", booking: updatedBooking });
    } catch (err) {
        return res.status(500).json({ message: "Failed to update booking", error: err });
    }
};

// Delete a booking
const deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBooking = await Booking.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json({ message: "Booking deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete booking", error: err });
    }
};

module.exports = {
    addBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking
};