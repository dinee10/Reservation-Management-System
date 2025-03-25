// Router - roomRoutes.js
const express = require("express");
const router = express.Router();
const { getAllRooms, getRoomById, addRoom, updateRoom, deleteRoom } = require("../controllers/roomController");

router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.post("/", addRoom);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

module.exports = router;