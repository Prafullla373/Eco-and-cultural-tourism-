import mongoose from "mongoose";
import { User } from "./src/models/User.js";
import { Hotel } from "./src/models/Hotel.js";
import { Location } from "./src/models/Location.js";
import fs from "fs";

const logFile = "debug_root_output.txt";
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + "\n");
};

fs.writeFileSync(logFile, "Script started...\n");

const MONGO_URI = "mongodb://127.0.0.1:27017/jharkhand_tourism";

const run = async () => {
    try {
        log("Connecting to DB...");
        await mongoose.connect(MONGO_URI);
        log("Connected to DB");

        const users = await User.find({ "wishlist.0": { $exists: true } });
        log(`Found ${users.length} users with wishlist items.`);

        for (const user of users) {
            log(`\nChecking User: ${user.email} (${user._id})`);
            log(`Wishlist: ${JSON.stringify(user.wishlist)}`);

            for (const item of user.wishlist) {
                log(`  Checking Item: Type=${item.type}, ID=${item.itemId}`);
                let details = null;
                try {
                    if (item.type === 'hotel') {
                        details = await Hotel.findById(item.itemId).select('name');
                    } else if (item.type === 'explore') {
                        details = await Location.findById(item.itemId).select('name');
                    }
                } catch (err) {
                    log(`    ❌ Error finding item: ${err.message}`);
                }

                if (details) {
                    log(`    ✅ Found: ${details.name}`);
                } else {
                    log(`    ❌ NOT FOUND in DB`);
                }
            }
        }

        // Check History too
        const usersHistory = await User.find({ "history.0": { $exists: true } });
        log(`\nFound ${usersHistory.length} users with history items.`);

        for (const user of usersHistory) {
            log(`\nChecking User History: ${user.email}`);
            for (const item of user.history) {
                log(`  Checking History Item: Type=${item.type}, ID=${item.itemId}`);
                let details = null;
                try {
                    if (item.type === 'hotel') {
                        details = await Hotel.findById(item.itemId).select('name');
                    } else if (item.type === 'explore') {
                        details = await Location.findById(item.itemId).select('name');
                    }
                } catch (err) {
                    log(`    ❌ Error finding history item: ${err.message}`);
                }

                if (details) {
                    log(`    ✅ Found: ${details.name}`);
                } else {
                    log(`    ❌ NOT FOUND in DB`);
                }
            }
        }

    } catch (err) {
        log(`Script Error: ${err.message}`);
    } finally {
        log("Disconnecting...");
        await mongoose.disconnect();
    }
};

run();
