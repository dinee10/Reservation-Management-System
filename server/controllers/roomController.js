const Room = require("../models/room");
const multer = require("multer");
const path = require("path");

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: path.join('D:', 'Hotel Reservation Management', 'images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Add a new room with file upload
const addRoom = async (req, res) => {
    upload.single('imageurl')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const {
            name,
            maxCount,
            phonenumber,
            rentperday,
            type,
            description,
            location,
            beds,
            bathrooms,
            sleeps,
            amenities,
            ecoFriendly,
        } = req.body;

        const parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;

        const newRoom = new Room({
            name,
            maxCount,
            phonenumber,
            rentperday,
            imageurl: req.file ? [req.file.filename] : [],
            type,
            description,
            location,
            beds,
            bathrooms,
            sleeps,
            rating: 4,
            amenities: parsedAmenities || [],
            ecoFriendly: ecoFriendly === 'true',
            feedback: [],
            reviewsCount: 0,
        });

        try {
            const savedRoom = await newRoom.save();
            const updatedRoom = {
                ...savedRoom._doc,
                imageurl: savedRoom.imageurl.map(image => `http://localhost:8000/images/${image}`),
            };
            res.status(201).json(updatedRoom);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};

// Get all rooms
const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find({});
        const updatedRooms = rooms.map((room) => ({
            ...room._doc,
            imageurl: room.imageurl.map((image) => `http://localhost:8000/images/${image}`),
        }));
        res.json(updatedRooms);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get room by ID
const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        const updatedRoom = {
            ...room._doc,
            imageurl: room.imageurl.map((image) => `http://localhost:8000/images/${image}`),
        };
        res.json(updatedRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update room details with file upload
const updateRoom = async (req, res) => {
    upload.single('imageurl')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const {
            name,
            maxCount,
            phonenumber,
            rentperday,
            type,
            description,
            location,
            beds,
            bathrooms,
            sleeps,
            amenities,
            ecoFriendly,
        } = req.body;

        const updateData = {
            name,
            maxCount,
            phonenumber,
            rentperday,
            type,
            description,
            location,
            beds,
            bathrooms,
            sleeps,
            amenities: typeof amenities === 'string' ? JSON.parse(amenities) : amenities,
            ecoFriendly: ecoFriendly === 'true',
        };

        // Only update imageurl if a new file is uploaded
        if (req.file) {
            updateData.imageurl = [req.file.filename];
        }

        try {
            const updatedRoom = await Room.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            );
            if (!updatedRoom) {
                return res.status(404).json({ message: "Room not found" });
            }
            const responseRoom = {
                ...updatedRoom._doc,
                imageurl: updatedRoom.imageurl.map(image => `http://localhost:8000/images/${image}`),
            };
            res.json(responseRoom);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};

// Delete a room
const deleteRoom = async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getAllRooms, getRoomById, addRoom, updateRoom, deleteRoom };