import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const BookingPage = () => {
    const { id } = useParams(); // Get activity ID from URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        guestName: "",
        email: "",
        phoneNumber: "",
        noOfPassengers: 1,
        date:"",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/activitybookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, activityId: id }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Booking Successful!",
                    text: "Your activity booking has been confirmed.",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => navigate("/activities/customer")); // Redirect after confirmation
            } else {
                Swal.fire({
                    title: "Booking Failed!",
                    text: data.message || "An error occurred while booking.",
                    icon: "error",
                    confirmButtonText: "Try Again",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "There was an error processing your request.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        
        <div>
            <Navbar/>
            <div className="max-w-lg mx-auto mt-36 p-10 mb-3 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-6 text-center">Book Your Activity</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="guestName" placeholder="Guest Name" className="w-full p-2 border rounded mb-3" required onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded mb-3" required onChange={handleChange} />
                <input type="text" name="phoneNumber" placeholder="Phone Number" className="w-full p-2 border rounded mb-3" required onChange={handleChange} />
                <input type="number" name="noOfPassengers" placeholder="No. of Passengers" className="w-full p-2 border rounded mb-3" required min="1" onChange={handleChange} />
                <input type="date" name="date" className="w-full p-2 border rounded mb-3" required min={new Date().toISOString().split("T")[0]} onChange={handleChange}/>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Confirm Booking</button>
            </form>
        </div>
        <Footer/>
        </div>
        
    );
};

export default BookingPage;
