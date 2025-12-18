// backend/routes/userRoutes.js
import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import {
  updateMe,
  uploadAvatar
} from "../controllers/userController.js";

import { User } from "../models/User.js";

const router = express.Router();

// Multer for avatar upload
const upload = multer({ dest: "uploads/" });

/* ------------------------------------------
   1️⃣ Update profile
-------------------------------------------*/
router.put("/me", protect, updateMe);

/* ------------------------------------------
   2️⃣ Upload avatar
-------------------------------------------*/
router.post("/me/avatar", protect, upload.single("avatar"), uploadAvatar);

/* ------------------------------------------
   3️⃣ Add View History (Explore/Hotel)
-------------------------------------------*/
router.post("/me/history", protect, async (req, res) => {
  try {
    const { itemId, itemType, title } = req.body;

    if (!itemId || !itemType || !title) {
      return res.status(400).json({ message: "Missing history fields" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Push history item
    // Use 'history' as defined in User model, not 'viewHistory'
    user.history.push({
      itemId,
      type: itemType, // "hotel" or "explore"
      // title is not in schema, but maybe we should add it or just rely on itemId?
      // Schema says: type, itemId, viewedAt. 
      // If we want title, we need to update schema or fetch it on read.
      // For now, let's just push what schema supports.
      viewedAt: new Date(),
    });

    // Keep only last 100 entries
    if (user.history.length > 100) {
      user.history = user.history.slice(-100);
    }

    await user.save();

    res.json(user);

  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ message: "Failed to log history" });
  }
});

/* ------------------------------------------
   4️⃣ Toggle Wishlist
-------------------------------------------*/
router.post("/me/wishlist", protect, async (req, res) => {
  try {
    const { type, itemId, action } = req.body; // action: 'add' or 'remove'

    if (!type || !itemId || !action) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === "add") {
      // Check if already exists
      const exists = user.wishlist.some(w => w.itemId === itemId);
      if (!exists) {
        user.wishlist.push({ type, itemId });
      }
    } else if (action === "remove") {
      user.wishlist = user.wishlist.filter(w => w.itemId !== itemId);
    }

    await user.save();
    res.json(user.wishlist);

  } catch (err) {
    console.error("Wishlist error:", err);
    res.status(500).json({ message: "Failed to update wishlist" });
  }
});

/* ------------------------------------------
   Export router
-------------------------------------------*/
export default router;
