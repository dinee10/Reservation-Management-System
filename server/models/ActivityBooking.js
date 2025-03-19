const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    guestName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phoneNumber: { 
        type: String, 
        required: true 
    },
    noOfPassengers: { 
        type: Number, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true }
});

const Booking = mongoose.model("ActivityBooking", BookingSchema);
module.exports = Booking;
