import mongoose from "mongoose";
import dotenv from "dotenv";
import { Location } from "../models/Location.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFile = path.join(__dirname, "../../debug_output.txt");

const log = (msg) => {
    fs.appendFileSync(outputFile, msg + "\n");
    console.log(msg);
};

// Try loading .env from backend root
dotenv.config({ path: path.join(__dirname, "../../.env") });

log("Starting debug script...");
log(`MONGO_URI: ${process.env.MONGO_URI ? "Found" : "Not Found"}`);

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing");
        }
        await mongoose.connect(process.env.MONGO_URI);
        log("MongoDB Connected");
    } catch (error) {
        log(`Error connecting: ${error.message}`);
        process.exit(1);
    }
};

const debugLocations = async () => {
    await connectDB();

    try {
        const locations = await Location.find({});
        log(`Found ${locations.length} locations.`);

        locations.forEach(loc => {
            log(`Name: ${loc.name}`);
            log(`  mapLocation: ${JSON.stringify(loc.mapLocation)}`);
            log(`  coordinates: ${JSON.stringify(loc.coordinates)}`);
            log("-----------------------------------");
        });

    } catch (error) {
        log(`Error fetching locations: ${error}`);
    } finally {
        mongoose.disconnect();
        log("Done.");
    }
};

// Clear previous output
fs.writeFileSync(outputFile, "");
debugLocations();
