import mongoose from "mongoose";
import axios from "axios";
import { Location } from "../models/Location.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jharkhand_tourism";
const UNSPLASH_KEY = process.env.UNSPLASH_KEY;

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync("debug_output.txt", msg + "\n");
};

if (!UNSPLASH_KEY) {
    log("UNSPLASH_KEY is missing in .env");
    process.exit(1);
}

const RUN_ID = Math.floor(Math.random() * 10000);
log(`Starting Unsplash Update [${RUN_ID}]. Key length: ${UNSPLASH_KEY.length}`);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const updateImages = async () => {
    try {
        log(`[${RUN_ID}] Connecting to DB...`);
        await mongoose.connect(MONGO_URI);
        log(`[${RUN_ID}] Connected.`);

        const locations = await Location.find({});
        log(`[${RUN_ID}] Found ${locations.length} locations to update.`);

        for (const loc of locations) {
            log(`[${RUN_ID}] Fetching images for: ${loc.name}...`);

            // Search query: Try specific name first
            const query = `${loc.name} Jharkhand`;

            try {
                const res = await axios.get(`https://api.unsplash.com/search/photos`, {
                    params: {
                        query: query,
                        per_page: 3,
                        orientation: "landscape",
                        client_id: UNSPLASH_KEY
                    }
                });

                if (res.data.results && res.data.results.length > 0) {
                    const newImages = res.data.results.map(img => img.urls.regular);
                    loc.images = newImages;
                    await loc.save();
                    log(`✅ Updated ${loc.name} with ${newImages.length} images.`);
                } else {
                    log(`⚠️ No images found for ${loc.name}. Trying fallback query...`);
                    // Fallback: Search by Type + District (e.g., "Waterfall Ranchi")
                    const fallbackQuery = `${loc.type} ${loc.district} Jharkhand`;
                    const fallbackRes = await axios.get(`https://api.unsplash.com/search/photos`, {
                        params: {
                            query: fallbackQuery,
                            per_page: 3,
                            orientation: "landscape",
                            client_id: UNSPLASH_KEY
                        }
                    });

                    if (fallbackRes.data.results && fallbackRes.data.results.length > 0) {
                        const fallbackImages = fallbackRes.data.results.map(img => img.urls.regular);
                        loc.images = fallbackImages;
                        await loc.save();
                        log(`✅ Updated ${loc.name} with fallback images.`);
                    } else {
                        log(`❌ Still no images for ${loc.name}. Keeping existing.`);
                    }
                }
            } catch (apiErr) {
                log(`API Error for ${loc.name}: ${apiErr.message}`);
                if (apiErr.response) {
                    log(`Status: ${apiErr.response.status}`);
                    log(`Data: ${JSON.stringify(apiErr.response.data)}`);
                }
            }

            // Delay to avoid rate limits
            await delay(1000);
        }

        log("Image update complete.");
        process.exit();
    } catch (error) {
        log("Script failed: " + error);
        process.exit(1);
    }
};

updateImages();
