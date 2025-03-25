import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../../components/NavbarAdmin/Navbar";

// Name regex: letters and spaces only
const nameRegex = /^[A-Za-z\s]+$/;

function AddActivity() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [formErrors, setFormErrors] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
    });
    const navigate = useNavigate();

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        // Validate the image immediately
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
                if (!value) {
                    error = "Image is required";
                } else if (!value.type.startsWith("image/")) {
                    error = "File must be an image (JPEG, PNG, etc.)";
                } else if (value.size > 5 * 1024 * 1024) { // 5MB limit
                    error = "Image size must not exceed 5MB";
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

    const Submit = async (e) => {
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
        formData.append("images", image);

        try {
            // Send the data to the server
            await axios.post("http://localhost:8000/activities", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                title: "Success",
                text: "Activity added successfully",
                icon: "success",
            }).then(() => navigate("/activities"));
        } catch (err) {
            console.error("Failed to add activity:", err);
            Swal.fire({
                title: "Error",
                text: "Something went wrong, please try again.",
                icon: "error",
            });
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container bg-white rounded shadow p-4 mt-32 lg:mt-40 mb-5">
                <h1 className="mb-4" style={{ fontWeight: "bold" }}>
                    Add Activity
                </h1>
                <form onSubmit={Submit}>
                    <div className="form-group mb-3">
                        <label htmlFor="name" className="form-label">
                            Name
                        </label>
                        <input
                            type="text"
                            className={`form-control ${formErrors.name ? "border-danger" : ""}`}
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleChange}
                        />
                        {formErrors.name && (
                            <span className="text-danger">{formErrors.name}</span>
                        )}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            className={`form-control ${formErrors.description ? "border-danger" : ""}`}
                            id="description"
                            name="description"
                            value={description}
                            onChange={handleChange}
                        />
                        {formErrors.description && (
                            <span className="text-danger">{formErrors.description}</span>
                        )}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="price" className="form-label">
                            Price
                        </label>
                        <input
                            type="number"
                            className={`form-control ${formErrors.price ? "border-danger" : ""}`}
                            id="price"
                            name="price"
                            value={price}
                            onChange={handleChange}
                        />
                        {formErrors.price && (
                            <span className="text-danger">{formErrors.price}</span>
                        )}
                    </div>

                    <div className="form-group mb-4">
                        <label htmlFor="images" className="form-label">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            className={`form-control ${formErrors.image ? "border-danger" : ""}`}
                            id="images"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {formErrors.image && (
                            <span className="text-danger">{formErrors.image}</span>
                        )}
                    </div>

                    <div className="form-btn">
                        <button type="submit" className="btn btn-primary">
                            Add Activity
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddActivity;