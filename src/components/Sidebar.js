import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import { useCalendar } from "../context/CalendarContext";
import "../App.css";

dayjs.extend(weekday);
dayjs.extend(isoWeek);

const Sidebar = ({ onClose }) => {
  const { currentDate, setCurrentDate } = useCalendar();
  const [miniCalMonth, setMiniCalMonth] = useState(currentDate);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleToday = () => setCurrentDate(dayjs().startOf("day"));
  const handlePrev = () => setCurrentDate(currentDate.subtract(1, "month"));
  const handleNext = () => setCurrentDate(currentDate.add(1, "month"));

  const startDay = miniCalMonth.startOf("month").startOf("week");
  const endDay = miniCalMonth.endOf("month").endOf("week");
  const calendarDays = [];
  let day = startDay;

  while (day.isBefore(endDay)) {
    calendarDays.push(day.clone());
    day = day.add(1, "day");
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="position-fixed top-0 start-0 bg-dark text-white shadow"
      style={{
        width: "250px",
        height: "100vh",
        zIndex: 1050,
        transition: "transform 0.3s ease-in-out",
        overflowY: "auto",
      }}
    >
      {/* Close button */}
      <div className="d-flex justify-content-end p-2">
        <button className="btn btn-outline-light btn-sm" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      {/* Create Dropdown */}
      <div className="px-3 mb-3" ref={dropdownRef}>
        <div className="dropdown w-100">
          <button
            className="btn btn-dark w-100 d-flex justify-content-between align-items-center border rounded-3 px-3 py-2"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span>
              <i className="bi bi-plus me-2"></i>Create
            </span>
            <i className="bi bi-caret-down-fill"></i>
          </button>

          {showDropdown && (
            <div
              className="dropdown-menu show bg-dark border-0 mt-1"
              style={{ display: "block", width: "100%" }}
            >
              <button className="dropdown-item text-white" style={{ backgroundColor: "transparent" }}>
                Event
              </button>
              <button className="dropdown-item text-white" style={{ backgroundColor: "transparent" }}>
                Task
              </button>
              <button className="dropdown-item text-white" style={{ backgroundColor: "transparent" }}>
                Appointment schedule
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="px-3 d-flex justify-content-between mb-3">
        <button className="btn btn-outline-light btn-sm" onClick={handleToday}>
          Today
        </button>
        <div>
          <button className="btn btn-light btn-sm me-1" onClick={handlePrev}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="btn btn-light btn-sm" onClick={handleNext}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Mini Calendar */}
      <div className="px-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <i
            className="bi bi-chevron-left"
            style={{ cursor: "pointer" }}
            onClick={() => setMiniCalMonth(miniCalMonth.subtract(1, "month"))}
          ></i>
          <span>{miniCalMonth.format("MMMM YYYY")}</span>
          <i
            className="bi bi-chevron-right"
            style={{ cursor: "pointer" }}
            onClick={() => setMiniCalMonth(miniCalMonth.add(1, "month"))}
          ></i>
        </div>

        <div className="d-flex justify-content-between mb-1 text-center fw-bold">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <div key={d} style={{ width: "14.2%" }}>
              {d}
            </div>
          ))}
        </div>

        <div className="d-flex flex-wrap text-center">
          {calendarDays.map((d, i) => {
            const isToday = d.isSame(dayjs(), "day");
            const isCurrentMonth = d.month() === miniCalMonth.month();
            return (
              <div
                key={i}
                className="rounded"
                style={{
                  width: "14.2%",
                  padding: "4px 0",
                  cursor: "pointer",
                  background: isToday ? "#4A90E2" : "transparent",
                  color: isToday
                    ? "white"
                    : isCurrentMonth
                    ? "inherit"
                    : "#bbb",
                }}
                onClick={() => {
                  setCurrentDate(d);
                  if (window.innerWidth < 576) {
                    onClose(); // Auto close on mobile
                  }
                }}
              >
                {d.date()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
