// src/context/CalendarContext.js
import { createContext, useContext, useState, useEffect } from "react";
import dayjs from "dayjs";

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(dayjs().startOf("month"));
  const [theme, setTheme] = useState("light"); // default to light

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.body.classList.remove("bg-dark", "text-white", "bg-light", "text-dark");
    document.body.classList.add(
      theme === "dark" ? "bg-dark" : "bg-light",
      theme === "dark" ? "text-white" : "text-dark"
    );
  }, [theme]);

  return (
    <CalendarContext.Provider value={{ currentDate, setCurrentDate, theme, toggleTheme }}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContext;
