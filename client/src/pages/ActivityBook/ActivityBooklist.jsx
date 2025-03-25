import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../../components/Navbar/Navbar";


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

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Booking Report", 105, 20, { align: "center" });

        doc.setFontSize(16);
        doc.text("Booking List", 14, 40);

        doc.setFontSize(12);
        doc.text("Updated booking list on " + new Date().toLocaleDateString(), 14, 50);

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
            startY: 60,
        });

        doc.save("booking_report_" + new Date().toLocaleDateString() + ".pdf");
    };

    return (
        <div className="pt-5 mt-5">
            <Navbar />
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <div className="container bg-white rounded shadow p-5" style={{ maxWidth: "1200px", width: "100%" }}>
                    <h3 className="mb-8 text-center fw-bold" style={{ fontSize: "36px" }}>
                        Booking List
                    </h3>

                    <div className="row mb-4">
                        <div className="col-md-4">
                            <input
                                type="search"
                                placeholder="Search by guest, email, or activity..."
                                className="form-control"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {filteredBookings.length === 0 ? (
                        <p className="text-center text-gray-700">No bookings found.</p>
                    ) : (
                        <table className="table table-striped table-bordered table-hover text-center">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Guest Name</th>
                                    <th scope="col">Activity</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col">Passengers</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td className="align-middle">{booking.guestName || "N/A"}</td>
                                        <td className="align-middle">{booking.activityId?.name || "Unknown Activity"}</td>
                                        <td className="align-middle">{booking.email || "N/A"}</td>
                                        <td className="align-middle">{booking.phoneNumber || "N/A"}</td>
                                        <td className="align-middle">{booking.noOfPassengers || "N/A"}</td>
                                        <td className="align-middle">
                                            {booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="align-middle">
                                            <button
                                                className="btn btn-danger btn-sm my-1 px-3"
                                                onClick={() => deleteBooking(booking._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div className="text-left">
                        <button className="btn btn-success" onClick={generatePDF}>
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>
           
        </div>
    );
}

export default ActivityBookinglist;