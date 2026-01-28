const db = require("../db");

exports.getStats = async (req, res) => {
  /* ================= AUTH ================= */
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id: userId, role } = req.user;

  const classCondition =
    role === "teacher"
      ? "WHERE c.homeroom_teacher_id = ?"
      : "";

  const classParams = role === "teacher" ? [userId] : [];

  /* ================= QUERY HELPER ================= */
  const runQuery = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.query(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

  try {
    /* ================= COUNTS ================= */
    const classes = await runQuery(
      `SELECT COUNT(*) AS total FROM classes c ${classCondition}`,
      classParams
    );

    const students = await runQuery(
      `SELECT COUNT(*) AS total
       FROM students s
       JOIN classes c ON s.class_id = c.id
       ${classCondition}`,
      classParams
    );

    const teachers = await runQuery(
      `SELECT COUNT(*) AS total
       FROM users
       WHERE role = 'teacher'`
    );

    const attendanceToday = await runQuery(
      `SELECT COUNT(DISTINCT a.student_id) AS total
       FROM attendances a
       JOIN classes c ON a.class_id = c.id
       WHERE DATE(a.created_at) = CURDATE()
       ${role === "teacher" ? "AND c.homeroom_teacher_id = ?" : ""}`,
      classParams
    );

    /* ================= CHART 1: SĨ SỐ ================= */
    const chartStudents = await runQuery(
      `SELECT c.name AS className,
              COUNT(s.id) AS total
       FROM classes c
       LEFT JOIN students s ON s.class_id = c.id
       ${classCondition}
       GROUP BY c.id`,
      classParams
    );

    /* ================= CHART 2: ĐIỂM DANH ================= */
    const chartAttendance = await runQuery(
      `SELECT c.name AS className,
              COUNT(DISTINCT a.student_id) AS total
       FROM classes c
       LEFT JOIN attendances a
         ON a.class_id = c.id
         AND DATE(a.created_at) = CURDATE()
       ${classCondition}
       GROUP BY c.id`,
      classParams
    );

    /* ================= RESPONSE ================= */
    return res.json({
      classes: classes[0].total,
      students: students[0].total,
      teachers: role === "admin" ? teachers[0].total : undefined,
      attendanceToday: attendanceToday[0].total,
      chartStudents,
      chartAttendance,
    });
  } catch (err) {
    console.error("❌ DASHBOARD ERROR:", err);
    return res
      .status(500)
      .json({ message: "Không thể lấy dữ liệu dashboard" });
  }
};
