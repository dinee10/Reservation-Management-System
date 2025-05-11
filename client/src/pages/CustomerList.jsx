import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function CustomerBookingList() {
    const [bookings, setBookings] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/bookinglist") // Adjust endpoint based on your routes
            .then((result) => {
                console.log("Fetched bookings:", result.data);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                setBookings(result.data); // Assuming your getAllBookings returns all bookings
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

    // Filter bookings based on search query
    const filteredBookings = bookings.filter((booking) => {
        const searchQuery = query.toLowerCase();
        const fullName = `${booking.firstName} ${booking.lastName}`.toLowerCase();
        const email = booking.email ? booking.email.toLowerCase() : "";
        const phone = booking.phone ? booking.phone.toLowerCase() : "";

        return (
            fullName.includes(searchQuery) ||
            email.includes(searchQuery) ||
            phone.includes(searchQuery)
        );
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Customer Booking Report", 105, 20, { align: "center" });

        doc.setFontSize(16);
        doc.text("Booking List", 14, 40);

        doc.setFontSize(12);
        doc.text("Updated booking list on " + new Date().toLocaleDateString(), 14, 50);

        autoTable(doc, {
            head: [["Title", "Full Name", "Email", "Phone", "Traveling for Work", "Booking ID"]],
            body: filteredBookings.map((booking) => [
                booking.title || "N/A",
                `${booking.firstName} ${booking.lastName}` || "N/A",
                booking.email || "N/A",
                booking.phone || "N/A",
                booking._id || "N/A",
            ]),
            startY: 60,
        });

        doc.save("customer_booking_report_" + new Date().toLocaleDateString() + ".pdf");
    };

    return (
        <div className="pt-1 mt-1">
            
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <div className="container bg-white rounded shadow p-5" style={{ maxWidth: "1200px", width: "100%" }}>
                    <h3 className="mb-8 text-center fw-bold" style={{ fontSize: "30px" }}>
                        Customer Booking List
                    </h3>

                    <div className="row mb-4">
                        <div className="col-md-4">
                            <input
                                type="search"
                                placeholder="Search by name, email, or phone..."
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
                                    <th scope="col">Title</th>
                                    <th scope="col">Full Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Booking ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td className="align-middle">{booking.title || "N/A"}</td>
                                        <td className="align-middle">{`${booking.firstName} ${booking.lastName}` || "N/A"}</td>
                                        <td className="align-middle">{booking.email || "N/A"}</td>
                                        <td className="align-middle">{booking.phone || "N/A"}</td>
                                        <td className="align-middle">{booking._id || "N/A"}</td>
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

export default CustomerBookingList;