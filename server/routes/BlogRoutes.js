const express = require("express");
const router = express.Router();
const blogController = require("../controllers/BlogController");

// Routes
router.post("/add", blogController.addBlog);
router.get("/", blogController.getBlogs);                    // Matches getBlogs in controller
router.get("/category/:category", blogController.getBlogsByCategory); // Matches getBlogsByCategory in controller
router.get("/get/:id", blogController.getBlogById);
router.put("/update/:id", blogController.updateBlog);
router.delete("/delete/:id", blogController.deleteBlog);
router.post("/rate/:id", blogController.rateBlog);

module.exports = router;