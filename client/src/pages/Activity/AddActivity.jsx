import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function AddActivity() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle multiple image uploads
    const handleImageChange = (e) => {
        setImage(e.target.files[0]); 
    };

    // Validate the form
    const validateForm = () => {
        let isValid = true;
        let errors = {};
    
        // Name Validation (letters and spaces only)
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(name)) {
          isValid = false;
          errors.name = "Name should only contain letters and spaces.";
        }
    
        // Price Validation (valid numerical value)
        if (isNaN(price) || price <= 0) {
          isValid = false;
          errors.price = "Please enter a valid price.";
        }
    
        setErrors(errors);
        return isValid;
      };

    
  const Submit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
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
           axios.post("http://localhost:8000/activities", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Important for file uploads
                },
            });

            Swal.fire({
                title: "Success",
                text: "Activity added successfully",
                icon: "success"
            }).then(() => navigate("/activities"));
        } catch (err) {
            console.error("Failed to add activity:", err);
            Swal.fire({
                title: "Error",
                text: "Something went wrong, please try again.",
                icon: "error"
            });
        }
    };

    return (
        <div>
            <Navbar/>
        
        <div className="container bg-white rounded shadow  p-4 mt-32 lg:mt-40 mb-5">
            <h1 className="mb-4 " style={{ fontWeight: 'bold' }}>Add Activity</h1>
            <form onSubmit={Submit}>
                <div className="form-group mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name='name'
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <span className="text-danger">{errors.name}</span>}
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name='description'
                        required
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && <span className="text-danger">{errors.description}</span>}
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        name='price'
                        required
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    {errors.price && <span className="text-danger">{errors.price}</span>}
                </div>

                {/* Upload Multiple Images Field */}
                <div className="form-group mb-4">
                    <label htmlFor="images" className="form-label">
                        Upload Images 
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        id="images"
                        accept="image/*"
                        required
                        onChange={handleImageChange}
                    />
                </div>

                <div className="form-btn">
                    <button type="submit" className="btn btn-primary">Add Activity</button>
                </div>
            </form>
        </div>
        <Footer/>
        </div>
    );
}

export default AddActivity;