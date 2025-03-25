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
        required: true 
    },
    activityId: { 
        type: Schema.Types.ObjectId, 
        ref: "Activity", 
        required: true 
    } // Add reference to Activity
});

const Booking = mongoose.model("ActivityBooking", BookingSchema);
module.exports = Booking;