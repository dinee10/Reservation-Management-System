import React, { useState } from "react";
import axios from "axios";

// Name regex: letters and spaces only
const nameRegex = /^[A-Za-z\s]+$/;

function AddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [blogImages, setBlogImages] = useState([]); // Array of images
  const [imagePreviews, setImagePreviews] = useState([]); // Array for image previews
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Validate a single field
  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "title":
        if (!value || value.trim() === "") {
          error = "Title is required";
        } else if (value.length < 5 || value.length > 100) {
          error = "Title must be between 5 and 100 characters";
        } else if (value.trim().length !== value.length) {
          error = "Title cannot have leading or trailing spaces";
        }
        break;
      case "content":
        if (!value || value.trim() === "") {
          error = "Content is required";
        } else if (value.length < 50 || value.length > 5000) {
          error = "Content must be between 50 and 5000 characters";
        } else if (/\s{2,}/.test(value)) {
          error = "Content cannot contain multiple consecutive spaces";
        } else if (value.trim().length !== value.length) {
          error = "Content cannot have leading or trailing spaces";
        }
        break;
      case "author":
        if (!value || value.trim() === "") {
          error = "Author name is required";
        } else if (!nameRegex.test(value)) {
          error = "Author name can only contain letters and spaces";
        } else if (value.length < 3 || value.length > 50) {
          error = "Author name must be between 3 and 50 characters";
        } else if (value.trim().length !== value.length) {
          error = "Author name cannot have leading or trailing spaces";
        }
        break;
      case "category":
        if (!value) {
          error = "Category is required";
        }
        break;
      case "blogImages":
        if (value.length === 0) {
          error = "At least one image is required";
        } else if (value.length > 3) {
          error = "You can upload a maximum of 3 images";
        } else {
          for (let i = 0; i < value.length; i++) {
            const file = value[i];
            if (!file.type.startsWith("image/")) {
              error = "All files must be images (JPEG, PNG, etc.)";
              break;
            }
            if (file.size > 5 * 1024 * 1024) {
              // 5MB limit
              error = "Each image must not exceed 5MB";
              break;
            }
          }
        }
        break;
      default:
        break;
    }

    return error;
  };

  // Handle input changes and validate in real-time
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update state with real-time validation
    if (name === "title") {
      setTitle(value);
    }
    if (name === "content") {
      setContent(value);
    }
    if (name === "author") {
      // Prevent numbers and special characters in real-time
      if (value && !nameRegex.test(value)) {
        setErrors({
          ...errors,
          author: "Author name can only contain letters and spaces",
        });
        return; // Don't update state if the value doesn't match the regex
      }
      setAuthor(value);
    }
    if (name === "category") {
      setCategory(value);
    }

    // Validate the field
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      setErrors({ ...errors, blogImages: "You can upload a maximum of 3 images" });
      return;
    }

    // Update the images state
    setBlogImages(selectedFiles);

    // Generate preview URLs for the selected images
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    // Validate the images
    const error = validateField("blogImages", selectedFiles);
    setErrors({ ...errors, blogImages: error });
  };

  // Validate the entire form before submission
  function validateForm() {
    const formErrors = {};
    formErrors.title = validateField("title", title);
    formErrors.content = validateField("content", content);
    formErrors.author = validateField("author", author);
    formErrors.category = validateField("category", category);
    formErrors.blogImages = validateField("blogImages", blogImages);

    return formErrors;
  }

  function addBlog(e) {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).some((key) => formErrors[key])) {
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    formData.append("author", author.trim());
    formData.append("category", category);

    blogImages.forEach((image) => {
      formData.append("newImages", image); // Match backend multer field name
    });

    axios
      .post("http://localhost:8000/blog/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Success Response:", response.data);
        setSuccessMessage("✅ Blog added successfully!");
        setTitle("");
        setContent("");
        setAuthor("");
        setBlogImages([]);
        setImagePreviews([]); // Clear image previews
        setCategory("");
        setErrors({});
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((err) => {
        console.error("Error Response:", err.response?.data || err.message);
        alert("Failed to add blog: " + (err.response?.data?.error || err.message));
      });
  }

  return (
    <>
      {successMessage && (
        <div className="p-4 mb-4 text-center text-white bg-green-500 rounded-md shadow-lg">
          {successMessage}
        </div>
      )}
      <section className="max-w-4xl p-8 mx-auto mt-20 bg-white border border-gray-200 rounded-md shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Create a New Blog
        </h1>

        <form onSubmit={addBlog}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-gray-700" htmlFor="title">
                Blog Title
              </label>
              <input
                id="title"
                type="text"
                className={`block w-full px-4 py-2 mt-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                onChange={handleChange}
                name="title"
                value={title}
                placeholder="Enter blog title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-gray-700" htmlFor="author">
                Author Name
              </label>
              <input
                id="author"
                type="text"
                className={`block w-full px-4 py-2 mt-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.author ? "border-red-500" : "border-gray-300"
                }`}
                onChange={handleChange}
                name="author"
                value={author}
                placeholder="Enter author name"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="font-semibold text-gray-700" htmlFor="content">
                Blog Content
              </label>
              <textarea
                id="content"
                className={`block w-full px-4 py-2 mt-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.content ? "border-red-500" : "border-gray-300"
                }`}
                rows="6"
                onChange={handleChange}
                name="content"
                value={content}
                placeholder="Write your blog content here..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="font-semibold text-gray-700" htmlFor="category">
                Select Category
              </label>
              <select
                id="category"
                className={`block w-full px-4 py-2 mt-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
                onChange={handleChange}
                name="category"
                value={category}
              >
                <option value="">Select a Category</option>
                <option value="rooms">Hotels</option>
                <option value="tasks">Adventure</option>
                <option value="general">Blogs</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div className="col-span-2">
              <label
                className="block mb-2 font-semibold text-gray-700"
                htmlFor="blogImages"
              >
                Upload Blog Images (up to 3)
                <small className="text-gray-500 ml-2">
                  (Hold Ctrl/Cmd to select multiple images)
                </small>
              </label>
              <input
                name="newImages"
                className={`block w-full p-2 text-gray-700 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.blogImages ? "border-red-500" : "border-gray-300"
                }`}
                id="blogImages"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              {errors.blogImages && (
                <p className="mt-1 text-sm text-red-600">{errors.blogImages}</p>
              )}
              {imagePreviews.length > 0 && (
                <div className="mt-2">
                  <p className="text-gray-600 text-sm">Selected Images:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {imagePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`} // Fixed alt attribute
                        className="w-24 h-24 object-cover rounded-md border border-gray-300"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-md shadow-md hover:bg-blue-700"
            >
              Publish Blog
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default AddBlog;