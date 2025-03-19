import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function UpdateActivity() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null); // Store the image file
    const [existingImage, setExistingImage] = useState(''); // For image preview
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/activities/${id}`)
            .then(result => {
                const activity = result.data.activity;
                setName(activity.name);
                setDescription(activity.description);
                setPrice(activity.price);
                setExistingImage(activity.image); 
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Store the uploaded file in the state
      };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

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

    const updateActivity = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        if (image) {
            formData.append('images', image); // Append the image file
        }

        axios.put(`http://localhost:8000/activities/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Required for file uploads
            },
        })
            .then(() => {
                Swal.fire({
                    title: "Success",
                    text: "Activity updated successfully",
                    icon: "success"
                }).then(() => navigate('/activities'));
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <Navbar/>
            <div className="container bg-white rounded shadow  p-4 mt-32 lg:mt-40 mb-5">
            <h1 className="mb-4 " style={{ fontWeight: 'bold' }}>Update Activity</h1>
            <form onSubmit={updateActivity}>
                <div className="form-group mb-3">
                    <label className="form-label">Activity Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    {errors.name && <span className="text-danger">{errors.name}</span>}
                </div>

                <div className="form-group mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    {errors.description && <span className="text-danger">{errors.description}</span>}
                </div>

                <div className="form-group mb-3">
                    <label className="form-label">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    {errors.price && <span className="text-danger">{errors.price}</span>}
                </div>

                {/* Display the Existing Image */}
                {existingImage && (
                <div className="form-group mb-4">
                 <label className="form-label">Current Image</label>
                  <div>
                    <img
                      src={`http://localhost:8000/${existingImage}`}
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                  </div>
                </div>
               )}

                <div className="form-group mb-4">
                   <label htmlFor="image" className="form-label">
                    Upload New Image
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Update Activity</button>
            </form>
        </div>
        <Footer/>
        </div>
    );
}

export default UpdateActivity;