
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Blog from "../pages/Ishanka/AddBlog"
import BlogList from "../pages/Ishanka/BlogList" 
import TourismBlog from "../pages/Ishanka/UserBlog"
import IndividualBlog from "../pages/Ishanka/InduvidualBlog"
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

function AppRoutes() {
   const [count, setCount] = useState(0);
    return (
        <Router>
            <Routes>

             <Route path="/" element={<Navigate to="/user-blog" />} />
                
                
                <Route path="/add-blog" element={<Blog />} />
                <Route path="/blog-list" element={<BlogList />} />
                <Route path="/update-blog/:id" element={<UpdateBlogDashboard />} />
                <Route path="/user-blog" element={<TourismBlog />} />
                <Route path ="/blog/:id" element = {<IndividualBlog />} />
                   {/* Redirect to Activity List by default */}
                <Route path = "/blog" element = {<Admin/>} />
              
      
        
        {/* Activity Management Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/activities" element={<ActivityList />} />
        <Route path="/activities/create" element={<AddActivity />} />
        <Route path="/activities/update/:id" element={<UpdateActivity />} />
        <Route path="/activities/customer" element={<Activities />} />
        <Route path="/activitybooking/:activityId" element={<ActivityBook/>} />
        <Route path="/activities/customer/book" element={<ActivityBookinglist />} />
                  

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


