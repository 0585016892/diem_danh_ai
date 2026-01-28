import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getDefaultTheme = () => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6; // dark từ 18h → 6h
  };

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : getDefaultTheme();
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
    document.body.setAttribute(
      "data-role",
      user.role === "admin" ? "admin" : "staff"
    );
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode, user.role]);

  return (
    <ThemeContext.Provider
      value={{ darkMode, toggleTheme: () => setDarkMode(!darkMode) }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
