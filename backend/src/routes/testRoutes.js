import express from "express";
import { Location } from "../models/Location.js";

const router = express.Router();

router.get("/test-location", async (req, res) => {
  try {
    const loc = await Location.create({
      name: "Dassam Falls",
      slug: "dassam-falls",
      type: "waterfall",
      district: "Ranchi",
      shortDescription: "Beautiful 144 ft waterfall",
      images: ["https://example.com/img1.jpg"]
    });

    res.json({ success: true, data: loc });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

export default router;
