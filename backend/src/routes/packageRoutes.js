import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roleConstants.js";
import {
  addPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage
} from "../controllers/packageController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.PACKAGE_MANAGER),
  addPackage
);

router.get("/", getPackages);
router.get("/:id", getPackageById);

router.put(
  "/:id",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.PACKAGE_MANAGER),
  updatePackage
);

router.delete(
  "/:id",
  protect,
  allowRoles(ROLES.SUPER_ADMIN, ROLES.PACKAGE_MANAGER),
  deletePackage
);

export default router;
