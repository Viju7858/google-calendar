import React, { useState } from "react";
import dayjs from "dayjs";
import { useCalendar } from "../context/CalendarContext";
import SmallCal from "./SmallCal";
import AllEvents from "./AllEvents";
import CalendarDayPanel from "./CalendarDayPanel"; // <-- Import day panel
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const Calendar = () => {
  const { currentDate, events, setEvents } = useCalendar();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAllEvents, setShowAllEvents] = useState(false);

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
  };

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="container-fluid p-0">
      <SmallCal />

      {selectedDate ? (
        <CalendarDayPanel
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      ) : (
        <>
          {/* Day names header only in month view */}
          <div className="row text-center fw-bold border-bottom week-header">
            {daysOfWeek.map((d, i) => (
              <div key={i} className="col">
                {d}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {weeks.map((week, i) => (
              <div key={i} className="row text-center flex-grow-1">
                {week.map((date, j) => {
                  if (!date)
                    return (
                      <div
                        key={j}
                        className="col border py-3"
                        style={{ minHeight: "80px" }}
                      />
                    );

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
                      onClick={() => handleDayClick(date)}
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
        </>
      )}

      {/* All Events Modal */}
      {showAllEvents && <AllEvents onClose={() => setShowAllEvents(false)} />}
    </div>
  );
};

export default Calendar;
