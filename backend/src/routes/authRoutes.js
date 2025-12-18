// backend/src/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  logout,
  profile,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", protect, profile);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

// NEW:
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
