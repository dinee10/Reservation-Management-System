import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UpdateBlogForm() {
  const { id } = useParams();
  const [blog, setBlog] = useState({
    title: "",
    author: "",
    content: "",
    category: "general",
    images: [], // Existing images from the server
    newImages: [], // Newly uploaded images
  });
  const [imagesToDelete, setImagesToDelete] = useState([]); // Track indices of images to delete
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:8000/blog/get/${id}`)
      .then((res) => {
        console.log("Fetched blog data:", res.data);
        console.log("Image filenames:", res.data.images);
        setBlog({
          ...res.data,
          newImages: [], // Initialize newImages as empty
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "newImages") {
      setBlog((prevBlog) => ({
        ...prevBlog,
        newImages: files ? Array.from(files) : [],
      }));
    } else {
      setBlog((prevBlog) => ({
        ...prevBlog,
        [name]: value,
      }));
    }
  };

  const handleDeleteImage = (index) => {
    setBlog((prevBlog) => {
      const updatedImages = prevBlog.images.filter((_, i) => i !== index);
      return { ...prevBlog, images: updatedImages };
    });

    // Add the original index to imagesToDelete
    setImagesToDelete((prev) => [...prev, index]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("author", blog.author);
    formData.append("content", blog.content);
    formData.append("category", blog.category);

    // Append new images
    blog.newImages.forEach((image) => {
      formData.append("newImages", image);
    });

    // Append images to delete, if any
    if (imagesToDelete.length > 0) {
      formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/blog/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Update response:", response.data);
      alert("Blog updated successfully!");
      setImagesToDelete([]); // Reset after successful update
      navigate("/dashboard");
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      alert("Failed to update blog: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="mb-6 text-3xl font-bold">Update Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={blog.title}
            onChange={handleInputChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            name="author"
            value={blog.author}
            onChange={handleInputChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            name="content"
            value={blog.content}
            onChange={handleInputChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="8"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={blog.category}
            onChange={handleInputChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="general">General</option>
            <option value="rooms">Rooms</option>
            <option value="tasks">Tasks</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Images</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {blog.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={`http://localhost:8000/BlogImages/${image}`}
                  alt={`Current ${index}`}
                  className="object-cover w-32 h-32 rounded-md"
                  onError={(e) => (e.target.src = "https://placehold.co/128x128")}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-white bg-red-500 rounded-full hover:bg-red-700"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload New Images</label>
          <input
            type="file"
            name="newImages"
            onChange={handleInputChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            multiple
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Update Blog
          </button>
        </div>
      </form>
    </div>
  );
}