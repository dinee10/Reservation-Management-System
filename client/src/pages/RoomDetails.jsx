import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { MdRestaurant, MdPool, MdRoomService, MdOutdoorGrill, MdChair } from 'react-icons/md';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/rooms/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch room details');
        }
        const data = await response.json();
        setRoom(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching room details:', error);
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} style={{ color: '#FFD700' }} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" style={{ color: '#FFD700' }} />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} style={{ color: '#FFD700' }} />);
    }
    return stars;
  };

  if (loading) {
    return <div>Loading room details...</div>;
  }

  if (!room) {
    return <div>Room not found.</div>;
  }

  const beds = room.beds || 1;
  const bathrooms = room.bathrooms || 1;
  const sleeps = room.sleeps || 2;
  const rating = room.rating || 4.5;
  const feedback = room.feedback && room.feedback.length > 0 ? room.feedback : [
    {
      customerName: "Samadhi Perera",
      message: "The room was amazing! The staff provided excellent service, and the view was breathtaking. It made our trip unforgettable.",
      rating: 5,
    },
    {
      customerName: "Nilmini Ranasinghe",
      message: "A wonderful stay! The facilities were top-notch, and the staff were so welcoming. We’ll definitely be back!",
      rating: 5,
    },
    {
      customerName: "John Paul",
      message: "View was amazing! The owner couldn’t do enough for us. So kind and polite! Food was delicious. Thank you!",
      rating: 5,
    },
    {
      customerName: "Emily Roberts",
      message: "The pool area was a highlight for us! The room was spotless, and the staff were incredibly helpful.",
      rating: 4.5,
    },
  ];

  const facilities = [
    { name: "Restaurant", icon: <MdRestaurant /> },
    { name: "Swimming Pool", icon: <MdPool /> },
    { name: "Room Service", icon: <MdRoomService /> },
    { name: "Outdoor Furniture", icon: <MdChair /> },
    { name: "Barbecue Facilities", icon: <MdOutdoorGrill /> },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Room Details (Beds, Bathrooms, Sleeps) */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '15px', fontWeight: 'bold'}}>
        <p>{beds} Bed{beds !== 1 ? 's' : ''}</p>
        <p>{bathrooms} Bathroom{bathrooms !== 1 ? 's' : ''}</p>
        <p>{sleeps} Sleep{sleeps !== 1 ? 's' : ''}</p>
      </div>

      {/* Room Images */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {room.imageurl.slice(0, 3).map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${room.name} ${index + 1}`}
            style={{ width: '33%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
            onError={(e) => (e.target.src = 'https://via.placeholder.com/200')}
          />
        ))}
      </div>

      {/* Rating */}
      <div style={{ marginBottom: '30px', textAlign: 'right' }}>
        <div style={{ display: 'flex', justifyContent: 'right', gap: '5px', marginBottom: '5px' }}>
          {renderStars(rating)}
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Rating: {rating}</h3>
      </div>

      {/* Customer Feedback */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
          Customer Feedback
        </h3>
        {feedback.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777' }}>No feedback available.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            {feedback.map((review, index) => (
              <div
                key={index}
                style={{
                  flex: '1 1 300px',
                  width: '100%',
                  maxWidth: '300px',
                  padding: '15px',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
                  textAlign: 'center',
                }}
              >
                {/* Star Rating */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '10px' }}>
                  {renderStars(review.rating)}
                </div>

                {/* Reviewer Name */}
                <p style={{ fontWeight: 'bold', fontSize: '18px', margin: '0 0 10px' }}>
                  {review.customerName}
                </p>

                {/* Review Message */}
                <p style={{ color: '#555', margin: 0, fontSize: '14px' }}>
                  {review.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Facilities */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
          Facilities
        </h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '5px',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {facilities.map((facility, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '20px' }}>{facility.icon}</span>
              <span>{facility.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Free Reserve Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => navigate(`/room/${id}/book`)}
          style={{
            backgroundColor: '#28a745',
            color: '#fff',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          Free Reserve
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;