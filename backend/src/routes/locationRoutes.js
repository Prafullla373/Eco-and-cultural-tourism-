import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roleConstants.js";
import {
  addLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation
} from "../controllers/locationController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.ECO_MANAGER, ROLES.CULTURAL_MANAGER),
  addLocation
);

router.get("/", getLocations);
router.get("/:id", getLocationById);

router.put(
  "/:id",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.ECO_MANAGER, ROLES.CULTURAL_MANAGER),
  updateLocation
);

router.delete(
  "/:id",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.ECO_MANAGER, ROLES.CULTURAL_MANAGER),
  deleteLocation
);

export default router;
