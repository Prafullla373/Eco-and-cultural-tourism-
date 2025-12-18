import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roleConstants.js";

import {
  addWildlife,
  getWildlife,
  getWildlifeById,
  updateWildlife,
  deleteWildlife
} from "../controllers/wildlifeController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.ECO_ADMIN),
  addWildlife
);

router.get("/", getWildlife);
router.get("/:id", getWildlifeById);

router.put(
  "/:id",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.ECO_ADMIN),
  updateWildlife
);

router.delete(
  "/:id",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.ECO_ADMIN),
  deleteWildlife
);

export default router;
