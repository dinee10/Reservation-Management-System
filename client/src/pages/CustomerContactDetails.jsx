import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerContactDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    travellingForWork: 'No',
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phone: ''
  });
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email !== formData.confirmEmail) {
      alert("Email addresses do not match!");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Booking failed');
      }
  
      const data = await response.json();
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
        Customer Details
      </h2>
      
      <form onSubmit={handleSubmit}>
      
        {/* Title, First Name, Last Name */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Title <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value="">Select</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
            </select>
          </div>
          <div style={{ flex: '2' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              First name <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ flex: '2' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Last name <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        {/* Email Address */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Email address <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Your Email"
            required
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>

        {/* Confirm Email Address */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Confirm email address <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="email"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            placeholder="Enter Your Email for confimation"
            required
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>

        {/* Phone Number */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Phone (mobile number preferred) <span style={{ color: 'red' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              name="countryCode"
              value="+94"
              disabled
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value="+94">+94</option>
            </select>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              pattern="^\d{9}$"
              placeholder="123456789"
              required
              style={{ flex: '1', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Confirm Booking
        </button>
      </form>

      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#28a745',
            color: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
          }}
        >
          Booking Confirmed!
        </div>
      )}
    </div>
  );
};

export default CustomerContactDetails;