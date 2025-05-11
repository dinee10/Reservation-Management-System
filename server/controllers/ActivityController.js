const Activity = require('../models/ActivityModel'); // Adjust the path based on your folder structure
const multer = require('multer');
const path = require('path');

// Set up multer for handling multiple image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Store images in the public/images directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage: storage });

// Get all activities
const getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        if (!activities.length) {
            return res.status(404).json({ message: "No activities found" });
        }
        return res.status(200).json({ activities });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching activities", error: err });
    }
};

// Get Activity by ID
const getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }
        return res.status(200).json({ activity });
    } catch (err) {
        return res.status(500).json({ message: "Fetching activity failed", error: err });
    }
};

// Add new activity (with multiple image uploads)
const addActivity = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        // Map uploaded files to their paths
        const image = req.file ? req.file.filename : "";

        // Validate required fields
        if (!name || !description || !price || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create new activity with multiple images
        const newActivity = new Activity({ 
            name, 
            description, 
            price, 
            image
        });

        await newActivity.save();

        return res.status(201).json({ activity: newActivity });
    } catch (err) {
        return res.status(500).json({ message: "Unable to add activity", error: err });
    }
};

// Update activity (with multiple image uploads)
const updateActivity = async (req, res) => {
    try {
        const { name, description, price } = req.body;

        const updateData = { name, description, price };

        // If a new image is uploaded, update the image field
        if (req.file) {  // Fix: Correctly check for a single file upload
            updateData.image = req.file.filename;
        }

        // Find and update the activity
        const activity = await Activity.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }

        return res.status(200).json({ activity });
    } catch (err) {
        return res.status(500).json({ message: "Unable to update activity", error: err });
    }
};

// Delete activity
const deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: "Unable to delete activity" });
        }
        return res.status(200).json({ message: "Activity deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting activity", error: err });
    }
};

// Export routes
module.exports = {
    getAllActivities,
    getActivityById,
    addActivity: [upload.single('images'), addActivity], 
    updateActivity: [upload.single('images'), updateActivity], 
    deleteActivity
};