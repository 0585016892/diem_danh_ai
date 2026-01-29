const db = require("../db");
const pool = db.promise();
/* ================= GET ALL ================= */
exports.getAll = async (req, res) => {
  const { keyword, status } = req.query;

  let sql = `
    SELECT c.*, u.name AS teacher_name
    FROM classes c
    LEFT JOIN users u ON c.homeroom_teacher_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (keyword) {
    sql += " AND c.name LIKE ?";
    params.push(`%${keyword}%`);
  }

  if (status) {
    sql += " AND c.status = ?";
    params.push(status);
  }

  const [rows] = await pool.query(sql, params);
  res.json(rows);
};


/* ================= CREATE ================= */
exports.create = async (req, res) => {
  const {
    name,
    grade,
    school_year,
    homeroom_teacher_id,
    room,
    max_students,
    description,
  } = req.body;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1️⃣ Thêm lớp
    const [result] = await conn.query(
      `INSERT INTO classes
       (name, grade, school_year, homeroom_teacher_id, room, max_students, description)
       VALUES (?,?,?,?,?,?,?)`,
      [
        name,
        grade,
        school_year,
        homeroom_teacher_id || null,
        room,
        max_students,
        description,
      ]
    );

    const classId = result.insertId;

    // 2️⃣ Nếu có giáo viên chủ nhiệm → update user.class_id
    if (homeroom_teacher_id) {
      await conn.query(
        `UPDATE users
         SET class_id = ?
         WHERE id = ? AND role = 'teacher'`,
        [classId, homeroom_teacher_id]
      );
    }

    await conn.commit();

    res.json({
      message: "Created",
      class_id: classId,
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Create class failed" });
  } finally {
    conn.release();
  }
};



/* ================= UPDATE ================= */
exports.update = async (req, res) => {
  const { id } = req.params;
  const { homeroom_teacher_id, ...classData } = req.body;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // lấy giáo viên cũ
    const [[oldClass]] = await conn.query(
      `SELECT homeroom_teacher_id FROM classes WHERE id = ?`,
      [id]
    );

    const oldTeacherId = oldClass?.homeroom_teacher_id;

    // 🚫 chặn GV trùng lớp
    if (homeroom_teacher_id) {
      const [exists] = await conn.query(
        `SELECT id FROM users
         WHERE id = ?
           AND role = 'teacher'
           AND class_id IS NOT NULL
           AND class_id != ?`,
        [homeroom_teacher_id, id]
      );

      if (exists.length > 0) {
        throw new Error("Giáo viên này đã chủ nhiệm lớp khác");
      }
    }

    // update lớp
    await conn.query(
      `UPDATE classes
       SET ?, homeroom_teacher_id = ?
       WHERE id = ?`,
      [classData, homeroom_teacher_id || null, id]
    );

    // clear GV cũ
    if (oldTeacherId && oldTeacherId !== homeroom_teacher_id) {
      await conn.query(
        `UPDATE users SET class_id = NULL WHERE id = ?`,
        [oldTeacherId]
      );
    }

    // set GV mới
    if (homeroom_teacher_id) {
      await conn.query(
        `UPDATE users SET class_id = ? WHERE id = ?`,
        [id, homeroom_teacher_id]
      );
    }

    await conn.commit();
    res.json({ message: "Updated" });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ message: err.message });
  } finally {
    conn.release();
  }
};



/* ================= STATUS ================= */
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  await pool.query(
    "UPDATE classes SET status=? WHERE id=?",
    [status, id]
  );

  res.json({ message: "Status updated" });
};

/* ================= DELETE ================= */
exports.remove = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM classes WHERE id = ?", [id]);
  res.json({ message: "Deleted" });
};
