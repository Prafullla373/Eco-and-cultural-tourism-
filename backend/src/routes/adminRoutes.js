import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { getAdmins, createAdmin, deleteAdmin, approveContent, getPendingContent } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roleConstants.js";

const router = express.Router();

router.get("/dashboard-stats", protect, getDashboardStats);

// Admin Management Routes (Super Admin Only)
router.get("/users", protect, allowRoles(ROLES.SUPER_ADMIN), getAdmins);
router.post("/users", protect, allowRoles(ROLES.SUPER_ADMIN), createAdmin);
router.delete("/users/:id", protect, allowRoles(ROLES.SUPER_ADMIN), deleteAdmin);

// Approval Routes (Super Admin Only)
router.put("/approve/:type/:id", protect, allowRoles(ROLES.SUPER_ADMIN), approveContent);
router.get("/pending-approvals", protect, allowRoles(ROLES.SUPER_ADMIN), getPendingContent);

// Report Routes
import { exportHotels, exportUsers, exportPackages, exportEvents, exportLocations } from "../controllers/reportController.js";
router.get("/reports/hotels", protect, allowRoles(ROLES.SUPER_ADMIN), exportHotels);
router.get("/reports/users", protect, allowRoles(ROLES.SUPER_ADMIN), exportUsers);
router.get("/reports/packages", protect, allowRoles(ROLES.SUPER_ADMIN), exportPackages);
router.get("/reports/events", protect, allowRoles(ROLES.SUPER_ADMIN), exportEvents);
router.get("/reports/locations", protect, allowRoles(ROLES.SUPER_ADMIN), exportLocations);

export default router;
