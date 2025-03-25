import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";


const ActivitiesPage = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch activities from the backend
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get("http://localhost:8000/activities");
                setActivities(response.data.activities);
            } catch (err) {
                setError("Failed to fetch activities. Please try again later.");
                console.error("Error fetching activities:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    // Handle image loading errors
    const handleImageError = (event) => {
        event.target.src = "/fallback-image.jpg"; // Provide a fallback image path
    };

    // Navigate to activity booking page
    const handleActivityClick = (activityId) => {
        navigate(`/activitybooking/${activityId}`); // Match the route in Approutes
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-700">Loading activities...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4 mt-32 lg:mt-40">
                <h1 className="text-2xl font-bold text-center mb-6">Available Activities</h1>
                {activities.length === 0 ? (
                    <p className="text-center text-gray-700">No activities available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activities.map((activity) => (
                            <div
                                key={activity._id}
                                className="border p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleActivityClick(activity._id)}
                            >
                                <img
                                    src={`http://localhost:8000/${activity.image}`}
                                    alt={activity.name}
                                    className="w-full h-48 object-cover rounded-md"
                                    onError={handleImageError}
                                />
                                <h2 className="text-xl font-semibold mt-2">{activity.name}</h2>
                                <p className="text-gray-700 mt-2">{activity.description}</p>
                                <p className="text-green-600 font-bold mt-2">${activity.price}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default ActivitiesPage;