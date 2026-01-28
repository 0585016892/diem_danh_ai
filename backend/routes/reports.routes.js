const express = require("express");
const router = express.Router();

const {
  overview,
  reportByClass,
  reportByStudent,
  exportExcel,
    lateOverview,
  lateByClass,
  lateTopStudents,
} = require("../controllers/reports.controller");
router.get("/overview", overview);
router.get("/class/:classId", reportByClass);
router.get("/student/:studentId", reportByStudent);
router.get("/export/excel", exportExcel);
router.get("/late/overview", lateOverview);
router.get("/late/class/:classId", lateByClass);
router.get("/late/top", lateTopStudents);

module.exports = router;
