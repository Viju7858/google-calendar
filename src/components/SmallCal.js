// src/components/SmallCal.js
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import "../App.css";
import logo from "../assets/calendarLogo.png";
import { useCalendar } from "../context/CalendarContext";
import Sidebar from "./Sidebar";
import AllEvents from "./AllEvents"; // Import AllEvents modal

dayjs.extend(weekday);
dayjs.extend(isoWeek);

const SmallCal = () => {
  const { currentDate, setCurrentDate } = useCalendar();

  // States for mini calendar dropdown
  const [showMiniCal, setShowMiniCal] = useState(false);
  const [miniCalMonth, setMiniCalMonth] = useState(currentDate);
  const [miniCalView, setMiniCalView] = useState("date"); // 'date' | 'month' | 'year'

  // Sidebar open state
  const [showSidebar, setShowSidebar] = useState(false);

  // All Events modal open state
  const [showAllEvents, setShowAllEvents] = useState(false);

  const miniCalRef = useRef(null);

  // Handlers for navigating calendar
  const handleToday = () => setCurrentDate(dayjs().startOf("day"));
  const handlePrev = () => setCurrentDate(currentDate.subtract(1, "month"));
  const handleNext = () => setCurrentDate(currentDate.add(1, "month"));

  // Prepare calendar days for mini calendar dropdown
  const startDay = miniCalMonth.startOf("month").startOf("week");
  const endDay = miniCalMonth.endOf("month").endOf("week");
  const calendarDays = [];
  let day = startDay;
  while (day.isBefore(endDay)) {
    calendarDays.push(day.clone());
    day = day.add(1, "day");
  }

  // Close mini calendar dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (miniCalRef.current && !miniCalRef.current.contains(event.target)) {
        setShowMiniCal(false);
        setMiniCalView("date");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative">
      {/* Header */}
      <div className="container-fluid p-2 border-bottom shadow-sm bg-white">
        <div className="row align-items-center">
          <div
            style={{ gap: "2px" }}
            className="col-12 d-flex flex-wrap align-items-center"
          >
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

            {/* All Events button opens modal */}
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowAllEvents(true)}
            >
              All Events
            </button>

            {/* Prev/Next buttons */}
            <div className="d-flex align-items-center ms-2">
              <button
                className="btn btn-light btn-sm me-1 custom-circle-btn"
                onClick={handlePrev}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="btn btn-light btn-sm me-2 custom-circle-btn"
                onClick={handleNext}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>

            {/* Current month/year display toggles mini calendar */}
            <span
              className="fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => setShowMiniCal(!showMiniCal)}
            >
              {currentDate.format("MMMM YYYY")}
            </span>
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
          {/* Mini calendar header with prev/next and view toggles */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <i
              className="bi bi-chevron-left"
              onClick={() => {
                if (miniCalView === "date")
                  setMiniCalMonth(miniCalMonth.subtract(1, "month"));
                else if (miniCalView === "month")
                  setMiniCalMonth(miniCalMonth.subtract(1, "year"));
                else if (miniCalView === "year")
                  setMiniCalMonth(miniCalMonth.subtract(12, "year"));
              }}
              style={{ cursor: "pointer" }}
            ></i>

            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (miniCalView === "date") setMiniCalView("month");
                else if (miniCalView === "month") setMiniCalView("year");
              }}
            >
              {miniCalView === "date"
                ? miniCalMonth.format("MMMM YYYY")
                : miniCalView === "month"
                ? miniCalMonth.format("YYYY")
                : `${miniCalMonth.year() - 6} - ${miniCalMonth.year() + 5}`}
            </span>

            <i
              className="bi bi-chevron-right"
              onClick={() => {
                if (miniCalView === "date")
                  setMiniCalMonth(miniCalMonth.add(1, "month"));
                else if (miniCalView === "month")
                  setMiniCalMonth(miniCalMonth.add(1, "year"));
                else if (miniCalView === "year")
                  setMiniCalMonth(miniCalMonth.add(12, "year"));
              }}
              style={{ cursor: "pointer" }}
            ></i>
          </div>

          {/* Mini calendar days view */}
          {miniCalView === "date" && (
            <>
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
                        setMiniCalView("date");
                      }}
                    >
                      {d.date()}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Mini calendar month view */}
          {miniCalView === "month" && (
            <div className="d-flex flex-wrap text-center">
              {(
                dayjs.monthsShort() || [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ]
              ).map((month, idx) => (
                <div
                  key={month}
                  className="rounded m-1 p-2"
                  style={{
                    width: "30%",
                    cursor: "pointer",
                    background:
                      idx === miniCalMonth.month() ? "#4A90E2" : "transparent",
                    color: idx === miniCalMonth.month() ? "white" : "inherit",
                  }}
                  onClick={() => {
                    setMiniCalMonth(miniCalMonth.month(idx));
                    setMiniCalView("date");
                  }}
                >
                  {month}
                </div>
              ))}
            </div>
          )}

          {/* Mini calendar year view */}
          {miniCalView === "year" && (
            <div className="d-flex flex-wrap text-center">
              {Array.from({ length: 12 }, (_, i) => {
                const year = miniCalMonth.year() - 6 + i;
                return (
                  <div
                    key={year}
                    className="rounded m-1 p-2"
                    style={{
                      width: "30%",
                      cursor: "pointer",
                      background:
                        year === miniCalMonth.year()
                          ? "#4A90E2"
                          : "transparent",
                      color: year === miniCalMonth.year() ? "white" : "inherit",
                    }}
                    onClick={() => {
                      setMiniCalMonth(miniCalMonth.year(year));
                      setMiniCalView("month");
                    }}
                  >
                    {year}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Render AllEvents modal */}
      {showAllEvents && <AllEvents onClose={() => setShowAllEvents(false)} />}
    </div>
  );
};

export default SmallCal;
