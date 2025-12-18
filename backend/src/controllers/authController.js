// backend/src/controllers/authController.js
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/User.js";
import { generateTokenAndSetCookie } from "../utils/generateJWT.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import { NODE_ENV } from "../config/env.js";

/* ---------------- STRONG PASSWORD RULE ---------------- */
const strongPass =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/* ======================================================
   REGISTER (User + Local Guide)
   ====================================================== */
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      mobile,

      // Traveller fields
      ageGroup,
      state,
      city,
      travelPreference,
      travelLevel,

      // Local Guide fields
      experienceYears,
      expertise,
      languages,
      district,
      village,
      idProofType,
      idNumber,
      bio,
      availability,
    } = req.body;

    /* ---------------- CHECK EXISTING USER ---------------- */
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    /* ---------------- STRONG PASSWORD VALIDATION ---------------- */
    if (!strongPass.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ characters and include uppercase, lowercase, number & special character.",
      });
    }

    /* ---------------- HASH PASSWORD ---------------- */
    const hashed = await bcrypt.hash(password, 10);

    /* ---------------- CREATE USER ---------------- */
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      mobile,

      // Traveller fields
      ageGroup,
      state,
      city,
      travelPreference,
      travelLevel,

      // Local Guide fields
      experienceYears,
      expertise,
      languages,
      district,
      village,
      idProofType,
      idNumber,
      bio,
      availability,
    });

    /* ---------------- SET COOKIE JWT ---------------- */
    generateTokenAndSetCookie(user._id, user.role, res);

    /* ---------------- RESPONSE ---------------- */
    return res.json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("REGISTER ERROR →", err);
    return res.status(500).json({ message: "Registration failed" });
  }
};

/* ======================================================
   LOGIN
   ====================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* ---------------- FIND USER ---------------- */
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    /* ---------------- CHECK PASSWORD ---------------- */
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    /* ---------------- SET COOKIE JWT ---------------- */
    generateTokenAndSetCookie(user._id, user.role, res);

    /* ---------------- RESPONSE ---------------- */
    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR →", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

/* ======================================================
   LOGOUT
   ====================================================== */
export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
  return res.json({ message: "Logged out successfully" });
};

/* ======================================================
   PROFILE
   ====================================================== */
// PROFILE
export const profile = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const response = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: user.mobile,

      // traveller fields
      ageGroup: user.ageGroup,
      state: user.state,
      city: user.city,
      travelPreference: user.travelPreference,
      travelLevel: user.travelLevel,

      // local guide fields
      experienceYears: user.experienceYears,
      expertise: user.expertise,
      languages: user.languages,
      district: user.district,
      village: user.village,
      idProofType: user.idProofType,
      idNumber: user.idNumber,
      bio: user.bio,
      availability: user.availability,

      // profile photo
      avatar: user.avatar || null,

      // dashboard stats
      // dashboard stats
      wishlist: user.wishlist || [],
      history: user.history || [],
    };

    // Populate Wishlist Details
    if (user.wishlist && user.wishlist.length > 0) {
      const { Hotel } = await import("../models/Hotel.js");
      const { Location } = await import("../models/Location.js");

      const populatedWishlist = await Promise.all(user.wishlist.map(async (item) => {
        try {
          let details = null;
          const id = item.itemId.toString().trim();

          if (item.type.toLowerCase() === 'hotel') {
            details = await Hotel.findById(id).select('name images district');
          } else if (item.type.toLowerCase() === 'package') {
            const { Package } = await import("../models/Package.js");
            details = await Package.findById(id).select('title images location');
            if (details) {
              // Normalize package fields to match others
              details = { name: details.title, images: details.images, district: "Jharkhand" };
            }
          } else {
            details = await Location.findById(id).select('name images district');
          }

          return {
            ...item.toObject(),
            details: details ? { name: details.name, image: details.images?.[0], district: details.district } : null
          };
        } catch (e) {
          console.error(`Failed to populate wishlist item ${item.itemId}:`, e);
          return item.toObject();
        }
      }));
      response.wishlist = populatedWishlist;
    }

    // Populate History Details
    if (user.history && user.history.length > 0) {
      const { Hotel } = await import("../models/Hotel.js");
      const { Location } = await import("../models/Location.js");

      const populatedHistory = await Promise.all(user.history.map(async (item) => {
        try {
          let details = null;
          const id = item.itemId.toString().trim();

          if (item.type.toLowerCase() === 'hotel') {
            details = await Hotel.findById(id).select('name images district');
          } else if (item.type.toLowerCase() === 'package') {
            const { Package } = await import("../models/Package.js");
            details = await Package.findById(id).select('title images location');
            if (details) {
              details = { name: details.title, images: details.images, district: "Jharkhand" };
            }
          } else {
            details = await Location.findById(id).select('name images district');
          }

          return {
            ...item.toObject(),
            details: details ? { name: details.name, image: details.images?.[0], district: details.district } : null
          };
        } catch (e) {
          console.error(`Failed to populate history item ${item.itemId}:`, e);
          return item.toObject();
        }
      }));
      response.history = populatedHistory;
    }

    res.json(response);

  } catch (err) {
    console.error("PROFILE ERROR →", err);
    res.status(500).json({ message: "Cannot load profile" });
  }
};

/* ======================================================
   UPDATE PROFILE
   ====================================================== */
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const updates = req.body;

    // Prevent updating sensitive fields
    delete updates.password;
    delete updates.role;
    delete updates.email;

    // Handle file upload
    if (req.file) {
      updates.avatar = `http://localhost:5000/${req.file.path.replace(/\\/g, "/")}`;
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        avatar: user.avatar,
        bio: user.bio,
      }
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR →", err);
    res.status(500).json({ message: "Cannot update profile" });
  }
};

/* ======================================================
   FORGOT PASSWORD (Send reset link)
   ====================================================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal email existence
      return res.json({
        message: "If this email exists, a reset link has been sent",
      });
    }

    // Remove old tokens
    await PasswordResetToken.deleteMany({ user: user._id });

    // Create new token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await PasswordResetToken.create({
      user: user._id,
      token,
      expiresAt,
    });

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    console.log("RESET URL:", resetUrl);

    return res.json({
      message: "If this email exists, a reset link has been generated",
      resetUrl,
    });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR →", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/* ======================================================
   RESET PASSWORD
   ====================================================== */
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password)
      return res
        .status(400)
        .json({ message: "Token and password are required" });

    // Validate token
    const record = await PasswordResetToken.findOne({ token });
    if (!record)
      return res.status(400).json({ message: "Invalid or expired token" });

    if (record.expiresAt < new Date()) {
      await record.deleteOne();
      return res.status(400).json({ message: "Reset token has expired" });
    }

    // Validate password strength
    if (!strongPass.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ chars & include uppercase, lowercase, number & special char.",
      });
    }

    // Update password
    const user = await User.findById(record.user);
    if (!user) {
      await record.deleteOne();
      return res.status(400).json({ message: "User not found" });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    await record.deleteOne();

    return res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error("RESET PASSWORD ERROR →", err);
    return res.status(500).json({ message: "Could not reset password" });
  }
};
