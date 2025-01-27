import React, { useState } from "react";
import {
  FiClock,
  FiUser,
  FiPhone,
  FiCalendar,
  FiMessageSquare,
} from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./BookTable.css";
import { toast } from "react-toastify";
// time picker
import dayjs from "dayjs";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const BookTablePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "",
    date: new Date(),
    time: "",
    specialRequests: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const restaurantImages = [
    "images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    "images.unsplash.com/photo-1414235077428-338989a2e8c0",
    "images.unsplash.com/photo-1559339352-11d035aa65de",
  ];

  const popularTimes = ["12:00", "13:00", "19:00", "20:00"];

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
  };

  const center = {
    lat: 40.7128,
    lng: -74.006,
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Valid 10-digit phone number required";
    }
    if (!formData.guests || formData.guests < 1) {
      newErrors.guests = "Number of guests required";
    }
    if (!formData.time || !/^\d{2}:\d{2}:\d{2}$/.test(formData.time)) {
      newErrors.time = "Valid time (HH:mm:ss) is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      handlePostReservation(); // Call API submission here
    }
  };

  const handlePostReservation = async () => {
    const body = {
      cus_name: formData.name,
      phone_number: formData.phone,
      guests_number: parseInt(formData.guests, 10),
      arrival_time: formData.time,
      arrival_date: formData.date.toISOString().split("T")[0], // Convert Date to YYYY-MM-DD
      notes: formData.specialRequests,
    };
    console.log(body);
    try {
      const response = await fetch("http://localhost:3000/api/reservation/1", {
        // /:branchid lúc chọn ở đầu web
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Reservation Successful:", result);

      toast.success(`Reservation submitted successfully!`, {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      console.error("Error submitting reservation:", error);
      alert("Failed to submit reservation. Please try again.");
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-grid">
        <div>
          <h2 className="booking-title">Table Reservation</h2>

          {submitted ? (
            <div className="success-message">
              <BsCheckCircle className="success-icon" />
              <p>Reservation submitted successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="booking-form">
              <div>
                <label htmlFor="name">Name</label>
                <div className="input-container">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    className={`input-field ${
                      errors.name ? "error-border" : ""
                    }`}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    aria-label="Full name"
                  />
                </div>
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="phone">Phone Number</label>
                <div className="input-container">
                  <FiPhone className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    className={`input-field ${
                      errors.phone ? "error-border" : ""
                    }`}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    aria-label="Phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="error-message">{errors.phone}</p>
                )}
              </div>

              <div className="input-row">
                <div>
                  <label>Date</label>
                  <div className="input-container">
                    <FiCalendar className="input-icon" />
                    <DatePicker
                      selected={formData.date}
                      onChange={(date) => setFormData({ ...formData, date })}
                      className="input-field"
                      minDate={new Date()}
                      aria-label="Select date"
                    />
                  </div>
                </div>

                <div>
                  <label>Time</label>
                  <div className="input-container">
                    {/* <FiClock className="input-icon" /> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopTimePicker
                        value={
                          formData.time
                            ? dayjs(`2000-01-01T${formData.time}`)
                            : null
                        }
                        onChange={(newValue) => {
                          // Convert the selected time to 24-hour format
                          const formattedTime =
                            dayjs(newValue).format("HH:mm:ss");
                          setFormData({ ...formData, time: formattedTime });
                        }}
                        ampm={true} // Allow AM/PM format for user interaction
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                  {errors.time && (
                    <p className="error-message">{errors.time}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="guests">Number of Guests</label>
                <div className="input-container">
                  <FiUser className="input-icon" />
                  <input
                    type="number"
                    id="guests"
                    min="1"
                    className={`input-field ${
                      errors.guests ? "error-border" : ""
                    }`}
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData({ ...formData, guests: e.target.value })
                    }
                    aria-label="Number of guests"
                  />
                </div>
                {errors.guests && (
                  <p className="error-message">{errors.guests}</p>
                )}
              </div>

              <div>
                <label htmlFor="special-requests">Special Requests</label>
                <div className="input-container">
                  <FiMessageSquare className="input-icon" />
                  <textarea
                    id="special-requests"
                    className="input-field"
                    rows="4"
                    value={formData.specialRequests}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialRequests: e.target.value,
                      })
                    }
                    aria-label="Special requests"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="submit-button"
                aria-label="Submit reservation"
              >
                Confirm Reservation
              </button>
            </form>
          )}
        </div>

        <div className="booking-sidebar">
          <div className="policies">
            <h3>Reservation Policies</h3>
            <ul>
              <li>• Reservations must be made at least 2 hours in advance</li>
              <li>
                • Cancellations must be made 1 hour before reservation time
              </li>
              <li>• Maximum group size of 10 people</li>
              <li>
                • Tables will be held for 15 minutes after reservation time
              </li>
            </ul>
          </div>

          <div className="gallery">
            {restaurantImages.map((image, index) => (
              <img
                key={index}
                src={`https://${image}`}
                alt={`Restaurant ambiance ${index + 1}`}
                className="gallery-image"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
