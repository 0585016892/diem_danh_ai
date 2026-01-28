const pool = require("../db");
const ExcelJS = require("exceljs");

/* ===== CRUD ===== */
exports.getAll = async (req, res) => {
  try {
    const { class_id, status, keyword } = req.query;

    let sql = `
      SELECT 
        s.id,
        s.name,
        s.student_code,
        s.gender,
        s.date_of_birth,
        s.phone,
        s.email,
        s.address,
        s.face_image,
        s.status,
        s.note,
        s.created_at,
        s.updated_at,
        c.name AS class_name
      FROM students s
      JOIN classes c ON s.class_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (class_id) {
      sql += " AND s.class_id=?";
      params.push(class_id);
    }

    if (status) {
      sql += " AND s.status=?";
      params.push(status);
    }

    if (keyword) {
      sql += " AND (s.name LIKE ? OR s.student_code LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const [rows] = await pool.promise().query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.create = async (req, res) => {
  try {
    console.log("📦 body:", req.body);
    console.log("🖼 file:", req.file);

    const data = {
      name: req.body.name,
      student_code: req.body.student_code,
      class_id: req.body.class_id,
      gender: req.body.gender || null,
      date_of_birth: req.body.date_of_birth || null,
      phone: req.body.phone || null,
      email: req.body.email || null,
      address: req.body.address || null,
      note: req.body.note || null,
      status: req.body.status || "active",
      face_image: req.file ? req.file.filename : null,
      face_encoding: req.body.face_encoding || null,
    };

    await pool.promise().query("INSERT INTO students SET ?", data);

    res.json({ message: "OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi" });
  }
};
/* =========================
   IMPORT STUDENTS FROM EXCEL
========================= */
exports.importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Chưa upload file Excel" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const sheet = workbook.worksheets[0];
    const rows = [];

    sheet.eachRow((row, index) => {
      if (index === 1) return; // bỏ header

      const [
        name,
        student_code,
        class_id,
        gender,
        date_of_birth,
        phone,
        email,
        address,
        note,
        status,
      ] = row.values.slice(1);

      if (!name || !student_code || !class_id) return;

      rows.push([
        name,
        student_code,
        class_id,
        gender || null,
        date_of_birth || null,
        phone || null,
        email || null,
        address || null,
        note || null,
        status || "active",
        null, // face_image
        null, // face_encoding
      ]);
    });

    if (!rows.length) {
      return res.status(400).json({ message: "File không có dữ liệu hợp lệ" });
    }

    const sql = `
      INSERT INTO students
      (name, student_code, class_id, gender, date_of_birth, phone, email, address, note, status, face_image, face_encoding)
      VALUES ?
    `;

    await pool.promise().query(sql, [rows]);

    res.json({
      message: "Import Excel thành công",
      total: rows.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Import Excel lỗi" });
  }
};




exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const data = {
      name: req.body.name,
      student_code: req.body.student_code,
      class_id: req.body.class_id,
      gender: req.body.gender || null,
      date_of_birth: req.body.date_of_birth || null,
      phone: req.body.phone || null,
      email: req.body.email || null,
      address: req.body.address || null,
      note: req.body.note || null,
      status: req.body.status || "active",
    };
console.log(req.body);

    // Nếu có upload ảnh mới
    if (req.file) {
      data.face_image = req.file.filename;
    }

    await pool.promise().query(
      "UPDATE students SET ? WHERE id = ?",
      [data, id]
    );

    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Mã học sinh đã tồn tại",
      });
    }
    console.error(err);
    res.status(500).json({ message: "Lỗi cập nhật học sinh" });
  }
};



exports.remove = async (req, res) => {
  await pool.promise().query(
    "DELETE FROM students WHERE id=?",
    [req.params.id]
  );
  res.json({ message: "Deleted" });
};


/* ===== Upload face ===== */
exports.uploadFace = async (req, res) => {
  await pool.promise().query(
    `
    UPDATE students 
    SET face_image=?, face_encoding=? 
    WHERE id=?
    `,
    [
      req.file.filename,
      JSON.stringify(req.body.face_encoding),
      req.params.id,
    ]
  );

  res.json({ message: "Face registered" });
};

/* ===== Toggle status ===== */
exports.updateStatus = async (req, res) => {
  await pool.promise().query(
    "UPDATE students SET status=? WHERE id=?",
    [req.body.status, req.params.id]
  );

  req.io.emit("student-status-changed", {
    studentId: req.params.id,
    status: req.body.status,
  });

  res.json({ message: "Status updated" });
};
