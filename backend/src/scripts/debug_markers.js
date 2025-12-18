import mongoose from "mongoose";
import dotenv from "dotenv";
import { Location } from "../models/Location.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(`Error connecting: ${error.message}`);
        process.exit(1);
    }
};

const debugLocations = async () => {
    await connectDB();
    try {
        const locations = await Location.find({});
        console.log(`Found ${locations.length} locations.`);

        let validCount = 0;
        let invalidCount = 0;

        locations.forEach(loc => {
            const hasMapLocation = loc.mapLocation && loc.mapLocation.lat && loc.mapLocation.lng;
            const hasCoordinates = loc.coordinates && loc.coordinates.lat && loc.coordinates.lng;

            if (hasMapLocation || hasCoordinates) {
                validCount++;
            } else {
                invalidCount++;
                console.log(`Missing coordinates for: ${loc.name}`);
                console.log(`  mapLocation:`, loc.mapLocation);
                console.log(`  coordinates:`, loc.coordinates);
            }
        });

        console.log(`Valid Locations: ${validCount}`);
        console.log(`Invalid Locations: ${invalidCount}`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.disconnect();
    }
};

debugLocations();
