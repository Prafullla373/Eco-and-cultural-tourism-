import mongoose from "mongoose";
import { Location } from "../models/Location.js";
import { MONGO_URI } from "../config/env.js";

const approveLocations = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");

        const res = await Location.updateMany({}, { isApproved: true, isActive: true });
        console.log(`Updated ${res.modifiedCount} locations to be active and approved.`);

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

approveLocations();
