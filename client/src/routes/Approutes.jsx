// src/App.jsx
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from "axios";
import RoomsPage from '../pages/Roomspage';
import RoomDetails from '../pages/RoomDetails';
import AddRoom from '../pages/AddRoom';
import UpdateRoom from '../pages/UpdateRoom';
import RoomList from '../pages/RoomList';
import CustomerContactDetails from '../pages/CustomerContactDetails';
import CustomerBookingList from '../pages/CustomerList';
import '../App.css';

function App() {
  const [rooms , setrooms] = useState([])
  
  return (
    <div className="mt-20 p-4">
      <BrowserRouter>
        <Navbar /> {/* Move Navbar inside BrowserRouter */}
        <Routes>
  <Route path="/" element={<RoomsPage />} />
  <Route path="/rooms" element={<RoomsPage />} />
  <Route path="/room/:id" element={<RoomDetails />} />
  <Route path="/room/:id/book" element={<CustomerContactDetails />} />
  <Route path="/rooms/create" element={<AddRoom />} />
  <Route path="/rooms/update/:id" element={<UpdateRoom />} />
  <Route path="/rooms/list" element={<RoomList />} />
  <Route path="/customer/list" element={<CustomerBookingList/>} />
</Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;