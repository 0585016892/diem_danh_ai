const db = require("../db");

/* ================= GET ALL NOTIFICATIONS ================= */
exports.getNotifications = (req, res) => {
  const user = req.user; // từ auth middleware

  // ví dụ: admin / teacher thấy tất cả
  let sql = `
    SELECT *
    FROM notifications
    ORDER BY created_at DESC
    LIMIT 50
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ getNotifications error:", err);
      return res.status(500).json({ message: "Lỗi DB" });
    }

    res.json(rows);
  });
};

/* ================= MARK ONE AS READ ================= */
exports.markAsRead = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE notifications SET is_read = 1 WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        console.error("❌ markAsRead error:", err);
        return res.status(500).json({ message: "Lỗi DB" });
      }

      res.json({ success: true });
    }
  );
};

/* ================= MARK ALL AS READ ================= */
exports.markAllAsRead = (req, res) => {
  db.query(
    "UPDATE notifications SET is_read = 1 WHERE is_read = 0",
    (err) => {
      if (err) {
        console.error("❌ markAllAsRead error:", err);
        return res.status(500).json({ message: "Lỗi DB" });
      }

      res.json({ success: true });
    }
  );
};
