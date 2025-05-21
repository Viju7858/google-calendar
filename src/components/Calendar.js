import React, { useState } from "react";
import dayjs from "dayjs";
import { useCalendar } from "../context/CalendarContext";
import SmallCal from "./SmallCal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const Calendar = () => {
  const { currentDate } = useCalendar();
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventInput, setEventInput] = useState({
    title: "",
    time: "",
    description: "",
    location: "",
    color: "#0d6efd",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const today = dayjs();
  const year = currentDate.year();
  const month = currentDate.month() + 1;
  const startOfMonth = currentDate;
  const daysInMonth = startOfMonth.daysInMonth();
  const startDay = startOfMonth.startOf("month").day();
  const weeks = [];

  let day = 1 - startDay;
  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      week.push(day > 0 && day <= daysInMonth ? day : null);
      day++;
    }
    weeks.push(week);
  }

  const handleDayClick = (day) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    const existing = events[dateStr];

    if (existing) {
      setEventInput(existing);
      setIsEditing(true);
    } else {
      setEventInput({
        title: "",
        time: "",
        description: "",
        location: "",
        color: "#0d6efd",
      });
      setIsEditing(false);
    }

    setShowModal(true);
  };

  const saveEvent = () => {
    if (!eventInput.title.trim()) {
      alert("Title is required.");
      return;
    }
    setEvents((prev) => ({
      ...prev,
      [selectedDate]: eventInput,
    }));
    setShowModal(false);
  };

  const deleteEvent = () => {
    setEvents((prev) => {
      const updated = { ...prev };
      delete updated[selectedDate];
      return updated;
    });
    setShowConfirmDelete(false);
    setShowModal(false);
  };

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="container-fluid p-0">
      <SmallCal />

      <div className="row text-center fw-bold border-bottom week-header">
        {daysOfWeek.map((d) => (
          <div key={d} className="col">
            {d}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {weeks.map((week, i) => (
          <div key={i} className="row text-center flex-grow-1">
            {week.map((date, j) => {
              const dateStr = `${year}-${String(month).padStart(
                2,
                "0"
              )}-${String(date).padStart(2, "0")}`;
              const event = events[dateStr];
              const isToday =
                date === today.date() &&
                month === today.month() + 1 &&
                year === today.year();

              return (
                <div
                  key={j}
                  className="col border py-3 position-relative"
                  style={{
                    minHeight: "80px",
                    cursor: "pointer",
                    backgroundColor: isToday ? "#d1ecf1" : "white",
                  }}
                  onClick={() => date && handleDayClick(date)}
                >
                  <div className="fw-semibold">{date}</div>
                  {event && (
                    <div
                      className="position-absolute bottom-0 start-0 end-0 text-white px-1"
                      style={{
                        backgroundColor: event.color,
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        width: "100%",
                      }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Event Modal */}
      {showModal && (
        <div
          className="modal d-block calendar-modal"
          tabIndex="-1"
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing
                    ? `Edit Event - ${selectedDate}`
                    : `Add Event - ${selectedDate}`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Title"
                  value={eventInput.title}
                  onChange={(e) =>
                    setEventInput({ ...eventInput, title: e.target.value })
                  }
                />
                <input
                  type="time"
                  className="form-control mb-2"
                  value={eventInput.time}
                  onChange={(e) =>
                    setEventInput({ ...eventInput, time: e.target.value })
                  }
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={eventInput.description}
                  onChange={(e) =>
                    setEventInput({
                      ...eventInput,
                      description: e.target.value,
                    })
                  }
                ></textarea>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Location"
                  value={eventInput.location}
                  onChange={(e) =>
                    setEventInput({ ...eventInput, location: e.target.value })
                  }
                />
                <input
                  type="color"
                  className="form-control form-control-color"
                  value={eventInput.color}
                  onChange={(e) =>
                    setEventInput({ ...eventInput, color: e.target.value })
                  }
                  title="Choose your color"
                />
              </div>
              <div className="modal-footer">
                {isEditing && (
                  <button
                    className="btn btn-danger me-auto"
                    onClick={() => setShowConfirmDelete(true)}
                  >
                    Delete
                  </button>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={saveEvent}>
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div
          className="modal d-block calendar-modal"
          tabIndex="-1"
          onClick={() => setShowConfirmDelete(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmDelete(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete this event on{" "}
                  <strong>{selectedDate}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  No
                </button>
                <button className="btn btn-danger" onClick={deleteEvent}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
