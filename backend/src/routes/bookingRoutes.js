import express from "express";
import { createBooking, getUserBookings, getGuideBookings, updateBookingStatus } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/user", protect, getUserBookings);
router.get("/guide", protect, getGuideBookings);
router.patch("/:id/status", protect, updateBookingStatus);

export default router;
