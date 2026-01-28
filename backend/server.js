require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const socket = require("./socket");

const app = express();
app.use(cors());
app.use(express.json());
// ⭐ DÒNG QUAN TRỌNG
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
/* ================= SERVER ================= */
const server = http.createServer(app);

/* ================= SOCKET INIT ================= */
const io = socket.init(server);

/* 🔥🔥🔥 PHẢI ĐẶT Ở ĐÂY – TRƯỚC ROUTES */
app.use((req, res, next) => {
  req.io = io;
    next();
  });

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/classes", require("./routes/class.routes"));
app.use("/api/students", require("./routes/student.routes"));
app.use("/api/attendances", require("./routes/attendance.routes"));
app.use("/api/dashboard", require("./routes/dashboard.route"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/reports", require("./routes/reports.routes"));

/* ================= START SERVER ================= */

let SYSTEM_CAMERA_ON = false;

// app.post("/api/system/camera", (req, res) => {
//   const { enabled } = req.body;
//   SYSTEM_CAMERA_ON = enabled;

//   io.emit(
//     enabled ? "system:camera:on" : "system:camera:off"
//   );

//   res.json({ success: true, enabled });
// });

// io.on("connection", socket => {
//   console.log("Camera system client connected:");

//   // Gửi trạng thái hiện tại khi client mới vào
//   socket.emit(
//     SYSTEM_CAMERA_ON
//       ? "system:camera:on"
//       : "system:camera:off"
//   );
// });

server.listen(process.env.PORT, () =>
  console.log("🚀 Server + Socket chạy port", process.env.PORT)
);
