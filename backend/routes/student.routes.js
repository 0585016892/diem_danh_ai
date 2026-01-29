const router = require("express").Router();
const ctrl = require("../controllers/student.controller");
const upload = require("../middleware/uploadStudent");
const multer = require("multer");
const uploada = multer({ storage: multer.memoryStorage() });

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);

router.post(

  "/import-excel",
  uploada.single("file"),
  ctrl.importExcel
);
router.post(
  "/",
  upload.single("image"), // 👈 BẮT BUỘC
  ctrl.create
);
router.put(
  "/:id",
  upload.single("image"),
  ctrl.update
);
router.delete("/:id", ctrl.remove);

router.put("/:id/status", ctrl.updateStatus);
router.post("/:id/face", upload.single("image"), ctrl.uploadFace);

module.exports = router;
