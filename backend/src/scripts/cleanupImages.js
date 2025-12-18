import mongoose from "mongoose";
import axios from "axios";
import { Location } from "../models/Location.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jharkhand_tourism";
const UNSPLASH_KEY = process.env.UNSPLASH_KEY;

const manualFixes = {
    "Jubilee Park": ["https://placehold.co/800x600/2E8B57/FFFFFF?text=Jubilee+Park"],
    "Patratu Valley & Dam": ["https://placehold.co/800x600/4682B4/FFFFFF?text=Patratu+Valley"],
    "Betla National Park": ["https://placehold.co/800x600/8B4513/FFFFFF?text=Betla+National+Park"],
    "Maluti Temples": ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Maluti_Temple.jpg/640px-Maluti_Temple.jpg"],
    "Dalma Wildlife Sanctuary": ["https://placehold.co/800x600/228B22/FFFFFF?text=Dalma+Wildlife"],
    "Hazaribagh Wildlife Sanctuary": ["https://placehold.co/800x600/556B2F/FFFFFF?text=Hazaribagh+Wildlife"],
    "Jagannath Temple": ["https://placehold.co/800x600/FF8C00/FFFFFF?text=Jagannath+Temple"],
    "Dimna Lake": ["https://placehold.co/800x600/1E90FF/FFFFFF?text=Dimna+Lake"],
    "Chandil Dam": ["https://placehold.co/800x600/00008B/FFFFFF?text=Chandil+Dam"],
    "State Museum Hotwar": ["https://placehold.co/800x600/800000/FFFFFF?text=State+Museum+Hotwar"]
};

import fs from "fs";

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync("debug_output.txt", msg + "\n");
};

const updateStubborn = async () => {
    try {
        log("Starting Cleanup Script...");
        log("Connecting to DB...");
        await mongoose.connect(MONGO_URI);
        log("Connected.");

        for (const [name, query] of Object.entries(manualFixes)) {
            log(`Fixing ${name} with query: "${query}"...`);
            const loc = await Location.findOne({ name });
            if (!loc) {
                log(`Location ${name} not found in DB.`);
                continue;
            }

            // Skip API call due to rate limit
            // Just apply the manual fix directly
            loc.images = query; // query is now the array of URLs
            await loc.save();
            log(`✅ Fixed ${name} with fallback/placeholder.`);
        }

        log("Cleanup complete.");
        process.exit();
    } catch (error) {
        log("Cleanup failed: " + error);
        process.exit(1);
    }
};

updateStubborn();
