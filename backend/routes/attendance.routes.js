const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");

router.post("/auto", attendanceController.autoAttendance);
router.get("/today", attendanceController.getAttendanceToday);

module.exports = router;
