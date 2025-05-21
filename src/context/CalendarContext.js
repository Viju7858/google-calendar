// src/context/CalendarContext.js
import { createContext, useContext, useState } from "react";
import dayjs from "dayjs";

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(dayjs().startOf("month"));

  return (
    <CalendarContext.Provider value={{ currentDate, setCurrentDate }}>
      {children}
    </CalendarContext.Provider>
  );
};
export default CalendarContext;