const mongoose = require("mongoose");

// Define the booking schema (already present in your code)
const bookingSchema = mongoose.Schema({
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
});

// Define the feedback schema (already present in your code)
const feedbackSchema = mongoose.Schema({
  customerName: { type: String, required: true },
  message: { type: String, required: true },
});

// Define the main room schema
const roomSchema = mongoose.Schema(
  {
    // Existing fields from your original schema
    name: { type: String, required: true },
    maxCount: { type: Number, required: true },
    phonenumber: { type: Number, required: true },
    rentperday: { type: Number, required: true },
    imageurl: [String],
    currentbookings: [bookingSchema],
    type: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true, default: "Not specified" },
    beds: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    sleeps: { type: Number, default: 2 },

    // New fields you provided
    rating: { type: Number, default: 4 }, // Default rating of 4
    amenities: [String], // Array of amenities (e.g., ["Pool", "Spa", "WiFi"])
    ecoFriendly: { type: Boolean, default: false }, // Eco-friendly status
    feedback: [feedbackSchema], // Array of feedback objects

    // Additional fields to enhance functionality (optional but recommended)
    reviewsCount: { type: Number, default: 0 }, // To store the number of reviews (for display purposes)
  },
  { timestamps: true } // Keep timestamps for createdAt and updatedAt
);

// Create the Room model
const roomModel = mongoose.model("rooms", roomSchema);

module.exports = roomModel;