import express from "express";
import { getAllCulture, getCultureById } from "../controllers/cultureController.js";

const router = express.Router();

router.get("/", getAllCulture);
router.get("/:id", getCultureById);

export default router;
