import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function UpdateRoom() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [maxCount, setMaxCount] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [rentperday, setRentperday] = useState('');
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [beds, setBeds] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [sleeps, setSleeps] = useState('');
    const [amenities, setAmenities] = useState([]);
    const [ecoFriendly, setEcoFriendly] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/api/rooms/${id}`)
            .then(result => {
                const room = result.data;
                setName(room.name);
                setMaxCount(room.maxCount);
                setPhonenumber(room.phonenumber);
                setRentperday(room.rentperday);
                setExistingImage(room.imageurl[0]);
                setType(room.type);
                setDescription(room.description);
                setLocation(room.location);
                setBeds(room.beds);
                setBathrooms(room.bathrooms);
                setSleeps(room.sleeps);
                setAmenities(room.amenities);
                setEcoFriendly(room.ecoFriendly);
            })
            .catch(err => console.log(err));
    }, [id]);

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

    const updateRoom = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('maxCount', maxCount);
        formData.append('phonenumber', phonenumber);
        formData.append('rentperday', rentperday);
        if (image) formData.append('imageurl', image); // Only append new image if uploaded
        formData.append('type', type);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('beds', beds);
        formData.append('bathrooms', bathrooms);
        formData.append('sleeps', sleeps);
        formData.append('amenities', JSON.stringify(amenities)); // Convert array to string
        formData.append('ecoFriendly', ecoFriendly);

        axios.put(`http://localhost:8000/api/rooms/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(() => {
                Swal.fire({
                    title: "Success",
                    text: "Room updated successfully",
                    icon: "success"
                }).then(() => navigate('/rooms/list'));
            })
            .catch(err => {
                console.error("Failed to update room:", err);
                Swal.fire({
                    title: "Error",
                    text: "Something went wrong, please try again.",
                    icon: "error"
                });
            });
    };

    return (
        <div>
            <div className="container bg-white rounded shadow p-4 mt-20 mb-5">
                <h1 className="mb-4" style={{ fontWeight: 'bold' }}>Update Room</h1>
                <form onSubmit={updateRoom}>
                    <div className="form-group mb-3">
                        <label className="form-label">Room Name</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                        {errors.name && <span className="text-danger">{errors.name}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Max Guests</label>
                        <input type="number" className="form-control" value={maxCount} onChange={(e) => setMaxCount(e.target.value)} required />
                        {errors.maxCount && <span className="text-danger">{errors.maxCount}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Phone Number</label>
                        <input type="text" className="form-control" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} required />
                        {errors.phonenumber && <span className="text-danger">{errors.phonenumber}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Rent Per Day (LKR)</label>
                        <input type="number" className="form-control" value={rentperday} onChange={(e) => setRentperday(e.target.value)} required />
                        {errors.rentperday && <span className="text-danger">{errors.rentperday}</span>}
                    </div>

                    {existingImage && (
                        <div className="form-group mb-4">
                            <label className="form-label">Current Image</label>
                            <div>
                                <img src={existingImage} style={{ width: "150px", height: "150px", objectFit: "cover" }} alt="Current room" />
                            </div>
                        </div>
                    )}

                    <div className="form-group mb-3">
                        <label className="form-label">Upload New Image (optional)</label>
                        <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Room Type</label>
                        <select className="form-control" value={type} onChange={(e) => setType(e.target.value)} required>
                            <option value="">Select Type</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Suite">Suite</option>
                        </select>
                        {errors.type && <span className="text-danger">{errors.type}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Location</label>
                        <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
                        {errors.location && <span className="text-danger">{errors.location}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Number of Beds</label>
                        <input type="number" className="form-control" value={beds} onChange={(e) => setBeds(e.target.value)} required />
                        {errors.beds && <span className="text-danger">{errors.beds}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Number of Bathrooms</label>
                        <input type="number" className="form-control" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} required />
                        {errors.bathrooms && <span className="text-danger">{errors.bathrooms}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Sleeps</label>
                        <input type="number" className="form-control" value={sleeps} onChange={(e) => setSleeps(e.target.value)} required />
                        {errors.sleeps && <span className="text-danger">{errors.sleeps}</span>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Amenities (comma-separated)</label>
                        <input
                            type="text"
                            className="form-control"
                            value={amenities.join(', ')}
                            onChange={handleAmenitiesChange}
                            placeholder="e.g., WiFi, TV, AC"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-check-label">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={ecoFriendly}
                                onChange={(e) => setEcoFriendly(e.target.checked)}
                            />
                            Eco-Friendly
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary">Update Room</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateRoom;