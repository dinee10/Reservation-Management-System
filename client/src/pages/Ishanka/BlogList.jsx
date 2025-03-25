import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:8000/blog/');
      setBlogs(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again later.');
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this blog?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8000/blog/delete/${id}`);
        alert('Blog deleted successfully!');
        fetchBlogs(); // Refresh the list
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Blog deletion failed.');
      }
    }
  };

  if (loading) {
    return <div className="mt-20 text-center text-white">Loading blogs...</div>;
  }

  if (error) {
    return <div className="mt-20 text-center text-red-500">{error}</div>;
  }

  return (
    <section className="p-6 mx-auto mt-20 bg-gray-700 rounded-md shadow-md max-w-7xl dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold text-white capitalize dark:text-white">Blog List</h1>
      </div>

      <div className="space-y-6">
        {blogs.length === 0 ? (
          <p className="text-white">No blogs available.</p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex items-start p-4 bg-white rounded-md shadow-md dark:bg-gray-800"
            >
              <div className="flex-shrink-0 mr-4">
                {blog.images && blog.images.length > 0 ? (
                  <img
                    src={`http://localhost:8000/blogImages/${blog.images[0]}`} // Updated to use images array
                    alt={blog.title}
                    className="object-cover w-32 h-32 border border-gray-300 rounded-md"
                    onError={(e) => (e.target.src = 'path/to/fallback-image.jpg')} // Fallback image
                  />
                ) : (
                  <div className="flex items-center justify-center w-32 h-32 bg-gray-200 rounded-md">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{blog.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">Author: {blog.author}</p>
                <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-3">
                  {blog.content.length > 20 ? `${blog.content.substring(0, 20)}...` : blog.content}
                </p>
              </div>
              <div className="flex items-center ml-4 space-x-4">
                <button
                  className="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600"
                  onClick={() => deleteBlog(blog._id)}
                >
                  Delete
                </button>
                <Link
                  to={`/update-blog/${blog._id}`}
                  state={{ blogToEdit: blog }}
                  className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Update
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default BlogList;