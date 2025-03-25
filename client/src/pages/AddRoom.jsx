import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AddRoom() {
    const [name, setName] = useState("");
    const [maxCount, setMaxCount] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [rentperday, setRentperday] = useState("");
    const [image, setImage] = useState(null);
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [beds, setBeds] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [sleeps, setSleeps] = useState("");
    const [amenities, setAmenities] = useState([]);
    const [ecoFriendly, setEcoFriendly] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleAmenitiesChange = (e) => {
        const value = e.target.value;
        setAmenities(value.split(',').map(item => item.trim()));
    };

    const validateForm = () => {
        let isValid = true;
        let errors = {};

        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(name)) {
            isValid = false;
            errors.name = "Name should only contain letters and spaces.";
        }

        if (isNaN(maxCount) || maxCount <= 0) {
            isValid = false;
            errors.maxCount = "Please enter a valid number of guests.";
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phonenumber)) {
            isValid = false;
            errors.phonenumber = "Phone number must be 10 digits.";
        }

        if (isNaN(rentperday) || rentperday <= 0) {
            isValid = false;
            errors.rentperday = "Please enter a valid price.";
        }

        if (!image) {
            isValid = false;
            errors.image = "Please upload an image.";
        }

        if (!type) {
            isValid = false;
            errors.type = "Please select a room type.";
        }

        if (!location) {
            isValid = false;
            errors.location = "Please enter a location.";
        }

        if (isNaN(beds) || beds <= 0) {
            isValid = false;
            errors.beds = "Please enter a valid number of beds.";
        }

        if (isNaN(bathrooms) || bathrooms <= 0) {
            isValid = false;
            errors.bathrooms = "Please enter a valid number of bathrooms.";
        }

        if (isNaN(sleeps) || sleeps <= 0) {
            isValid = false;
            errors.sleeps = "Please enter a valid number of sleeps.";
        }

        setErrors(errors);
        return isValid;
    };

    const Submit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("maxCount", maxCount);
        formData.append("phonenumber", phonenumber);
        formData.append("rentperday", rentperday);
        formData.append("imageurl", image);
        formData.append("type", type);
        formData.append("description", description);
        formData.append("location", location);
        formData.append("beds", beds);
        formData.append("bathrooms", bathrooms);
        formData.append("sleeps", sleeps);
        formData.append("amenities", JSON.stringify(amenities));
        formData.append("ecoFriendly", ecoFriendly);

        try {
            const response = await axios.post("http://localhost:8000/api/rooms", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                title: "Success",
                text: "Room added successfully",
                icon: "success"
            }).then(() => navigate("/"));
        } catch (err) {
            console.error("Failed to add room:", err);
            Swal.fire({
                title: "Error",
                text: "Something went wrong, please try again.",
                icon: "error"
            });
        }
    };

    return (
        <div className="d-flex flex-column align-items-center min-vh-100 bg-light">
            {/* Move "Add Room" title to the top */}
            <h1 className="mt-1 mb-3" style={{ fontWeight: 'bold', fontSize: '20px', color: '#000000' }}>Add Room</h1>

            {/* Center the form and reduce its width */}
            <div className="container bg-white rounded shadow p-4" style={{ maxWidth: '500px' }}>
                <form onSubmit={Submit}>
                    <div className="form-group mb-2">
                        <label className="form-label">Room Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {errors.name && <span className="text-danger">{errors.name}</span>}
                    </div>

                    <div className="form-group mb-2">
                        <label className="form-label">Max Guests</label>
                        <input
                            type="number"
                            className="form-control"
                            value={maxCount}
                            onChange={(e) => setMaxCount(e.target.value)}
                            required
                        />
                        {errors.maxCount && <span className="text-danger">{errors.maxCount}</span>}
                    </div>

                    <div className="form-group mb-2">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={phonenumber}
                            onChange={(e) => setPhonenumber(e.target.value)}
                            required
                        />
                        {errors.phonenumber && <span className="text-danger">{errors.phonenumber}</span>}
                    </div>

                    <div className="form-group mb-2">
                        <label className="form-label">Rent Per Day (LKR)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={rentperday}
                            onChange={(e) => setRentperday(e.target.value)}
                            required
                        />
                        {errors.rentperday && <span className="text-danger">{errors.rentperday}</span>}
                    </div>

                    <div className="form-group mb-2">
                        <label className="form-label">Upload Image</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                        />
                        {errors.image && <span className="text-danger">{errors.image}</span>}
                    </div>

                    <div className="form-group mb-2">
                        <label className="form-label">Room Type</label>
                        <select
                            className="form-control"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Twin">Twin</option>
                            <option value="Suite">Suite</option>
                            <option value="Mixed">Mixed (Single + Double)</option>
                        </select>
                        {errors.type && <span className="text-danger">{errors.type}</span>}
                    </div>

                    <div className="form-group mb-2">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            className="form-control"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                        {errors.location && <span className="text-danger">{errors.location}</span>}
                    </div>

                    <div className="form-group mb-2">
                        <label className="form-label">Number of Beds</label>
                        <input
                            type="number"
                            className="form-control"
                            value={beds}
                            onChange={(e) => setBeds(e.target.value)}
                            required
                        />
                        {errors.beds && <span className="text-danger">{errors.beds}</span>}
                    </div>

                    <div className="form-group mb-2">
                        <label className="form-label">Number of Bathrooms</label>
                        <input
                            type="number"
                            className="form-control"
                            value={bathrooms}
                            onChange={(e) => setBathrooms(e.target.value)}
                            required
                        />
                        {errors.bathrooms && <span className="text-danger">{errors.bathrooms}</span>}
                    </div>

                    <div className="form-group mb-2">
                        <label className="form-label">Sleeps</label>
                        <input
                            type="number"
                            className="form-control"
                            value={sleeps}
                            onChange={(e) => setSleeps(e.target.value)}
                            required
                        />
                        {errors.sleeps && <span className="text-danger">{errors.sleeps}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-check-label">
                            <input
                                type="checkbox"
                                className="form-check-input me-2"
                                checked={ecoFriendly}
                                onChange={(e) => setEcoFriendly(e.target.checked)}
                            />
                            Eco-Friendly
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary w-100" >Add Room</button>
                </form>
            </div>
        </div>
    );
}

export default AddRoom;