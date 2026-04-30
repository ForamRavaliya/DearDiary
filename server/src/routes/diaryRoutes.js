const express = require("express");
const {
  createDiary,
  getMyDiaries,
  getSingleDiary,
  unlockDiary,
  updateDiary,
  deleteDiary,
  toggleFavoriteDiary,
  getTrashDiaries,
  restoreDiary,
  permanentDeleteDiary,
  searchDiaries,
  getDashboardStats,
} = require("../controllers/diaryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createDiary);
router.get("/", protect, getMyDiaries);

router.get("/search", protect, searchDiaries);
router.get("/stats", protect, getDashboardStats);
router.get("/trash", protect, getTrashDiaries);

router.get("/:id", protect, getSingleDiary);
router.post("/:id/unlock", protect, unlockDiary);
router.put("/:id", protect, updateDiary);
router.delete("/:id", protect, deleteDiary);
router.patch("/:id/favorite", protect, toggleFavoriteDiary);

router.patch("/:id/restore", protect, restoreDiary);
router.delete("/:id/permanent", protect, permanentDeleteDiary);

module.exports = router;