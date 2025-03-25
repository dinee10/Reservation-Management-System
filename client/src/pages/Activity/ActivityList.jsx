import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import Navbar from '../../components/Navbar';


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

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("tt", 105, 20, { align: "center" });

        doc.setFontSize(16);
        doc.text("Activity List", 14, 40);

        doc.setFontSize(12);
        doc.text("Updated activity list on " + new Date().toLocaleDateString(), 14, 50);

        const headers = [["Name", "Description", "Price"]];
        const rows = filteredActivities.map(activity => [
            activity.name,
            activity.description,
            `$${activity.price}`,
            "" // Placeholder for image
        ]);
        const convertImageToBase64 = async (imageUrl) => {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                console.error("Error loading image:", error);
                return null;
            }
        };

        autoTable(doc, {
            head: headers,
            body: rows,
            startY: 60,
            didDrawCell: async (data) => {
                if (data.column.index === 3) { // Image column
                    const activity = filteredActivities[data.row.index];
                    const imageUrl = `http://localhost:8000${activity.image}`;
    
                    if (activity.image) {
                        const base64Image = await convertImageToBase64(imageUrl);
                        if (base64Image) {
                            doc.addImage(base64Image, "JPEG", data.cell.x + 2, data.cell.y + 2, 15, 15); // Adjust size as needed
                        } else {
                            console.warn("Unable to convert image to base64 for activity:", activity.name);
                        }
                    }
                }
            },
        });

        doc.save("activity_report "+ new Date().toLocaleDateString() + ".pdf");
    };

    return (
        
            <div className="pt-5 mt-5"> 
               <Navbar />
    
               <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" , marginTop: "36px" }}>
                <div className="container bg-white rounded shadow p-5" style={{ maxWidth: "1200px", width: "100%" }}>
                <h3 className="mb-8 text-center fw-bold" style={{ fontSize: '36px' }}>
                   Activity List
                </h3>


               {/* Search Bar and Buttons */}
               <div className="row mb-4">
                  <div className="col-md-4">
                     <input
                         type="search"
                         placeholder="Search activities..."
                         className="form-control"
                         value={query}
                         onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="col-md-7 text-right">
                        <button className="btn btn-primary mx-2" onClick={() => navigate("/activities/create")}>
                          Add Activity
                        </button>
                        <button className="btn btn-primary mx-2" onClick={() => navigate("/activities/customer/book")}>
                          Booking List
                        </button>
                    </div>
                </div>


                {/* Activity Table */}
                <table className="table table-striped table-bordered table-hover text-center">
                    <thead className="thead-dark">
                        <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Price</th>
                        <th scope="col">Image</th>
                        <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredActivities.map(activity => (
                            <tr key={activity._id}>
                                <td className="align-middle">{activity.name}</td>
                                <td className="align-middle">{activity.description}</td>
                                <td className="align-middle">${activity.price}</td>
                                <td className="align-middle text-center">
                                        {activity.image ? (
                                        <img 
                                           src={`http://localhost:8000/${activity.image}`} 
                                           alt={activity.name} 
                                           style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                                           className="img-thumbnail d-block mx-auto"
                                        />
                                       ) : (
                                            <span>No Image</span>
                                          )}
                                </td>
                                <td className="align-middle">
                                    <button
                                        className="btn btn-warning btn-sm my-1 mr-2 px-3"
                                        onClick={() => navigate(`/activities/update/${activity._id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm my-1 px-3"
                                        onClick={() => deleteActivity(activity._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Generate Report Button */}
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

export default ActivityList;
