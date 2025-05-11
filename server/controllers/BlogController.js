const Blog = require("../models/Blog");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose"); // Add mongoose for ObjectId validation

// Multer storage configuration
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const dir = path.join(__dirname, "../BlogImages");
        try {
            if (!await fs.access(dir).then(() => true).catch(() => false)) {
                await fs.mkdir(dir);
            }
            cb(null, dir);
        } catch (err) {
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
});

// Multer setup for multiple file uploads with field name "newImages"
const upload = multer({ storage }).array("newImages", 10);

// Helper function to delete images
async function deleteImage(filePath) {
    const fullPath = path.join(__dirname, "../BlogImages", filePath);
    try {
        await fs.unlink(fullPath);
        console.log(`Deleted image: ${filePath}`);
    } catch (err) {
        console.error(`Failed to delete file ${filePath}:`, err);
    }
}

// Add new blog post
const addBlog = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: "File upload failed: " + err.message });
        }
        try {
            const { title, content, author, category } = req.body;
            if (!title || !content || !author || !category) {
                return res.status(400).json({ error: "All fields (title, content, author, category) are required" });
            }

            const images = req.files ? req.files.map(file => file.filename) : [];

            const newBlog = new Blog({
                title,
                content,
                author,
                images,
                category,
            });

            await newBlog.save();
            res.status(200).json(newBlog);
        } catch (err) {
            console.error("Error in /add route:", err);
            res.status(500).json({ error: "Failed to add blog: " + err.message });
        }
    });
};

// Get all blogs
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (err) {
        console.error("Error in / route:", err);
        res.status(500).json({ error: "Failed to fetch blogs: " + err.message });
    }
};

// Get blogs by category
const getBlogsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const blogs = await Blog.find({ category });
        if (blogs.length > 0) {
            res.status(200).json(blogs);
        } else {
            res.status(404).json({ message: `No blogs found for category: ${category}` });
        }
    } catch (err) {
        console.error("Error in /category route:", err);
        res.status(500).json({ error: "Failed to fetch blogs: " + err.message });
    }
};

// Get single blog by ID (Fixed)
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid blog ID format" });
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        res.status(200).json(blog);
    } catch (err) {
        console.error("Error in /get/:id route:", err);
        res.status(500).json({ error: "Failed to fetch blog: " + err.message });
    }
};

// Update blog post
const updateBlog = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: "File upload failed: " + err.message });
        }
        try {
            const { title, content, author, category, imagesToDelete } = req.body;
            const existingBlog = await Blog.findById(req.params.id);

            if (!existingBlog) {
                return res.status(404).json({ message: "Blog post not found" });
            }

            if (!title || !content || !author || !category) {
                return res.status(400).json({ error: "All fields (title, content, author, category) are required" });
            }

            const deleteIndices = imagesToDelete ? JSON.parse(imagesToDelete) : [];
            if (deleteIndices.length > 0) {
                const imagesToKeep = existingBlog.images.filter((_, index) => !deleteIndices.includes(index));
                const deletePromises = existingBlog.images
                    .filter((_, index) => deleteIndices.includes(index))
                    .map((image) => deleteImage(image));
                await Promise.all(deletePromises);
                existingBlog.images = imagesToKeep;
            }

            if (req.files && req.files.length > 0) {
                const newImageFilenames = req.files.map(file => file.filename);
                existingBlog.images = [...existingBlog.images, ...newImageFilenames];
            }

            existingBlog.title = title;
            existingBlog.content = content;
            existingBlog.author = author;
            existingBlog.category = category;
            existingBlog.updatedAt = Date.now();

            await existingBlog.save();
            res.status(200).json({ message: "Blog post updated successfully", blog: existingBlog });
        } catch (err) {
            console.error("Error in /update/:id route:", err);
            res.status(500).json({ error: "Failed to update blog: " + err.message });
        }
    });
};

// Delete blog post
const deleteBlog = async (req, res) => {
    try {
        const blogToDelete = await Blog.findById(req.params.id);

        if (!blogToDelete) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        if (blogToDelete.images.length > 0) {
            const deletePromises = blogToDelete.images.map((image) => deleteImage(image));
            await Promise.all(deletePromises);
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Blog post deleted successfully" });
    } catch (err) {
        console.error("Error in /delete/:id route:", err);
        res.status(500).json({ error: "Failed to delete blog: " + err.message });
    }
};

// Rate a blog post
const rateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const newRating = (blog.rating * blog.ratingCount + rating) / (blog.ratingCount + 1);
        blog.rating = newRating;
        blog.ratingCount += 1;

        await blog.save();
        res.status(200).json({ message: "Rating submitted successfully", blog });
    } catch (err) {
        console.error("Error in /rate/:id route:", err);
        res.status(500).json({ error: "Failed to submit rating: " + err.message });
    }
};

module.exports = {
    addBlog,
    getBlogs,
    getBlogsByCategory,
    getBlogById,
    updateBlog,
    deleteBlog,
    rateBlog,
};