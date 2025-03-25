import React, { useState } from "react";
import axios from "axios";

function AddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [blogImages, setBlogImages] = useState([]); // Array of images
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  function validateForm() {
    const errors = {};
    if (!title) errors.title = "Title is required";
    if (!content) errors.content = "Content is required";
    if (!author) errors.author = "Author is required";
    if (!category) errors.category = "Category is required";
    return errors;
  }

  function addBlog(e) {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
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
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Create a New Blog</h1>

        <form onSubmit={addBlog}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-gray-700" htmlFor="title">
                Blog Title
              </label>
              <input
                id="title"
                type="text"
                className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="font-semibold text-gray-700" htmlFor="author">
                Author Name
              </label>
              <input
                id="author"
                type="text"
                className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setAuthor(e.target.value)}
                value={author}
              />
              {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
            </div>

            <div className="col-span-2">
              <label className="font-semibold text-gray-700" htmlFor="content">
                Blog Content
              </label>
              <textarea
                id="content"
                className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="6"
                onChange={(e) => setContent(e.target.value)}
                value={content}
              />
              {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
            </div>

            <div className="col-span-2">
              <label className="font-semibold text-gray-700" htmlFor="category">
                Select Category
              </label>
              <select
                id="category"
                className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="">Select a Category</option>
                <option value="rooms">Hotels</option>
                <option value="tasks">Adventure</option>
                <option value="general">Blogs</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div className="col-span-2">
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="blogImages">
                Upload Blog Images
              </label>
              <input
                name="newImages"
                className="block w-full p-2 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                id="blogImages"
                type="file"
                multiple
                onChange={(e) => setBlogImages([...e.target.files])}
              />
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