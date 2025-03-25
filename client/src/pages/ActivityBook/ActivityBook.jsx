import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";


// Validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
const phoneRegex = /^\+?\d{10,15}$/; // 10-15 digits, optional + at the start
const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces

const ActivityBook = () => {
    const { activityId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        guestName: "",
        email: "",
        phoneNumber: "",
        noOfPassengers: 1,
        date: "",
    });
    const [formErrors, setFormErrors] = useState({
        guestName: "",
        email: "",
        phoneNumber: "",
        noOfPassengers: "",
        date: "",
    });
    const [activityName, setActivityName] = useState("");
    const [error, setError] = useState("");

    // Fetch activity details
    useEffect(() => {
        console.log("Current URL:", window.location.pathname);
        console.log("Activity ID from useParams:", activityId);

        const fetchActivity = async () => {
            if (!activityId) {
                console.error("Activity ID is undefined");
                setError("Invalid activity ID. Please select a valid activity.");
                return;
            }

            console.log("Fetching activity with ID:", activityId);

            try {
                const response = await fetch(`http://localhost:8000/activities/${activityId}`);
                const data = await response.json();
                if (response.ok) {
                    setActivityName(data.activity.name);
                } else {
                    console.error("Failed to fetch activity:", data.message);
                    setError("Failed to load activity details.");
                }
            } catch (error) {
                console.error("Error fetching activity:", error);
                setError("An error occurred while fetching activity details.");
            }
        };
        fetchActivity();
    }, [activityId]);

    // Validate a single field
    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "guestName":
                if (!value || value.trim() === "") {
                    error = "Guest name is required";
                } else if (!nameRegex.test(value)) {
                    error = "Guest name can only contain letters and spaces";
                }
                break;
            case "email":
                if (!value || value.trim() === "") {
                    error = "Email is required";
                } else if (!emailRegex.test(value)) {
                    error = "Please enter a valid email address";
                }
                break;
            case "phoneNumber":
                if (!value || value.trim() === "") {
                    error = "Phone number is required";
                } else if (!phoneRegex.test(value)) {
                    error = "Please enter a valid phone number (10-15 digits, optional +)";
                }
                break;
            case "noOfPassengers":
                if (!value || value < 1) {
                    error = "Number of passengers must be at least 1";
                }
                break;
            case "date":
                if (!value) {
                    error = "Date is required";
                } else {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate < today) {
                        error = "Date cannot be in the past";
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
        setFormData({ ...formData, [name]: value });

        // Validate the field and update errors
        const error = validateField(name, value);
        setFormErrors({ ...formErrors, [name]: error });
    };

    // Validate all fields before submission
    const validateForm = () => {
        const errors = {};
        let isValid = true;

        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            errors[key] = error;
            if (error) isValid = false;
        });

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the entire form
        if (!validateForm()) {
            Swal.fire({
                title: "Validation Error",
                text: "Please fix the errors in the form before submitting.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        if (!activityId) {
            Swal.fire({
                title: "Error",
                text: "Invalid activity ID. Please select a valid activity.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/activitybookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, activityId }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Booking Successful!",
                    text: `You have successfully booked ${activityName}. `, //A confirmation email has been sent to ${formData.email}.
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => navigate("/activities/customer"));
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

    if (error) {
        return (
            <div>
                <Navbar />
                <div className="max-w-lg mx-auto mt-36 p-10 mb-3 bg-white rounded-lg shadow-lg">
                    <h2 className="text-3xl font-semibold mb-6 text-center text-red-600">
                        Error
                    </h2>
                    <p className="text-center">{error}</p>
                    <div className="text-center mt-4">
                        <button
                            onClick={() => navigate("/activities/customer")}
                            className="bg-blue-600 text-white p-2 rounded"
                        >
                            Go Back to Activities
                        </button>
                    </div>
                </div>
               
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-lg mx-auto mt-36 p-10 mb-3 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold mb-6 text-center">
                    Book Your Activity{activityName ? `: ${activityName}` : ""}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="guestName"
                            placeholder="Guest Name"
                            className={`w-full p-2 border rounded ${formErrors.guestName ? "border-red-500" : ""}`}
                            value={formData.guestName}
                            onChange={handleChange}
                        />
                        {formErrors.guestName && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.guestName}</p>
                        )}
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className={`w-full p-2 border rounded ${formErrors.email ? "border-red-500" : ""}`}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {formErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                        )}
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            className={`w-full p-2 border rounded ${formErrors.phoneNumber ? "border-red-500" : ""}`}
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                        {formErrors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
                        )}
                    </div>
                    <div className="mb-3">
                        <input
                            type="number"
                            name="noOfPassengers"
                            placeholder="No. of Passengers"
                            className={`w-full p-2 border rounded ${formErrors.noOfPassengers ? "border-red-500" : ""}`}
                            value={formData.noOfPassengers}
                            onChange={handleChange}
                            min="1"
                        />
                        {formErrors.noOfPassengers && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.noOfPassengers}</p>
                        )}
                    </div>
                    <div className="mb-3">
                        <input
                            type="date"
                            name="date"
                            className={`w-full p-2 border rounded ${formErrors.date ? "border-red-500" : ""}`}
                            value={formData.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                        />
                        {formErrors.date && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
                        )}
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                        Confirm Booking
                    </button>
                </form>
            </div>
            
        </div>
    );
};

export default ActivityBook;