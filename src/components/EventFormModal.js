import React, { useState, useRef, useEffect } from "react";
import "./EventFormModal.css";

const EventFormModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    guests: "",
  });

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event data:", formData);
    onClose();
  };

  return (
    <div className="event-modal-overlay">
      <div
        className="event-modal-content"
        ref={modalRef}
      >
        <div className="d-flex justify-content-end">
          <button
            className="event-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            &times;
          </button>
        </div>

        <h5 className="mb-3">Add Event</h5>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <input
            type="text"
            name="title"
            placeholder="Event title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <div className="d-flex gap-2">
            <input
              type="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="time"
              className="form-control"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="form-control"
            value={formData.location}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            name="guests"
            placeholder="Guests (emails separated by commas)"
            className="form-control"
            value={formData.guests}
            onChange={handleChange}
          />
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
