const express = require("express");
const router = express.Router();
const db = require("../db");
const io = require("../socket");

/* ================= GET STATUS ================= */
router.get("/camera/status", (req, res) => {
  db.query(
    "SELECT camera_enabled FROM system_settings WHERE id = 1",
    (err, rows) => {
      if (err) return res.status(500).json(err);

      res.json({
        camera_enabled: rows[0]?.camera_enabled === 1,
      });
    }
  );
});

/* ================= TOGGLE ================= */
router.post("/camera/toggle", (req, res) => {
  const enabled = !!req.body.enabled;

  db.query(
    "UPDATE system_settings SET camera_enabled = ? WHERE id = 1",
    [enabled ? 1 : 0],
    err => {
      if (err) return res.status(500).json(err);

      req.io.emit(
        enabled ? "system:camera:on" : "system:camera:off"
      );

      res.json({
        success: true,
        camera_enabled: enabled
      });
    }
  );
});



module.exports = router;
