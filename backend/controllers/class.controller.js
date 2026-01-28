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

  await pool.query(
    `INSERT INTO classes
     (name, grade, school_year, homeroom_teacher_id, room, max_students, description)
     VALUES (?,?,?,?,?,?,?)`,
    [
      name,
      grade,
      school_year,
      homeroom_teacher_id,
      room,
      max_students,
      description,
    ]
  );

  res.json({ message: "Created" });
};


/* ================= UPDATE ================= */
exports.update = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    `UPDATE classes SET ? WHERE id=?`,
    [req.body, id]
  );

  res.json({ message: "Updated" });
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
