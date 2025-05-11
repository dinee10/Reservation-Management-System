import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../../components/NavbarAdmin/Navbar";

// Name regex: letters and spaces only
const nameRegex = /^[A-Za-z\s]+$/;

function UpdateActivity() {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null); // Store the new image file
    const [existingImage, setExistingImage] = useState(""); // For image preview
    const [formErrors, setFormErrors] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
    });
    const navigate = useNavigate();

    // Fetch activity details on component mount
    useEffect(() => {
        axios
            .get(`http://localhost:8000/activities/${id}`)
            .then((result) => {
                const activity = result.data.activity;
                setName(activity.name);
                setDescription(activity.description);
                setPrice(activity.price);
                setExistingImage(activity.image);
            })
            .catch((err) => {
                console.error("Error fetching activity:", err);
                Swal.fire({
                    title: "Error",
                    text: "Failed to fetch activity details.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            });
    }, [id]);

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        // Validate the image immediately (if a file is selected)
        const error = validateField("image", file);
        setFormErrors({ ...formErrors, image: error });
    };

    // Validate a single field
    const validateField = (fieldName, value) => {
        let error = "";

        switch (fieldName) {
            case "name":
                if (!value || value.trim() === "") {
                    error = "Name is required";
                } else if (!nameRegex.test(value)) {
                    error = "Name can only contain letters and spaces";
                } else if (value.length < 3 || value.length > 50) {
                    error = "Name must be between 3 and 50 characters";
                }
                break;
            case "description":
                if (!value || value.trim() === "") {
                    error = "Description is required";
                } else if (value.length < 10 || value.length > 500) {
                    error = "Description must be between 10 and 500 characters";
                }
                break;
            case "price":
                const priceValue = Number(value);
                if (!value || isNaN(priceValue)) {
                    error = "Price is required and must be a number";
                } else if (priceValue <= 0) {
                    error = "Price must be greater than 0";
                } else if (priceValue > 10000) {
                    error = "Price cannot exceed 10000";
                }
                break;
            case "image":
                // Image validation is only required if a new image is uploaded
                if (value) {
                    if (!value.type.startsWith("image/")) {
                        error = "File must be an image (JPEG, PNG, etc.)";
                    } else if (value.size > 5 * 1024 * 1024) { // 5MB limit
                        error = "Image size must not exceed 5MB";
                    }
                }
                break;
            default:
                break;
        }

        return error;
    };

    // Handle input changes and validate
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "name") setName(value);
        if (name === "description") setDescription(value);
        if (name === "price") setPrice(value);

        // Validate the field
        const error = validateField(name, value);
        setFormErrors({ ...formErrors, [name]: error });
    };

    // Validate the entire form before submission
    const validateForm = () => {
        const errors = {};
        let isValid = true;

        // Validate all fields
        errors.name = validateField("name", name);
        errors.description = validateField("description", description);
        errors.price = validateField("price", price);
        errors.image = validateField("image", image);

        // Check if there are any errors
        Object.values(errors).forEach((error) => {
            if (error) isValid = false;
        });

        setFormErrors(errors);
        return isValid;
    };

    const updateActivity = async (e) => {
        e.preventDefault();

        // Validate the form
        if (!validateForm()) {
            Swal.fire({
                title: "Validation Error",
                text: "Please fix the errors in the form before submitting.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        // Create FormData to send both text and file data
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        if (image) {
            formData.append("images", image); // Append the new image file if uploaded
        }

        try {
            // Send the update request to the server
            await axios.put(`http://localhost:8000/activities/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                title: "Success",
                text: "Activity updated successfully",
                icon: "success",
            }).then(() => navigate("/activities"));
        } catch (err) {
            console.error("Error updating activity:", err);
            Swal.fire({
                title: "Error",
                text: "Something went wrong, please try again.",
                icon: "error",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-800">
            <Navbar />
            <div className="container mx-auto py-10 px-4">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Update Activity</h1>

                    <form onSubmit={updateActivity}>
                        {/* Name Field */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-800 font-semibold mb-2">
                                Activity Name
                            </label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    formErrors.name ? "border-red-500" : "border-gray-300"
                                }`}
                                id="name"
                                name="name"
                                value={name}
                                onChange={handleChange}
                            />
                            {formErrors.name && (
                                <span className="text-red-500 text-sm mt-1 block">{formErrors.name}</span>
                            )}
                        </div>

                        {/* Description Field */}
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-gray-800 font-semibold mb-2">
                                Description
                            </label>
                            <textarea
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    formErrors.description ? "border-red-500" : "border-gray-300"
                                }`}
                                id="description"
                                name="description"
                                value={description}
                                onChange={handleChange}
                                rows="5"
                            />
                            {formErrors.description && (
                                <span className="text-red-500 text-sm mt-1 block">{formErrors.description}</span>
                            )}
                        </div>

                        {/* Price Field */}
                        <div className="mb-4">
                            <label htmlFor="price" className="block text-gray-800 font-semibold mb-2">
                                Price
                            </label>
                            <input
                                type="number"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    formErrors.price ? "border-red-500" : "border-gray-300"
                                }`}
                                id="price"
                                name="price"
                                value={price}
                                onChange={handleChange}
                            />
                            {formErrors.price && (
                                <span className="text-red-500 text-sm mt-1 block">{formErrors.price}</span>
                            )}
                        </div>

                        {/* Display the Existing Image */}
                        {existingImage && (
                            <div className="mb-4">
                                <label className="block text-gray-800 font-semibold mb-2">Current Image</label>
                                <div className="border border-gray-300 rounded-lg p-2 inline-block">
                                    <img
                                        src={`http://localhost:8000/${existingImage}`}
                                        alt="Current activity"
                                        className="w-32 h-32 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = "/fallback-image.jpg"; // Fallback image if the current image fails to load
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Image Upload Field */}
                        <div className="mb-4">
                            <label htmlFor="image" className="block text-gray-800 font-semibold mb-2">
                                Upload New Image (Optional)
                            </label>
                            <input
                                type="file"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    formErrors.image ? "border-red-500" : "border-gray-300"
                                }`}
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {formErrors.image && (
                                <span className="text-red-500 text-sm mt-1 block">{formErrors.image}</span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                            >
                                Update Activity
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateActivity;