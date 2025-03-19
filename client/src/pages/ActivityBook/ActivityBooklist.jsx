import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function ActivityBookinglist() {
    const [bookings, setBookings] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/activitybookings")
            .then(result => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const filteredBookings = result.data.bookings.filter(booking => {
                    const bookingDate = new Date(booking.date);
                    return bookingDate >= today; // Only allow today or future dates
                });
                setBookings(filteredBookings);
            })
            .catch(err => console.log(err));
    }, []);

    const deleteBooking = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8000/activitybookings/${id}`)
                    .then(() => {
                        setBookings(bookings.filter(booking => booking._id !== id));
                        Swal.fire("Deleted!", "Booking has been deleted.", "success");
                    })
                    .catch(err => console.log(err));
            }
        });
    };

    const filteredBookings = bookings.filter(booking =>
        booking.guestName?.toLowerCase().includes(query.toLowerCase()) ||
        booking.email?.toLowerCase().includes(query.toLowerCase())
    );

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Booking Report", 105, 20, { align: "center" });

        doc.setFontSize(16);
        doc.text("Booking List", 14, 40);

        doc.setFontSize(12);
        doc.text("Updated booking list on " + new Date().toLocaleDateString(), 14, 50);

        autoTable(doc, {
            head: [["Guest Name", "Email", "Phone Number", "Passengers", "Date"]],
            body: filteredBookings.map(booking => [
                booking.guestName,
                booking.email,
                booking.phoneNumber,
                booking.noOfPassengers,
                booking.date
            ]),
            startY: 60
        });

        doc.save("booking_report_" + new Date().toLocaleDateString() + ".pdf");
    };

    return (
        <div className="pt-5 mt-5"> 
            <Navbar />

            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh"  }}>
                <div className="container bg-white rounded shadow p-5" style={{ maxWidth: "1200px", width: "100%" }}>
                <h3 className="mb-8 text-center fw-bold" style={{ fontSize: '36px' }}>
                   Booking List
                </h3>

                    <div className="row mb-4">
                        <div className="col-md-4">
                            <input
                                type="search"
                                placeholder="Search bookings..."
                                className="form-control"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                       
                    </div>

                    <table className="table table-striped table-bordered table-hover text-center">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Guest Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col">Passengers</th>
                                <th scope="col">Date</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map(booking => (
                                <tr key={booking._id}>
                                    <td className="align-middle">{booking.guestName}</td>
                                    <td className="align-middle">{booking.email}</td>
                                    <td className="align-middle">{booking.phoneNumber}</td>
                                    <td className="align-middle">{booking.noOfPassengers}</td>
                                    <td className="align-middle">{new Date(booking.date).toLocaleDateString()}</td>
                                    <td className="align-middle">
                                        <button className="btn btn-danger btn-sm my-1 px-3" onClick={() => deleteBooking(booking._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="text-left">
                        <button className="btn btn-success" onClick={generatePDF}>Generate Report</button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ActivityBookinglist;
