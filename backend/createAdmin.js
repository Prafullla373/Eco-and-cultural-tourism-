import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./src/models/User.js";  // FIXED IMPORT

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    const email = "admin@jharkhand.com";
    const passwordPlain = "Admin123@";

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists:", email);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(passwordPlain, 10);

    const admin = new User({
      name: "Super Admin",
      email: email,
      password: hashed,
      role: "super_admin"
    });

    await admin.save();

    console.log("Super Admin Created Successfully!");
    console.log("Email:", email);
    console.log("Password:", passwordPlain);

    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

createAdmin();
