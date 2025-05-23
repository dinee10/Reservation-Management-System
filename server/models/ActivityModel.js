const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true },

    description: { 
        type: String, 
        required: true },

    price: { 
        type: Number, 
        required: true },

    image: {
        type: String,
        required: false,
    },
        
    
})

const Activity = mongoose.model("Activity", ActivitySchema);
module.exports = Activity;