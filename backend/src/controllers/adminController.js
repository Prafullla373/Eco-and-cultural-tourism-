import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { ROLES } from "../utils/roleConstants.js";

// Get all admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({
      role: { $in: Object.values(ROLES).filter((r) => r !== "user") },
    }).select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins" });
  }
};

// Create new admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, mobile } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      mobile,
    });

    res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin" });
  }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin" });
  }
};

// Approve Content
import Hotel from "../models/Hotel.js";
import { Package } from "../models/Package.js";
import { Event } from "../models/Event.js";
import { Location } from "../models/Location.js";

export const approveContent = async (req, res) => {
  try {
    const { type, id } = req.params;
    let Model;

    switch (type) {
      case "hotel": Model = Hotel; break;
      case "package": Model = Package; break;
      case "event": Model = Event; break;
      case "location": Model = Location; break;
      default: return res.status(400).json({ message: "Invalid content type" });
    }

    const item = await Model.findByIdAndUpdate(id, { isApproved: true }, { new: true });

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Content approved successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Error approving content" });
  }
};

// Get Pending Content
export const getPendingContent = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isApproved: false }).select("name _id createdAt");
    const packages = await Package.find({ isApproved: false }).select("title _id createdAt");
    const events = await Event.find({ isApproved: false }).select("title _id createdAt");
    const locations = await Location.find({ isApproved: false }).select("name _id createdAt");

    res.json({
      hotels,
      packages,
      events,
      locations
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending content" });
  }
};
