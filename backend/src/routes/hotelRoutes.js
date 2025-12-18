// backend/src/routes/hotelRoutes.js
import express from "express";
import {
  addHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  addHotelReview,
} from "../controllers/hotelController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roleConstants.js";

const router = express.Router();

// ⭐ AUTH REQUIRED
router.post(
  "/",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.HOTEL_MANAGER),
  addHotel
);

router.get("/", getHotels);
router.get("/:id", getHotelById);

router.put(
  "/:id",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.HOTEL_MANAGER),
  updateHotel
);

router.delete(
  "/:id",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.HOTEL_MANAGER),
  deleteHotel
);

router.post("/:id/review", protect, addHotelReview);

export default router;
