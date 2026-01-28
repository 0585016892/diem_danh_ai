const express = require("express");
const router = express.Router();
const controller = require("../controllers/notification.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, controller.getNotifications);
router.put("/:id/read", authMiddleware, controller.markAsRead);
router.put("/read-all", authMiddleware, controller.markAllAsRead);
module.exports = router;
