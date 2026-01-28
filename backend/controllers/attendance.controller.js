const db = require("../db");
const fs = require("fs");
const path = require("path");
const { getIO } = require("../socket");
const { createNotification } = require("../services/notification.service");
const { sendMail } = require("../utils/sendMail");

/* ================= LOG ================= */
const logFile = path.join(__dirname, "../logs/attendance.log");
const writeLog = (msg) => {
  fs.appendFileSync(
    logFile,
    `[${new Date().toISOString()}] ${msg}\n`
  );
};

/* ================= EUCLIDEAN ================= */
function euclideanDistance(d1, d2) {
  let sum = 0;
  for (let i = 0; i < d1.length; i++) {
    sum += (d1[i] - d2[i]) ** 2;
  }
  return Math.sqrt(sum);
}

/* ================= MAIL TEMPLATES ================= */
const lateMailTemplate = ({
  studentName,
  className,
  time,
  lateCount,
}) => `
<div style="
  max-width:600px;
  margin:auto;
  font-family:Arial,Helvetica,sans-serif;
  background:#ffffff;
  border-radius:8px;
  overflow:hidden;
  border:1px solid #eee;
">

  <!-- HEADER -->
  <div style="
    background:#d9534f;
    color:white;
    padding:16px;
    text-align:center;
  ">
    <h2 style="margin:0">⚠️ CẢNH BÁO ĐI MUỘN</h2>
    <p style="margin:4px 0 0;font-size:14px">
      Hệ thống điểm danh tự động
    </p>
  </div>

  <!-- BODY -->
  <div style="padding:20px; color:#333; line-height:1.6">
    <p>Kính gửi <b>Quý phụ huynh</b>,</p>

    <p>
      Hệ thống ghi nhận học sinh sau đã
      <b style="color:#d9534f">đến trường muộn</b>:
    </p>

    <table style="
      width:100%;
      border-collapse:collapse;
      margin:16px 0;
      font-size:14px;
    ">
      <tr>
        <td style="padding:8px;border:1px solid #ddd;width:35%">👨‍🎓 Học sinh</td>
        <td style="padding:8px;border:1px solid #ddd"><b>${studentName}</b></td>
      </tr>
      <tr>
        <td style="padding:8px;border:1px solid #ddd">🏫 Lớp</td>
        <td style="padding:8px;border:1px solid #ddd">${className}</td>
      </tr>
      <tr>
        <td style="padding:8px;border:1px solid #ddd">⏰ Thời gian đến</td>
        <td style="padding:8px;border:1px solid #ddd"><b>${time}</b></td>
      </tr>
      <tr>
        <td style="padding:8px;border:1px solid #ddd">⚠️ Số lần đi muộn</td>
        <td style="
          padding:8px;
          border:1px solid #ddd;
          color:#d9534f;
          font-weight:bold
        ">
          ${lateCount} lần (trong tháng)
        </td>
      </tr>
    </table>

    <!-- IMAGE -->
    <div style="margin-top:16px;text-align:center">
      <p style="font-weight:bold;margin-bottom:8px">
        📷 Ảnh điểm danh
      </p>
      <img
        src="cid:attendance-image"
        style="
          max-width:100%;
          border-radius:6px;
          border:1px solid #ddd;
        "
      />
    </div>

    <p style="margin-top:24px">
      Quý phụ huynh vui lòng <b>nhắc nhở học sinh đi học đúng giờ</b>.
    </p>

    <p style="margin-top:24px">
      Trân trọng,<br/>
      <b>Nhà trường</b>
    </p>
  </div>

  <!-- FOOTER -->
  <div style="
    background:#f7f7f7;
    text-align:center;
    padding:10px;
    font-size:12px;
    color:#777;
  ">
    Email được gửi tự động – vui lòng không trả lời
  </div>
</div>
`;



const presentMailTemplate = ({ studentName, className, time }) => `
<div style="
  max-width:600px;
  margin:auto;
  font-family:Arial,Helvetica,sans-serif;
  background:#ffffff;
  border-radius:8px;
  overflow:hidden;
  border:1px solid #e5e5e5;
">

  <!-- HEADER -->
  <div style="
    background:#28a745;
    color:white;
    padding:16px;
    text-align:center;
  ">
    <h2 style="margin:0">✅ HỌC SINH ĐÃ ĐẾN TRƯỜNG</h2>
    <p style="margin:4px 0 0;font-size:14px">
      Hệ thống điểm danh tự động
    </p>
  </div>

  <!-- BODY -->
  <div style="padding:20px; color:#333; line-height:1.6">
    <p>Kính gửi <b>Quý phụ huynh</b>,</p>

    <p>
      Hệ thống ghi nhận học sinh đã <b style="color:#28a745">đến trường đúng giờ</b>:
    </p>

    <table style="
      width:100%;
      border-collapse:collapse;
      margin:16px 0;
      font-size:14px;
    ">
      <tr>
        <td style="padding:8px;border:1px solid #ddd;width:35%">👨‍🎓 Học sinh</td>
        <td style="padding:8px;border:1px solid #ddd"><b>${studentName}</b></td>
      </tr>
      <tr>
        <td style="padding:8px;border:1px solid #ddd">🏫 Lớp</td>
        <td style="padding:8px;border:1px solid #ddd">${className}</td>
      </tr>
      <tr>
        <td style="padding:8px;border:1px solid #ddd">⏰ Thời gian điểm danh</td>
        <td style="padding:8px;border:1px solid #ddd"><b>${time}</b></td>
      </tr>
    </table>

    <p>
      Phụ huynh có thể xem <b>ảnh điểm danh</b> được đính kèm trong email này.
    </p>

    <p style="margin-top:24px">
      Trân trọng,<br/>
      <b>Nhà trường</b>
    </p>
  </div>

  <!-- FOOTER -->
  <div style="
    background:#f7f7f7;
    text-align:center;
    padding:10px;
    font-size:12px;
    color:#777;
  ">
    Email được gửi tự động – vui lòng không trả lời
  </div>
</div>
`;

/* ================= AUTO ATTENDANCE ================= */
/* ================= AUTO ATTENDANCE ================= */
const autoAttendance = (req, res) => {
  const { class_id, descriptor, image } = req.body;
  writeLog("▶️ Bắt đầu autoAttendance");

  if (!class_id || !descriptor || !image) {
    writeLog("❌ Thiếu dữ liệu request");
    return res.status(400).json({ message: "Thiếu dữ liệu" });
  }

  db.query(
    `SELECT id, name, face_encoding, email 
     FROM students 
     WHERE class_id=? AND face_encoding IS NOT NULL`,
    [class_id],
    (err, students) => {
      if (err || !students.length) {
        writeLog("❌ Không có dữ liệu khuôn mặt");
        return res.status(400).json({ message: "Không có dữ liệu khuôn mặt" });
      }

      let matched = null;
      let minDistance = 1;

      students.forEach((s) => {
        const dist = euclideanDistance(
          JSON.parse(s.face_encoding),
          descriptor
        );
        if (dist < minDistance) {
          minDistance = dist;
          matched = s;
        }
      });

      if (!matched || minDistance > 0.45) {
        writeLog("❌ Không match khuôn mặt");
        return res.status(401).json({ message: "Không nhận diện đúng người" });
      }

      db.query(
        `SELECT id FROM attendances WHERE student_id=? AND date=CURDATE()`,
        [matched.id],
        (err, exist) => {
          if (exist.length) {
            writeLog(`⚠️ Trùng điểm danh: ${matched.name}`);
            return res.json({ duplicated: true });
          }

          const now = new Date();
          const status =
            now.getHours() > 7 ||
            (now.getHours() === 7 && now.getMinutes() > 30)
              ? "late"
              : "present";

          const uploadDir = path.join(__dirname, "../uploads/attendance");
          if (!fs.existsSync(uploadDir))
            fs.mkdirSync(uploadDir, { recursive: true });

          const fileName = `att-${matched.id}-${Date.now()}.jpg`;
          fs.writeFileSync(
            path.join(uploadDir, fileName),
            image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          );

          db.query(
            `INSERT INTO attendances
             (student_id, class_id, date, status, image_capture)
             VALUES (?, ?, CURDATE(), ?, ?)`,
            [matched.id, class_id, status, fileName],
            async () => {
              writeLog(`✅ Điểm danh ${matched.name} - ${status}`);

              try {
                const [cls] = await new Promise((resolve) =>
                  db.query(
                    `SELECT name FROM classes WHERE id=?`,
                    [class_id],
                    (_, r) => resolve(r)
                  )
                );

                const parentEmail = matched.email;
                if (!parentEmail) {
                  writeLog("⚠️ Không có email phụ huynh");
                } else {
                  if (status === "late") {
                    const [cnt] = await new Promise((resolve) =>
                      db.query(
                        `SELECT COUNT(*) AS lateCount FROM attendances
                         WHERE student_id=? AND status='late'
                         AND MONTH(date)=MONTH(CURDATE())
                         AND YEAR(date)=YEAR(CURDATE())`,
                        [matched.id],
                        (_, r) => resolve(r)
                      )
                    );

                    await sendMail({
                      to: parentEmail,
                      subject: "⚠️ Cảnh báo học sinh đi muộn",
                      html: lateMailTemplate({
                        studentName: matched.name,
                        className: cls.name,
                        time: now.toLocaleTimeString("vi-VN"),
                        lateCount: cnt.lateCount,
                      }),
                      attachments: [
                        {
                          filename: fileName,
                          path: path.join(uploadDir, fileName),
                          cid: "attendance-image",
                        },
                      ],
                    });

                    writeLog("📧 Đã gửi mail đi muộn");
                  } else {
                    await sendMail({
                      to: parentEmail,
                      subject: "✅ Học sinh đã đến trường",
                      html: presentMailTemplate({
                        studentName: matched.name,
                        className: cls.name,
                        time: now.toLocaleTimeString("vi-VN"),
                      }),
                      attachments: [
                        {
                          filename: fileName,
                          path: path.join(uploadDir, fileName),
                          cid: "attendance-image",
                        },
                      ],
                    });

                    writeLog("📧 Đã gửi mail đến trường");
                  }
                }
              } catch (e) {
                writeLog("❌ Lỗi gửi mail: " + e.message);
              }

              getIO().emit("attendance:new", {
                student_id: matched.id,
                name: matched.name,
                status,
              });

              createNotification({
                student_id: matched.id,
                title: status === "late" ? "Đi muộn" : "Đến trường",
              });

              res.json({ success: true, status });
            }
          );
        }
      );
    }
  );
};

/* ================= GET TODAY ================= */
const getAttendanceToday = (req, res) => {
  writeLog("INFO", "Lấy danh sách điểm danh hôm nay");

  db.query(
    `SELECT s.name, a.image_capture, a.created_at, a.status
     FROM attendances a
     JOIN students s ON s.id = a.student_id
     WHERE a.date = CURDATE()
     ORDER BY a.id DESC`,
    (err, rows) => {
      if (err) {
        writeLog("ERROR", "Lỗi getAttendanceToday", err);
        return res.status(500).json({ message: "Lỗi DB" });
      }

      res.json(
        rows.map((r) => ({
          name: r.name,
          image: `/uploads/attendance/${r.image_capture}`,
          time: r.created_at,
          status: r.status,
        }))
      );
    }
  );
};

module.exports = {
  autoAttendance,
  getAttendanceToday,
};
