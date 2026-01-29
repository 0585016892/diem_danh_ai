const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");


/* ================= USERS ================= */

router.get("/", authMiddleware, userController.getAll);
router.get("/teachers", authMiddleware, userController.getTeachers);
router.get("/my-class", authMiddleware, userController.getMyClassStudents);
router.get(
  "/classes/:classId/students",
  authMiddleware,
  userController.getStudentsByClass
);

// Lấy thông tin user đang đăng nhập
router.get("/me", authMiddleware, userController.getProfile);
router.post("/",upload.single("avatar"), authMiddleware, userController.create);
router.put("/:id",upload.single("avatar"), authMiddleware, userController.update);
// Cập nhật thông tin cá nhân
router.put("/me", authMiddleware, userController.updateProfile);

// Đổi mật khẩu
router.put("/me/password", authMiddleware, userController.changePassword);


router.patch("/:id/status", authMiddleware, userController.updateStatus);
router.delete("/:id", authMiddleware, userController.remove);


module.exports = router;
