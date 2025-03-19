import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddActivity from './pages/Activity/AddActivity';
import ActivityList from './pages/Activity/ActivityList';
import UpdateActivity from './pages/Activity/UpdateActivity';
import Activities from './pages/Activity/Activities';
import ActivityBook from './pages/ActivityBook/ActivityBook';
import ActivityBookinglist from './pages/ActivityBook/ActivityBooklist';

function App() {
  const [count, setCount] = useState(0)
  return (
    <BrowserRouter>
     
      <Routes>
        {/* Redirect to Activity List by default */}
        <Route path="/" element={<Navigate to="/activities" />} />
        
        {/* Activity Management Routes */}
        <Route path="/activities" element={<ActivityList />} />
        <Route path="/activities/create" element={<AddActivity />} />
        <Route path="/activities/update/:id" element={<UpdateActivity />} />
        <Route path="/activities/customer" element={<Activities />} />
        <Route path="/activitybooking/:activityId" element={<ActivityBook/>} />
        <Route path="/activities/customer/book" element={<ActivityBookinglist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

