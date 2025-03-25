

import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Blog from "../pages/Ishanka/AddBlog"
import BlogList from "../pages/Ishanka/BlogList" 
import TourismBlog from "../pages/Ishanka/UserBlog"
import IndividualBlog from "../pages/Ishanka/InduvidualBlog";
import Admin from "../pages/dashboard/Admin";
import UpdateBlogDashboard from "../pages/dashboard/Ishanka dahsbaord/UpdateBlogDashbaord";
import AddActivity from '../pages/Activity/AddActivity';
import ActivityList from '../pages/Activity/ActivityList';
import UpdateActivity from '../pages/Activity/UpdateActivity';
import Activities from '../pages/Activity/Activities';
import ActivityBook from '../pages/ActivityBook/ActivityBook';
import ActivityBookinglist from '../pages/ActivityBook/ActivityBooklist';
import Dashboard from '../pages/Admin/Dashboard';
import Login from '../pages/Login/Login';
import RoomsPage from '../pages/Roomspage';
import RoomDetails from '../pages/RoomDetails';
import AddRoom from '../pages/AddRoom';
import UpdateRoom from '../pages/UpdateRoom';
import RoomList from '../pages/RoomList';
import CustomerContactDetails from '../pages/CustomerContactDetails';
import CustomerBookingList from '../pages/CustomerList';
import '../App.css';


function AppRoutes() {
   const [count, setCount] = useState(0);
    return (
        <Router>
            <Routes>

                
                <Route path="/add-blog" element={<Blog />} />
                <Route path="/blog-list" element={<BlogList />} />
                <Route path="/update-blog/:id" element={<UpdateBlogDashboard />} />
                <Route path="/user-blog" element={<TourismBlog />} />
                <Route path ="/blog/:id" element = {<IndividualBlog />} />
                   {/* Redirect to Activity List by default */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
      
        
        {/* Activity Management Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/activities" element={<ActivityList />} />
        <Route path="/activities/create" element={<AddActivity />} />
        <Route path="/activities/update/:id" element={<UpdateActivity />} />
        <Route path="/activities/customer" element={<Activities />} />
        <Route path="/activitybooking/:activityId" element={<ActivityBook/>} />
        <Route path="/activities/customer/book" element={<ActivityBookinglist />} />
          
  <Route path="/rooms" element={<RoomsPage />} />
  <Route path="/room/:id" element={<RoomDetails />} />
  <Route path="/room/:id/book" element={<CustomerContactDetails />} />
  <Route path="/rooms/create" element={<AddRoom />} />
  <Route path="/rooms/update/:id" element={<UpdateRoom />} />
  <Route path="/rooms/list" element={<RoomList />} />
  <Route path="/customer/list" element={<CustomerBookingList/>} />

                  

                <Route 
                    path="/dashboard" 
                    element={
                        //<ProtectedRoute adminOnly>
                            <Admin />
                        //</ProtectedRoute>
                    } 
                />

                
            </Routes>
        </Router>
    );
}

export default AppRoutes;


