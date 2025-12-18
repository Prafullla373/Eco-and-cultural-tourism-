import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.resolve("backend", ".env") });

async function checkUser() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is undefined. Check .env path.");
        }
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: "psp@gmail.com" });

        let output = "";
        if (user) {
            output = `User found: ${JSON.stringify(user, null, 2)}`;
        } else {
            output = "User psp@gmail.com not found";
        }

        fs.writeFileSync("user_check_output.txt", output);
        process.exit();
    } catch (err) {
        fs.writeFileSync("user_check_output.txt", `Error: ${err.message}`);
        process.exit(1);
    }
}

checkUser();
