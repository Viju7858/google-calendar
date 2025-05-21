import "../App.css";
import logo from "../assets/calendarLogo.png";
import { useCalendar } from "../context/CalendarContext";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";

dayjs.extend(weekday);
dayjs.extend(isoWeek);

const SmallCal = () => {
  const { currentDate, setCurrentDate } = useCalendar();
  const [showMiniCal, setShowMiniCal] = useState(false);
  const [miniCalMonth, setMiniCalMonth] = useState(currentDate);
  const [showSidebar, setShowSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const miniCalRef = useRef(null);

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
      if (miniCalRef.current && !miniCalRef.current.contains(event.target)) {
        setShowMiniCal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <div className="position-relative">
      {/* Header */}
      <div className="container-fluid p-2 border-bottom shadow-sm bg-white">
        <div className="row align-items-center">
          <div className="col-12 d-flex flex-wrap align-items-center gap-2">
            <i
              className="bi bi-list"
              style={{ fontSize: "1.2rem", cursor: "pointer" }}
              onClick={() => setShowSidebar(true)}
            ></i>
            <img src={logo} alt="Calendar Logo" style={{ height: "24px" }} />
            <span className="fw-bold">calendar</span>

            <button
              className="btn btn-outline-secondary btn-sm ms-2"
              onClick={handleToday}
            >
              Today
            </button>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                console.log("All Events clicked");
                // You can trigger a modal or navigation here
              }}
            >
              All Events
            </button>

            <div className="d-flex align-items-center ms-2">
              <button
                className="btn btn-light btn-sm me-1 rounded-circle p-1"
                onClick={handlePrev}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="btn btn-light btn-sm me-2 rounded-circle p-1"
                onClick={handleNext}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            <span
              className="fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => setShowMiniCal(!showMiniCal)}
            >
              {currentDate.format("MMMM YYYY")}
            </span>

            {/* Dark/Light Mode Toggle */}
            <button
              className="btn btn-outline-secondary btn-sm ms-auto"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && <Sidebar onClose={() => setShowSidebar(false)} />}

      {/* Mini Calendar Dropdown */}
      {showMiniCal && (
        <div
          ref={miniCalRef}
          className="position-absolute bg-dark text-white rounded p-3 shadow"
          style={{
            top: "60px",
            left: window.innerWidth < 576 ? "10px" : "250px",
            width: window.innerWidth < 576 ? "90%" : "300px",
            zIndex: 10,
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <i
              className="bi bi-chevron-left"
              onClick={() => setMiniCalMonth(miniCalMonth.subtract(1, "month"))}
              style={{ cursor: "pointer" }}
            ></i>
            <span>{miniCalMonth.format("MMMM YYYY")}</span>
            <i
              className="bi bi-chevron-right"
              onClick={() => setMiniCalMonth(miniCalMonth.add(1, "month"))}
              style={{ cursor: "pointer" }}
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
                    padding: window.innerWidth < 576 ? "2px 0" : "4px 0",
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
                    setShowMiniCal(false);
                  }}
                >
                  {d.date()}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmallCal;
