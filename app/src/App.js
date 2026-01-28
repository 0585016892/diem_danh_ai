import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Classes from "./pages/Classes";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Users from "./pages/Users";

import AdminLayout from "./components/Layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import * as faceapi from "face-api.js";import socket from "./socket"; // 🔥 QUAN TRỌNG
import Profile from "./pages/Profile";
import TeacherClassManager from "./pages/TeacherClassManager";
import Reports from "./pages/Reports";

function App() {
useEffect(() => {
  const loadModels = async () => {
    try {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";

      console.log("⏳ Loading SSD Mobilenet...");
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);

      console.log("⏳ Loading Face Landmark...");
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

      console.log("⏳ Loading Face Recognition...");
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

      console.log("✅ All FaceAPI models loaded");
    } catch (e) {
      console.error("❌ Error loading FaceAPI models:", e);
    }
  };

  loadModels();
}, []);


  /* ================= SOCKET FORCE LOGOUT ================= */
  useEffect(() => {
    const user =
  JSON.parse(localStorage.getItem("user")) ||
  JSON.parse(sessionStorage.getItem("user")); 
    if (!user) return;

    socket.emit("join", user.id);

    socket.on("forceLogout", ({ userId }) => {
      if (userId === user.id) {
        localStorage.clear();
        window.location.href = "/login";
      }
    });

    return () => {
      socket.off("forceLogout");
    };
  }, []);

  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<Login />} />

      {/* DASHBOARD */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* USERS */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Users />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      {/* TEACHER PROFILE */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <TeacherClassManager />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      {/* REPORTS */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Reports />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Profile />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      {/* CLASSES */}
      <Route
        path="/classes"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Classes />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* STUDENTS */}
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Students />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ATTENDANCE */}
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Attendance />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
