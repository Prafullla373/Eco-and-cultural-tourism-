import express from "express";
import {
  createExploreItem,
  getExploreItems,
  getExploreItemById,
  updateExploreItem,
  deleteExploreItem,
  addExploreReview,
  logExploreRedirect,
} from "../controllers/exploreController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getExploreItems);
router.get("/:id", getExploreItemById);

router.post(
  "/",
  protect,
  authorizeRoles("super_admin", "admin", "eco_admin", "cultural_admin", "packages_admin", "events_admin"),
  createExploreItem
);

router.put(
  "/:id",
  protect,
  authorizeRoles("super_admin", "admin", "eco_admin", "cultural_admin", "packages_admin", "events_admin"),
  updateExploreItem
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("super_admin", "admin"),
  deleteExploreItem
);
router.post("/:id/review", protect, addExploreReview);
router.post("/:id/redirect", logExploreRedirect);
export default router;
