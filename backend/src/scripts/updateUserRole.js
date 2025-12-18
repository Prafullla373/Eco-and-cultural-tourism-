import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import path from "path";

dotenv.config({ path: path.resolve("backend", ".env") });

async function updateRole() {
    try {
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
        await mongoose.connect(process.env.MONGO_URI);

        const res = await User.updateOne(
            { email: "psp@gmail.com" },
            { $set: { role: "super_admin" } }
        );

        console.log("Update result:", res);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateRole();
