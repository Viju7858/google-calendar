// src/components/AllEvents.js
import React from "react";
import { useCalendar } from "../context/CalendarContext";

const AllEvents = ({ onClose }) => {
  const { events } = useCalendar(); // ✅ use context instead of props

  const sortedEntries = Object.entries(events).sort(
    ([a], [b]) => new Date(a) - new Date(b)
  );

  return (
    <div className="modal d-block calendar-modal" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: "400px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">All Events</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {sortedEntries.length === 0 ? (
              <p className="text-muted">No events available.</p>
            ) : (
              <ul className="list-group">
                {sortedEntries.map(([date, event], index) => (
                  <li key={index} className="list-group-item">
                    <div className="fw-bold">
                      {date} -{" "}
                      <span style={{ color: event.color }}>{event.title}</span>
                    </div>
                    <div>
                      <strong>Time:</strong> {event.time || "N/A"}
                      <br />
                      <strong>Location:</strong> {event.location || "N/A"}
                      <br />
                      <strong>Description:</strong> {event.description || "N/A"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllEvents;
