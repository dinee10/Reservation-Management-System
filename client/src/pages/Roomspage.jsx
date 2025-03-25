import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([5000, 15000]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/rooms');
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const data = await response.json();
        setRooms(data);
        setFilteredRooms(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSearch = (filters) => {
    const { checkInDate, checkOutDate, guests, district } = filters;

    const filtered = rooms.filter((room) => {
      const priceInRange = room.rentperday >= priceRange[0] && room.rentperday <= priceRange[1];
      const matchesGuestCount = room.maxCount >= guests;
      const matchesDistrict = district ? room.location.toLowerCase() === district.toLowerCase() : true;

      let isAvailable = true;
      if (checkInDate && checkOutDate) {
        isAvailable = room.currentbookings.every((booking) => {
          const bookingStart = new Date(booking.checkInDate);
          const bookingEnd = new Date(booking.checkOutDate);
          return (
            (checkOutDate < bookingStart) || (checkInDate > bookingEnd)
          );
        });
      }

      return priceInRange && matchesGuestCount && matchesDistrict && isAvailable;
    });

    setFilteredRooms(filtered);
  };

  const formatCurrency = (amount) => {
    return `LKR ${amount.toLocaleString()}`;
  };

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ 
        width: '250px', 
        padding: '30px', 
        borderRight: '2px solid #ccc',
        backgroundColor: '#f8f9fa',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        marginLeft: '-1px',
      }}>
        <h4 style={{ marginBottom: '20px', fontSize: '18px', color: '#333', fontWeight: 'bold' }}>
          Your Budget
        </h4>
        <div className="price-range-box" style={{
          padding: '5px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e0e0e0',
        }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#555', textAlign: 'center' }}>
            {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
          </p>
        </div>
        <input
          type="range"
          min="5000"
          max="100000"
          step="1000"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
          style={{ width: '100%', marginBottom: '15px', accentColor: '#007bff' }}
        />
        <input
          type="range"
          min="5000"
          max="100000"
          step="1000"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          style={{ width: '100%', accentColor: '#007bff' }}
        />
      </div>

      <div style={{ flex: 1, padding: '1px' }}>
        <h1 className="available-rooms-title" style={{ marginTop: "20px" }}>
          Available Rooms
        </h1>
        <SearchBar onSearch={handleSearch} />

        <div className="rooms-list">
          {filteredRooms.length === 0 ? (
            <p>No rooms match your criteria.</p>
          ) : (
            filteredRooms.map((room) => (
              <div key={room._id} className="room-card" style={{
                marginBottom: '20px',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              }}>
                <img src={room.imageurl[0]} alt={room.name} style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
                <h2 style={{ fontWeight: 'bold', fontSize: '24px' }}>{room.name}</h2>
                <p style={{ fontStyle: 'italic', color: '#555' }}>{room.description}</p>
                <p><strong>Location:</strong> {room.location || 'Not specified'}</p>
                <p><strong>Phone:</strong> {room.phonenumber}</p>
                <p><strong>Max Capacity:</strong> {room.maxCount} people</p>
                <p><strong>Type:</strong> {room.type}</p>
                <p><strong>Price per day:</strong> {formatCurrency(room.rentperday)}</p>
                <button
                  className="book-button"
                  onClick={() => navigate(`/room/${room._id}`)}
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '10px',
                  }}
                >
                  Book Now
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;