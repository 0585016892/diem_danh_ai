const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
  db.query(sql, [email], async (err, results) => {
    try {
      if (err) {
        console.error("❌ SQL error:", err);
        return res
          .status(500)
          .json({ message: "Lỗi hệ thống, vui lòng thử lại" });
      }

      if (!results.length) {
        return res
          .status(401)
          .json({ message: "Email hoặc mật khẩu không đúng" });
      }

      const user = results[0];

      /* 🔒 CHECK STATUS */
      if (user.status !== "active") {
        let msg = "Tài khoản không thể đăng nhập";

        if (user.status === "inactive") {
          msg = "Tài khoản đã bị khóa";
        } else if (user.status === "pending") {
          msg = "Tài khoản đang chờ duyệt";
        }

        return res.status(403).json({ message: msg });
      }

      /* 🔐 CHECK PASSWORD */
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Email hoặc mật khẩu không đúng" });
      }

      /* 🎫 CREATE TOKEN */
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          class_id: user.class_id,
          status: user.status,
          date_of_birth: user.date_of_birth,
          gender: user.gender,
          address: user.address,
          position: user.position,
          note: user.note,
          avatar: user.avatar,
          created_at: user.created_at,
        },
      });
    } catch (error) {
      console.error("🔥 LOGIN ERROR:", error);
      return res
        .status(500)
        .json({ message: "Lỗi hệ thống, vui lòng thử lại" });
    }
  });
};
  