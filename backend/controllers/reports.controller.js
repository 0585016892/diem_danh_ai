const db = require("../db");
const ExcelJS = require("exceljs");

/* =========================
   1️⃣ DASHBOARD OVERVIEW
========================= */
const overview = (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total,
      SUM(status='present') AS present,
      SUM(status='late') AS late,
      SUM(status='absent') AS absent
    FROM attendances
    WHERE DATE(created_at) = CURDATE()
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Overview error:", err);
      return res.status(500).json({ message: "Overview error" });
    }

    res.json(rows[0]);
  });
};

/* =========================
   2️⃣ REPORT BY CLASS
========================= */
const reportByClass = (req, res) => {
  const { classId } = req.params;
  const { from, to } = req.query;

  const sql = `
    SELECT
      s.id,
      s.name,
      SUM(a.status='present') AS present,
      SUM(a.status='late') AS late,
      SUM(a.status='absent') AS absent
    FROM students s
    LEFT JOIN attendances a
      ON s.id = a.student_id
      AND a.class_id = ?
      AND DATE(a.created_at) BETWEEN ? AND ?
    GROUP BY s.id
  `;

  db.query(sql, [classId, from, to], (err, rows) => {
    if (err) {
      console.error("❌ Class report error:", err);
      return res.status(500).json({ message: "Class report error" });
    }

    res.json(rows);
  });
};

/* =========================
   3️⃣ REPORT BY STUDENT
========================= */
const reportByStudent = (req, res) => {
  const { studentId } = req.params;

  const sql = `
    SELECT
      COUNT(*) AS total,
      SUM(status='present') AS present,
      SUM(status='late') AS late,
      SUM(status='absent') AS absent
    FROM attendances
    WHERE student_id = ?
  `;

  db.query(sql, [studentId], (err, rows) => {
    if (err) {
      console.error("❌ Student report error:", err);
      return res.status(500).json({ message: "Student report error" });
    }

    res.json(rows[0]);
  });
};

/* =========================
   4️⃣ EXPORT EXCEL
========================= */
const exportExcel = (req, res) => {
  const { classId, from, to } = req.query;

  const sql = `
    SELECT
      s.name AS student,
      a.status,
      DATE(a.created_at) AS date
    FROM attendances a
    JOIN students s ON s.id = a.student_id
    WHERE a.class_id = ?
      AND DATE(a.created_at) BETWEEN ? AND ?
    ORDER BY date
  `;

  db.query(sql, [classId, from, to], async (err, rows) => {
    if (err) {
      console.error("❌ Export Excel error:", err);
      return res.status(500).json({ message: "Export Excel error" });
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Attendance Report");

    ws.columns = [
      { header: "Sinh viên", key: "student", width: 25 },
      { header: "Trạng thái", key: "status", width: 15 },
      { header: "Ngày", key: "date", width: 15 },
    ];

    rows.forEach(r => ws.addRow(r));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=attendance_report.xlsx"
    );

    await wb.xlsx.write(res);
    res.end();
  });
};
const lateOverview = (req, res) => {
  const { from, to } = req.query;

  const sql = `
    SELECT 
      COUNT(*) AS total_late
    FROM attendances
    WHERE status = 'late'
    ${from && to ? "AND date BETWEEN ? AND ?" : ""}
  `;

  const params = from && to ? [from, to] : [];

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi báo cáo đi muộn" });
    }
    res.json(rows[0]);
  });
};

const lateByClass = (req, res) => {
  const { classId } = req.params;
  const { from, to } = req.query;

  const sql = `
    SELECT 
      s.id,
      s.name,
      s.student_code,
      COUNT(a.id) AS late_count
    FROM students s
    JOIN attendances a ON a.student_id = s.id
    WHERE a.class_id = ?
      AND a.status = 'late'
      ${from && to ? "AND a.date BETWEEN ? AND ?" : ""}
    GROUP BY s.id
    ORDER BY late_count DESC
  `;

  const params = from && to ? [classId, from, to] : [classId];

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi báo cáo lớp đi muộn" });
    }
    res.json(rows);
  });
};
const lateTopStudents = (req, res) => {
  const { limit = 10 } = req.query;

  const sql = `
    SELECT 
      s.id,
      s.name,
      s.student_code,
      c.name AS class_name,
      COUNT(a.id) AS late_count
    FROM attendances a
    JOIN students s ON s.id = a.student_id
    JOIN classes c ON c.id = a.class_id
    WHERE a.status = 'late'
    GROUP BY s.id
    ORDER BY late_count DESC
    LIMIT ?
  `;

  db.query(sql, [Number(limit)], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi top đi muộn" });
    }
    res.json(rows);
  });
};
/* =========================
   EXPORT
========================= */
module.exports = {
  overview,
  reportByClass,
  reportByStudent,
  exportExcel,
  lateOverview,
  lateByClass,
  lateTopStudents
};
