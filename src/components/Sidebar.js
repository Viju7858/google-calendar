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
  const [viewMode, setViewMode] = useState("calendar"); // calendar | month | year
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleToday = () => {
    const today = dayjs().startOf("day");
    setCurrentDate(today);
    setMiniCalMonth(today);
  };

  const startDay = miniCalMonth.startOf("month").startOf("week");
  const endDay = miniCalMonth.endOf("month").endOf("week");
  const calendarDays = [];
  let day = startDay;

  while (day.isBefore(endDay)) {
    calendarDays.push(day.clone());
    day = day.add(1, "day");
  }

  const renderMonthYearHeader = () => {
    if (viewMode === "calendar") {
      return (
        <div
          className="d-flex justify-content-between align-items-center mb-2"
          onClick={() => setViewMode("month")}
          style={{ cursor: "pointer" }}
        >
          <i
            className="bi bi-chevron-left"
            onClick={(e) => {
              e.stopPropagation();
              setMiniCalMonth(miniCalMonth.subtract(1, "month"));
            }}
          ></i>
          <span>{miniCalMonth.format("MMMM YYYY")}</span>
          <i
            className="bi bi-chevron-right"
            onClick={(e) => {
              e.stopPropagation();
              setMiniCalMonth(miniCalMonth.add(1, "month"));
            }}
          ></i>
        </div>
      );
    } else if (viewMode === "month") {
      return (
        <div
          className="text-center fw-bold mb-2"
          onClick={() => setViewMode("year")}
          style={{ cursor: "pointer" }}
        >
          {miniCalMonth.year()}
        </div>
      );
    } else if (viewMode === "year") {
      return <div className="text-center fw-bold mb-2">Select Year</div>;
    }
  };

  const renderMonthPicker = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
      <div className="d-flex flex-wrap text-center">
        {months.map((month, idx) => (
          <div
            key={month}
            className="p-2"
            style={{
              width: "33.33%",
              padding: "8px 0",
              cursor: "pointer",
              color: miniCalMonth.month() === idx ? "#1a73e8" : "#202124",
              fontWeight: miniCalMonth.month() === idx ? "bold" : "normal",
              borderRadius: "4px",
              backgroundColor: miniCalMonth.month() === idx ? "#e8f0fe" : "transparent",
            }}
            onClick={() => {
              setMiniCalMonth(miniCalMonth.month(idx));
              setViewMode("calendar");
            }}
          >
            {month}
          </div>
        ))}
      </div>
    );
  };

  const renderYearPicker = () => {
    const currentYear = dayjs().year();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
    return (
      <div className="d-flex flex-wrap text-center">
        {years.map((year) => (
          <div
            key={year}
            className="p-2"
            style={{
              width: "33.33%",
              cursor: "pointer",
              color: miniCalMonth.year() === year ? "#1a73e8" : "#202124",
              fontWeight: miniCalMonth.year() === year ? "bold" : "normal",
              borderRadius: "4px",
              backgroundColor: miniCalMonth.year() === year ? "#e8f0fe" : "transparent",
            }}
            onClick={() => {
              setMiniCalMonth(miniCalMonth.year(year));
              setViewMode("month");
            }}
          >
            {year}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050 }}>
      {/* Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}></div>

      {/* Sidebar */}
      <div
        className="bg-white text-dark border-end position-absolute top-0 start-0"
        style={{ width: "280px", height: "100vh", overflowY: "auto" }}
        ref={sidebarRef}
      >
        {/* Create Dropdown */}
        <div className="px-3 mt-3 mb-2" ref={dropdownRef}>
          <div className="dropdown w-100">
            <button
              className="btn btn-primary w-100 d-flex justify-content-between align-items-center rounded-3 px-3 py-2"
              style={{ backgroundColor: "#1a73e8", borderColor: "#1a73e8" }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span>
                <i className="bi bi-plus me-2"></i>Create
              </span>
              <i className="bi bi-caret-down-fill"></i>
            </button>

            {showDropdown && (
              <div className="dropdown-menu show shadow-sm mt-1" style={{ width: "100%", backgroundColor: "#fff", color: "#333" }}>
                <button className="dropdown-item">Event</button>
                <button className="dropdown-item">Task</button>
                <button className="dropdown-item">Appointment schedule</button>
              </div>
            )}
          </div>
        </div>

        {/* Today Button */}
        <div className="px-3 mb-3">
          <button className="btn btn-outline-secondary btn-sm w-100" onClick={handleToday}>
            Today
          </button>
        </div>

        {/* Mini Calendar */}
        <div className="px-3">
          {renderMonthYearHeader()}

          {viewMode === "calendar" && (
            <>
              <div className="d-flex justify-content-between mb-1 text-center fw-bold">
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                  <div key={d} style={{ width: "14.2%" }}>{d}</div>
                ))}
              </div>

              <div className="d-flex flex-wrap text-center">
                {calendarDays.map((d, i) => {
                  const isToday = d.isSame(dayjs(), "day");
                  const isCurrentMonth = d.month() === miniCalMonth.month();
                  const isSelected = d.isSame(currentDate, "day");
                  return (
                    <div
                      key={i}
                      className="rounded-circle mx-auto my-1"
                      style={{
                        width: "14.2%",
                        padding: "6px 0",
                        cursor: "pointer",
                        backgroundColor: isToday
                          ? "#1a73e8"
                          : isSelected
                          ? "#e8f0fe"
                          : "transparent",
                        color: isToday
                          ? "white"
                          : isSelected
                          ? "#1a73e8"
                          : isCurrentMonth
                          ? "#202124"
                          : "#dadce0",
                        fontWeight: isToday || isSelected ? "bold" : "normal",
                      }}
                      onClick={() => {
                        setCurrentDate(d);
                        if (window.innerWidth < 576) {
                          onClose();
                        }
                      }}
                    >
                      {d.date()}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {viewMode === "month" && renderMonthPicker()}
          {viewMode === "year" && renderYearPicker()}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;