import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roleConstants.js";

import {
  addImage,
  getGallery,
  getImageById,
  deleteImage
} from "../controllers/galleryController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.ECO_ADMIN, ROLES.CULTURE_ADMIN),
  addImage
);

router.get("/", getGallery);
router.get("/:id", getImageById);

router.delete(
  "/:id",
  protect,
  allowRoles(ROLES.SUPER_ADMIN),
  deleteImage
);

export default router;
