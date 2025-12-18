import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        date: { type: Date, required: true },
        location: { type: String, required: true },
        image: { type: String }, // Keep for backward compatibility or thumbnail
        images: [String], // Gallery

        category: {
            type: String,
            enum: ["festival", "music", "dance", "art", "fair", "food", "workshop", "other"],
            default: "other"
        },
        tags: [String],

        price: { type: Number, default: 0 },
        ticketsSold: { type: Number, default: 0 },
        totalTickets: { type: Number, default: 100 },
        isActive: { type: Boolean, default: true },

        // Approval System
        isApproved: { type: Boolean, default: false },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
