const db = require("../db");
const { getIO } = require("../socket");

exports.createNotification = ({ student_id, class_id, type, title, content }) => {
  if (!type) return;

  const sql = `
    INSERT INTO notifications (student_id, class_id, type, title, content)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [student_id, class_id, type, title, content],
    (err, result) => {
      if (err) {
        console.error("❌ Notification error:", err);
        return;
      }

      const io = getIO();
      io.emit("notification:new", {
        id: result.insertId,
        student_id,
        class_id,
        type,
        title,
        content,
        is_read: 0,
        created_at: new Date(),
      });
    }
  );
};
