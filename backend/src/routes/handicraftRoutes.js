import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roleConstants.js";

import {
  addHandicraft,
  getHandicrafts,
  getHandicraftById,
  updateHandicraft,
  deleteHandicraft
} from "../controllers/handicraftController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.ARTISAN_ADMIN),
  addHandicraft
);

router.get("/", getHandicrafts);
router.get("/:id", getHandicraftById);

router.put(
  "/:id",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.ARTISAN_ADMIN),
  updateHandicraft
);

router.delete(
  "/:id",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.ARTISAN_ADMIN),
  deleteHandicraft
);

export default router;
