import mongoose from "mongoose";
import { Location } from "../models/Location.js";
import { MONGO_URI } from "../config/env.js";
import fs from "fs";

const checkLocations = async () => {
    try {
        let output = "";
        const log = (msg) => { output += msg + "\n"; };

        log(`Connecting to: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI);
        log("Connected to DB");

        const count = await Location.countDocuments();
        log(`Total Locations: ${count}`);

        const activeApproved = await Location.countDocuments({ isActive: true, isApproved: true });
        log(`Active & Approved Locations: ${activeApproved}`);

        if (count > 0) {
            const sample = await Location.findOne();
            log("Sample Location: " + JSON.stringify(sample, null, 2));
        } else {
            log("No locations found in DB.");
        }

        fs.writeFileSync("debug_output.txt", output);
        process.exit();
    } catch (error) {
        fs.writeFileSync("debug_output.txt", "Error: " + error.message);
        process.exit(1);
    }
};

checkLocations();
