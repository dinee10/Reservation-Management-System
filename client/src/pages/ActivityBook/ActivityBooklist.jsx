import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../../components/NavbarAdmin/Navbar";
import logo from "../../assets/Dinitha/logo3.png"; // Import the local logo

function ActivityBookinglist() {
    const [bookings, setBookings] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:8000/activitybookings")
            .then((result) => {
                console.log("Fetched bookings:", result.data.bookings); // Debug log
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const filteredBookings = result.data.bookings.filter((booking) => {
                    const bookingDate = new Date(booking.date);
                    return bookingDate >= today; // Only allow today or future dates
                });
                setBookings(filteredBookings);
            })
            .catch((err) => {
                console.error("Error fetching bookings:", err);
                Swal.fire({
                    title: "Error",
                    text: "Failed to fetch bookings. Please try again later.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            });
    }, []);

    const deleteBooking = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`http://localhost:8000/activitybookings/${id}`)
                    .then(() => {
                        setBookings(bookings.filter((booking) => booking._id !== id));
                        Swal.fire("Deleted!", "Booking has been deleted.", "success");
                    })
                    .catch((err) => {
                        console.error("Error deleting booking:", err);
                        Swal.fire({
                            title: "Error",
                            text: "Failed to delete booking.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    });
            }
        });
    };

    // Filter bookings based on search query (include activity name)
    const filteredBookings = bookings.filter((booking) => {
        const searchQuery = query.toLowerCase();
        const guestName = booking.guestName ? booking.guestName.toLowerCase() : "";
        const email = booking.email ? booking.email.toLowerCase() : "";
        const activityName = booking.activityId && booking.activityId.name
            ? booking.activityId.name.toLowerCase()
            : "";

        return (
            guestName.includes(searchQuery) ||
            email.includes(searchQuery) ||
            activityName.includes(searchQuery)
        );
    });

    // Function to convert a local image to base64
    const convertLocalImageToBase64 = (image) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = image;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL("image/png");
                resolve(dataURL);
            };
            img.onerror = (error) => {
                reject(error);
            };
        });
    };

    const generatePDF = async () => {
        // Show loading indicator
        Swal.fire({
            title: "Generating PDF...",
            text: "Please wait while the report is being generated.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const doc = new jsPDF();

        // Convert the local logo to base64
        let logoBase64;
        try {
            logoBase64 = await convertLocalImageToBase64(logo);
        } catch (error) {
            console.error("Error converting logo to base64:", error);
        }

        // Add the logo to the PDF if it loaded successfully
        if (logoBase64) {
            try {
                doc.addImage(logoBase64, "PNG", 14, 10, 50, 20); // Adjust position (x, y) and size (width, height)
            } catch (error) {
                console.error("Error adding logo to PDF:", error);
            }
        } else {
            console.warn("Unable to load logo for PDF. Skipping logo.");
        }

        // Add the title and date below the logo
        doc.setFontSize(22);
        doc.text("Booking Report", 105, 40, { align: "center" });

        doc.setFontSize(16);
        doc.text("Booking List", 14, 50);

        doc.setFontSize(12);
        doc.text("Updated booking list on " + new Date().toLocaleDateString(), 14, 60);

        // Define table headers and rows
        autoTable(doc, {
            head: [["Guest Name", "Activity", "Email", "Phone Number", "Passengers", "Date"]],
            body: filteredBookings.map((booking) => [
                booking.guestName || "N/A",
                booking.activityId?.name || "Unknown Activity",
                booking.email || "N/A",
                booking.phoneNumber || "N/A",
                booking.noOfPassengers || "N/A",
                booking.date ? new Date(booking.date).toLocaleDateString() : "N/A",
            ]),
            startY: 70, // Adjusted to start below the logo and text
            columnStyles: {
                0: { cellWidth: 30 }, // Guest Name
                1: { cellWidth: 40 }, // Activity
                2: { cellWidth: 40 }, // Email
                3: { cellWidth: 30 }, // Phone Number
                4: { cellWidth: 20 }, // Passengers
                5: { cellWidth: 20 }, // Date
            },
        });

        // Save the PDF and close the loading indicator
        doc.save("booking_report_" + new Date().toLocaleDateString() + ".pdf");
        Swal.close();
    };

    return (
        <div className="min-h-screen bg-gray-800">
            <Navbar />
            <div className="container mx-auto py-10 px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Title */}
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">Booking List</h3>

                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div className="w-full md:w-1/3 mb-4 md:mb-0">
                            <input
                                type="search"
                                placeholder="Search by guest, email, or activity..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                                onClick={generatePDF}
                            >
                                Generate Report
                            </button>
                        </div>
                    </div>

                    {/* Booking List */}
                    <div className="space-y-4">
                        {filteredBookings.length === 0 ? (
                            <p className="text-center text-gray-500">No bookings found.</p>
                        ) : (
                            filteredBookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="flex items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
                                >
                                    {/* Text Content */}
                                    <div className="flex-1">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">Guest Name:</p>
                                                <p className="text-sm text-gray-600">{booking.guestName || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">Activity:</p>
                                                <p className="text-sm text-gray-600">{booking.activityId?.name || "Unknown Activity"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">Email:</p>
                                                <p className="text-sm text-gray-600">{booking.email || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">Phone Number:</p>
                                                <p className="text-sm text-gray-600">{booking.phoneNumber || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">Passengers:</p>
                                                <p className="text-sm text-gray-600">{booking.noOfPassengers || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">Date:</p>
                                                <p className="text-sm text-gray-600">
                                                    {booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex space-x-2">
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                                            onClick={() => deleteBooking(booking._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivityBookinglist;