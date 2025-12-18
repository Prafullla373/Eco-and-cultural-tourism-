import { User } from "../models/User.js";
import fs from "fs";

// UPDATE PROFILE
export const updateMe = async (req, res) => {
  try {
    const id = req.user.id;

    const {
      name,
      mobile,
      travellerProfile,
      guideProfile,
    } = req.body;

    const update = {
      name,
      mobile,

      // Traveller fields
      ageGroup: travellerProfile?.ageGroup || "",
      state: travellerProfile?.state || "",
      city: travellerProfile?.city || "",
      travelPreference: travellerProfile?.travelPreference || "",
      travelLevel: travellerProfile?.travelLevel || "",

      // Guide fields
      experienceYears: guideProfile?.experienceYears || "",
      district: guideProfile?.district || "",
      village: guideProfile?.village || "",
      availability: guideProfile?.availability || "",
      bio: guideProfile?.bio || "",
    };

    const user = await User.findByIdAndUpdate(id, update, {
      new: true,
    }).select("-password");

    return res.json(user);
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Could not update profile" });
  }
};

// UPLOAD AVATAR
export const uploadAvatar = async (req, res) => {
  try {
    const id = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const filePath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      id,
      { avatar: filePath },
      { new: true }
    ).select("-password");

    return res.json(user);
  } catch (err) {
    console.error("UPLOAD AVATAR ERROR:", err);
    res.status(500).json({ message: "File upload failed" });
  }
};
