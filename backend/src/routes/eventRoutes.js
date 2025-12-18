import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../utils/roleConstants.js";
import {
    addEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
} from "../controllers/eventController.js";

const router = express.Router();

router.post(
    "/",
    protect,
    allowRoles(ROLES.SUPER_ADMIN, ROLES.EVENT_MANAGER),
    addEvent
);

router.get("/", getEvents);
router.get("/:id", getEventById);

router.put(
    "/:id",
    protect,
    allowRoles(ROLES.SUPER_ADMIN, ROLES.EVENT_MANAGER),
    updateEvent
);

router.delete(
    "/:id",
    protect,
    allowRoles(ROLES.SUPER_ADMIN, ROLES.EVENT_MANAGER),
    deleteEvent
);

export default router;
