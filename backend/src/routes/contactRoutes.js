import express from "express";
import { submitMessage } from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, submitMessage);

export default router;
