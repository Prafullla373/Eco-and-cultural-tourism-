// backend/src/models/User.js
import mongoose from "mongoose";
import { ROLES } from "../utils/roleConstants.js";

const userSchema = new mongoose.Schema(
  {
    // COMMON FIELDS
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },

    // ⭐ TRAVELLER FIELDS ⭐
    ageGroup: { type: String },
    state: { type: String },
    city: { type: String },
    travelPreference: { type: String }, // nature, wildlife, culture
    travelLevel: { type: String }, // beginner, moderate, frequent

    // ⭐ LOCAL GUIDE FIELDS ⭐
    experienceYears: { type: Number },
    expertise: [{ type: String }], // trekking, cultural tour, wildlife
    languages: [{ type: String }],
    district: { type: String },
    village: { type: String },

    idProofType: { type: String }, // Aadhar, PAN, VoterId
    idNumber: { type: String },

    bio: { type: String, maxlength: 500 },
    availability: { type: String }, // full-time, part-time, on-request
    avatar: String,
    wishlist: [
      {
        type: { type: String },   // hotel, explore
        itemId: { type: String }
      }
    ],
    history: [
      {
        type: { type: String },
        itemId: { type: String },
        viewedAt: { type: Date, default: Date.now }
      }
    ],
    // SYSTEM FIELDS
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
