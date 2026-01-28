import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/theme.css";
import "./styles/login.css";
import { UserProvider } from "./contexts/UserContext";
import { NotificationProvider } from "./contexts/NotificationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
<NotificationProvider>
  <UserProvider>
   <ThemeProvider>
      <App />
    </ThemeProvider>
  </UserProvider>
   </NotificationProvider>
  </BrowserRouter>
);
