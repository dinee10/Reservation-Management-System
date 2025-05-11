import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import Navbar from '../../components/NavbarAdmin/Navbar';
import logo from '../../assets/Dinitha/logo3.png'; // Import the local logo

function ActivityList() {
    const [activities, setActivities] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/activities")
            .then(result => setActivities(result.data.activities))
            .catch(err => console.log(err));
    }, []);

    const deleteActivity = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8000/activities/${id}`)
                    .then(() => {
                        setActivities(activities.filter(activity => activity._id !== id));
                        Swal.fire("Deleted!", "Activity has been deleted.", "success");
                    })
                    .catch(err => console.log(err));
            }
        });
    };

    const filteredActivities = activities.filter(activity =>
        activity.name?.toLowerCase().includes(query.toLowerCase()) ||
        activity.description?.toLowerCase().includes(query.toLowerCase())
    );

    // Function to convert a local image to base64 (for the logo)
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
        doc.text("Activity Report", 105, 40, { align: "center" });

        doc.setFontSize(16);
        doc.text("Activity List", 14, 50);

        doc.setFontSize(12);
        doc.text("Updated activity list on " + new Date().toLocaleDateString(), 14, 60);

        // Define table headers and rows (removed the Image column)
        const headers = [["Name", "Description", "Price"]];
        const rows = filteredActivities.map(activity => [
            activity.name,
            activity.description,
            `$${activity.price}`,
        ]);

        // Add the table without images
        autoTable(doc, {
            head: headers,
            body: rows,
            startY: 70, // Adjusted to start below the logo and text
            columnStyles: {
                0: { cellWidth: 50 }, // Name column
                1: { cellWidth: 80 }, // Description column
                2: { cellWidth: 40 }, // Price column
            },
        });

        // Save the PDF and close the loading indicator
        doc.save("activity_report_" + new Date().toLocaleDateString() + ".pdf");
        Swal.close();
    };

    return (
        <div className="min-h-screen bg-gray-800">
            <Navbar />
            <div className="container mx-auto py-10 px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Title */}
                    <h3 className="text-3xl font-bold text-gray-800 mb-6">Activity List</h3>

                    {/* Search Bar and Buttons */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div className="w-full md:w-1/3 mb-4 md:mb-0">
                            <input
                                type="search"
                                placeholder="Search activities..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                onClick={() => navigate("/activities/create")}
                            >
                                Add Activity
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                onClick={() => navigate("/activities/customer/book")}
                            >
                                Booking List
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                                onClick={generatePDF}
                            >
                                Generate Report
                            </button>
                        </div>
                    </div>

                    {/* Activity List */}
                    <div className="space-y-4">
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map(activity => (
                                <div
                                    key={activity._id}
                                    className="flex items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
                                >
                                    {/* Image */}
                                    <div className="w-24 h-24 mr-4">
                                        {activity.image ? (
                                            <img
                                                src={`http://localhost:8000/${activity.image}`}
                                                alt={activity.name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-800">{activity.name}</h4>
                                        <p className="text-sm text-gray-500">Price: ${activity.price}</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2">
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                                            onClick={() => deleteActivity(activity._id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                            onClick={() => navigate(`/activities/update/${activity._id}`)}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No activities found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivityList;