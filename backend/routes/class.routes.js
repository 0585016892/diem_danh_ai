const express = require("express");
const router = express.Router();
const classController = require("../controllers/class.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, classController.getAll);
router.post("/", authMiddleware, classController.create);
router.put("/:id", authMiddleware, classController.update);
router.put("/:id/status", authMiddleware, classController.updateStatus);
router.delete("/:id", authMiddleware, classController.remove);

module.exports = router;
