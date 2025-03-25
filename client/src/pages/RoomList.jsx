import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";

function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/api/rooms")
            .then(result => setRooms(result.data))
            .catch(err => console.log(err));
    }, []);

    const deleteRoom = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8000/api/rooms/${id}`)
                    .then(() => {
                        setRooms(rooms.filter(room => room._id !== id));
                        Swal.fire("Deleted!", "Room has been deleted.", "success");
                    })
                    .catch(err => console.log(err));
            }
        });
    };

    const filteredRooms = rooms.filter(room =>
        room.name?.toLowerCase().includes(query.toLowerCase()) ||
        room.description?.toLowerCase().includes(query.toLowerCase()) ||
        room.location?.toLowerCase().includes(query.toLowerCase())
    );

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Hotel Room Report", 105, 20, { align: "center" });
    
        doc.setFontSize(16);
        doc.text("Room List", 14, 40);
    
        doc.setFontSize(12);
        doc.text("Updated room list on " + new Date().toLocaleDateString(), 14, 50);
    
        const headers = [
            ["Name", "Max Guests", "Price/Day", "Location", "Type", "Beds", "Bathrooms", "Sleeps", "Eco-Friendly"]
        ];
        
        const rows = filteredRooms.map(room => [
            room.name,
            room.maxCount,
            `LKR ${room.rentperday}`,
            room.location,
            room.type,
            room.beds,
            room.bathrooms,
            room.sleeps,
            room.ecoFriendly ? "Yes" : "No"
        ]);
    
        // 🔹 Generate the table with headers and rows
        autoTable(doc, {
            startY: 60,
            head: headers,
            body: rows,
            theme: 'grid', // Adds grid lines
            headStyles: {
                fillColor: [235, 52, 64], // Dark blue-gray background
                textColor: [255, 255, 255], // White text
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240] // Light gray for alternating rows
            },
            styles: {
                fontSize: 10,
                cellPadding: 3
            }
            
        });
    
        // 🔹 Save the PDF with a timestamped filename
        doc.save("room_report_" + new Date().toLocaleDateString() + ".pdf");
    };
    
    return (
        <div className="pt-1 mt-1">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", marginTop: "1px" }}>
                <div className="container bg-white rounded shadow p-5" style={{ maxWidth: "1400px", width: "100%" }}>
                    <h3 className="mb-8 text-center fw-bold" style={{ fontSize: '30px'}}>
                        Room List
                    </h3>

                    <div className="row mb-4">
                        <div className="col-md-4">
                            <input
                                type="search"
                                placeholder="Search rooms..."
                                className="form-control"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div className="col-md-7 text-right">
                            <button className="btn btn-primary mx-2" onClick={() => navigate("/rooms/create")}>
                                Add Room
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover text-center">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Max Guests</th>
                                    <th scope="col">Price/Day</th>
                                    <th scope="col">Location</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Beds</th>
                                    <th scope="col">Bathrooms</th>
                                    <th scope="col">Sleeps</th>
                                    <th scope="col">Eco-Friendly</th>
                                    <th scope="col">Rating</th>
                                    <th scope="col">Reviews</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRooms.map(room => (
                                    <tr key={room._id}>
                                        <td className="align-middle">{room.name}</td>
                                        <td className="align-middle">{room.maxCount}</td>
                                        <td className="align-middle">LKR {room.rentperday}</td>
                                        <td className="align-middle">{room.location}</td>
                                        <td className="align-middle">{room.type}</td>
                                        <td className="align-middle text-center">
                                            {room.imageurl[0] ? (
                                                <img
                                                    src={room.imageurl[0]}
                                                    alt={room.name}
                                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                    className="img-thumbnail d-block mx-auto"
                                                />
                                            ) : (
                                                <span>No Image</span>
                                            )}
                                        </td>
                                        <td className="align-middle">{room.phonenumber}</td>
                                        <td className="align-middle">{room.description}</td>
                                        <td className="align-middle">{room.beds}</td>
                                        <td className="align-middle">{room.bathrooms}</td>
                                        <td className="align-middle">{room.sleeps}</td>
                                        <td className="align-middle">{room.ecoFriendly ? "Yes" : "No"}</td>
                                        <td className="align-middle">{room.rating}</td>
                                        <td className="align-middle">{room.reviewsCount}</td>
                                        <td className="align-middle">
                                            <button
                                                className="btn btn-warning btn-sm my-1 mr-2 px-3"
                                                onClick={() => navigate(`/rooms/update/${room._id}`)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm my-1 px-3"
                                                onClick={() => deleteRoom(room._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

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

export default RoomList;