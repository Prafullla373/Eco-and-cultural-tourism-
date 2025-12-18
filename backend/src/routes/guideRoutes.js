import express from "express";
import { getGuides, getGuideById, updateAvailability } from "../controllers/guideController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getGuides);
router.get("/:id", getGuideById);
router.patch("/availability", protect, updateAvailability);

export default router;
