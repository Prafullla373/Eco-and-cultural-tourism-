import mongoose from "mongoose";
import { Location } from "../models/Location.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jharkhand_tourism";

import fs from "fs";

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync("debug_output.txt", msg + "\n");
};

const checkImages = async () => {
    try {
        log("Connecting to DB at " + MONGO_URI);
        await mongoose.connect(MONGO_URI);
        log("Connected to DB.");

        const locations = await Location.find({});
        log(`Found ${locations.length} locations.`);

        locations.slice(0, 5).forEach(loc => {
            log(`\nName: ${loc.name}`);
            log(`Images: ${JSON.stringify(loc.images)}`);
        });

        const specific = locations.filter(l => ["State Museum Hotwar", "Jubilee Park"].includes(l.name));
        if (specific.length > 0) {
            log("\n--- Specific Locations ---");
            specific.forEach(loc => {
                log(`\nName: ${loc.name}`);
                log(`Images: ${JSON.stringify(loc.images)}`);
            });
        }

        process.exit();
    } catch (error) {
        log("Error: " + error);
        process.exit(1);
    }
};

checkImages();
