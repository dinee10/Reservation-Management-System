const express = require("express");
const { 
    getAllActivities, 
    getActivityById, 
    addActivity, 
    updateActivity, 
    deleteActivity 
} = require("../controllers/ActivityController");

const router = express.Router();

// Route to get all activities
router.get("/", getAllActivities);

// Route to get a specific activity by ID
router.get("/:id", getActivityById);

// Route to add a new activity
router.post("/", addActivity);

// Route to update an activity by ID
router.put("/:id", updateActivity);

// Route to delete an activity by ID
router.delete("/:id", deleteActivity);

module.exports = router;
