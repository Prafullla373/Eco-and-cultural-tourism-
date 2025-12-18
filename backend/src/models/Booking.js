import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["event", "guide"], required: true },

        // Target can be an Event ID or a User ID (for Guide)
        targetEvent: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
        targetGuide: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        date: { type: Date, required: true },
        peopleCount: { type: Number, default: 1 },
        totalPrice: { type: Number, default: 0 },

        status: {
            type: String,
            enum: ["pending", "confirmed", "rejected", "cancelled", "completed"],
            default: "pending",
        },

        // For Guide Booking: Message from user
        message: { type: String },

        // Payment Info (Placeholder)
        paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
        paymentId: { type: String },
    },
    { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
