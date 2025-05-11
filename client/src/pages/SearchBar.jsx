import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';

const SearchBar = ({ onSearch }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [district, setDistrict] = useState(null);

  // Get today's date without time for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Districts for Sri Lanka
  const districts = [
    { value: "Ampara", label: "Ampara" },
    { value: "Anuradhapura", label: "Anuradhapura" },
    { value: "Badulla", label: "Badulla" },
    { value: "Batticaloa", label: "Batticaloa" },
    { value: "Colombo", label: "Colombo" },
    { value: "Galle", label: "Galle" },
    { value: "Gampaha", label: "Gampaha" },
    { value: "Hambantota", label: "Hambantota" },
    { value: "Jaffna", label: "Jaffna" },
    { value: "Kalutara", label: "Kalutara" },
    { value: "Kandy", label: "Kandy" },
    { value: "Kegalle", label: "Kegalle" },
    { value: "Kilinochchi", label: "Kilinochchi" },
    { value: "Kurunegala", label: "Kurunegala" },
    { value: "Mannar", label: "Mannar" },
    { value: "Matale", label: "Matale" },
    { value: "Matara", label: "Matara" },
    { value: "Monaragala", label: "Monaragala" },
    { value: "Mullaitivu", label: "Mullaitivu" },
    { value: "Negombo", label: "Negombo" },
    { value: "Nuwara Eliya", label: "Nuwara Eliya" },
    { value: "Polonnaruwa", label: "Polonnaruwa" },
    { value: "Puttalam", label: "Puttalam" },
    { value: "Ratnapura", label: "Ratnapura" },
    { value: "Trincomalee", label: "Trincomalee" },
    { value: "Vavuniya", label: "Vavuniya" }
  ];

  // Handle search button click
  const handleSearch = () => {
    const filters = {
      checkInDate,
      checkOutDate,
      guests: guestCount,
      district: district ? district.value : null,
    };
    onSearch(filters);
  };

  return (
    <div className="search-bar">
      {/* District Select */}
      <div className="search-field">
        <Select 
          options={districts} 
          placeholder="Select District"
          value={district}
          onChange={setDistrict}
        />
      </div>

      {/* Date Picker */}
      <div className="date-picker">
        <div className="date-field">
          <label>Check-in</label>
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            selectsStart
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={today} // Restrict past dates
            placeholderText="Select date"
            dateFormat="MMMM d, yyyy"
          />
        </div>

        <div className="date-field">
          <label>Check-out</label>
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            selectsEnd
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={checkInDate || today} // Ensure checkout is not before check-in or today
            placeholderText="Select date"
            dateFormat="MMMM d, yyyy"
          />
        </div>
      </div>

      {/* Guest Selection */}
      <div className="guest-room-selection">
        <div className="guests">
          <Select
            options={[
              { value: 1, label: '1 Guest' },
              { value: 2, label: '2 Guests' },
              { value: 3, label: '3 Guests' },
              { value: 4, label: '4 Guests' },
            ]}
            value={{ value: guestCount, label: `${guestCount} Guest${guestCount > 1 ? 's' : ''}` }}
            onChange={(selectedOption) => setGuestCount(selectedOption.value)}
            placeholder="Select Guests"
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="search-button">
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default SearchBar;