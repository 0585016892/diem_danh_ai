const db = require("../db");
const bcrypt = require("bcryptjs");

/* ================= GET ALL ================= */
exports.getAll = async (req, res) => {
  try {
    const { keyword, role, status } = req.query;

    let sql = `
      SELECT id, name, email, role, status
      FROM users
      WHERE 1 = 1
    `;
    const params = [];

    if (keyword) {
      sql += " AND (name LIKE ? OR email LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (role) {
      sql += " AND role = ?";
      params.push(role);
    }

    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }

    const [rows] = await db.promise().query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy users" });
  }
};

/* ================= CREATE ================= */
exports.create = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);

  await db.promise().query(
    "INSERT INTO users(name,email,password,role,status) VALUES (?,?,?,?,?)",
    [name, email, hash, role, "pending"]
  );

  res.json({ message: "Tạo user thành công" });
};

/* ================= UPDATE INFO ================= */
exports.update = async (req, res) => {
  const { name, role ,email} = req.body;
  console.log(req.body);
  
  if (!name || !role) {
    return res.status(400).json({ message: "Thiếu dữ liệu cập nhật" });
  }

  await db.promise().query(
    "UPDATE users SET name=?, role=?, email=? WHERE id=?",
    [name, role, email, req.params.id]
  );

  res.json({ message: "Cập nhật user thành công" });
};

/* ================= UPDATE STATUS ================= */
exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const userId = req.params.id;

  try {
    // 1. Update DB
    await db
      .promise()
      .query("UPDATE users SET status=? WHERE id=?", [
        status,
        userId,
      ]);

    // 2. Force logout realtime nếu bị khoá
    if (status === "inactive") {
      req.io.emit("forceLogout", {
        userId: Number(userId),
      });
    }

    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
  }
};

/* ================= DELETE ================= */
exports.remove = async (req, res) => {
  await db.promise().query("DELETE FROM users WHERE id=?", [req.params.id]);
  res.json({ message: "Xoá thành công" });
};
exports.getTeachers = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, name FROM users WHERE role = 'teacher' AND status = 'active'"
      );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy danh sách giáo viên" });
  }
};

// ================= GET PROFILE =================
exports.getProfile = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT id, name, email, role, status, created_at FROM users WHERE id = ?",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (!rows.length)
        return res.status(404).json({ message: "User không tồn tại" });

      res.json(rows[0]);
    }
  );
};

// ================= UPDATE PROFILE =================
exports.updateProfile = (req, res) => {
  console.log("gọi được r");
  
  const userId = req.user.id;
  const { name, email } = req.body;

  if (!name || !email)
    return res
      .status(400)
      .json({ message: "Thiếu dữ liệu" });

  db.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, userId],
    err => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Cập nhật thông tin thành công",
      });
    }
  );
};

// ================= CHANGE PASSWORD =================
exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return res
      .status(400)
      .json({ message: "Thiếu mật khẩu" });

  db.query(
    "SELECT password FROM users WHERE id = ?",
    [userId],
    async (err, rows) => {
      if (err) return res.status(500).json(err);
      if (!rows.length)
        return res
          .status(404)
          .json({ message: "User không tồn tại" });

      const isMatch = await bcrypt.compare(
        oldPassword,
        rows[0].password
      );

      if (!isMatch)
        return res.status(400).json({
          message: "Mật khẩu cũ không đúng",
        });

      const hashed = await bcrypt.hash(newPassword, 10);

      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashed, userId],
        err => {
          if (err)
            return res.status(500).json(err);

          res.json({
            success: true,
            message: "Đổi mật khẩu thành công",
          });
        }
      );
    }
  );
};

exports.getMyClassStudents = async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const teacherId = req.user.id;

  try {
    const students = await query(
      `
      SELECT 
        s.id,
        s.student_code,
        s.name,
        s.gender,
        s.status,
        c.name AS class_name
      FROM students s
      JOIN classes c ON s.class_id = c.id
      WHERE c.homeroom_teacher_id = ?
      ORDER BY s.name
    `,
      [teacherId]
    );

    res.json(students);
  } catch (err) {
    console.error("❌ getMyClassStudents:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= HELPER ================= */
exports.getStudentsByClass = (req, res) => {
  const { classId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Thiếu date" });
  }

  // 1️⃣ LẤY THÔNG TIN LỚP
  const classSql = `
    SELECT id, name, start_time
    FROM classes
    WHERE id = ?
  `;

  db.query(classSql, [classId], (err, classRows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (classRows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy lớp" });
    }

    const classInfo = classRows[0];

    // 2️⃣ LẤY DANH SÁCH HỌC SINH + ĐIỂM DANH THEO NGÀY
    const studentsSql = `
      SELECT
        s.id,
        s.name,
        s.student_code,
        s.gender,
        s.status,

        c.start_time,

        a.created_at AS attendanceTime,

        CASE
          WHEN a.id IS NULL THEN 'absent'
          WHEN TIME(a.created_at) <= c.start_time THEN 'on_time'
          ELSE 'late'
        END AS attendanceStatus

      FROM students s
      JOIN classes c ON c.id = s.class_id

      LEFT JOIN attendances a
        ON a.student_id = s.id
        AND a.class_id = s.class_id
        AND DATE(a.created_at) = ?

      WHERE s.class_id = ?
      ORDER BY s.name
    `;

    db.query(studentsSql, [date, classId], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      res.json({
        date,
        class: classInfo,   // ✅ KHÔNG MẤT DATA CLASS NỮA
        students: rows,
      });
    });
  });
};
