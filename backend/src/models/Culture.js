import mongoose from "mongoose";

const cultureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["Dance", "Music", "Festival", "Art", "Cuisine", "Guide", "Tradition"],
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    history: {
        type: String,
    },
    significance: {
        type: String,
    },
    images: [{
        type: String,
        required: true,
    }],
    videoUrl: {
        type: String,
    },
    location: {
        type: String, // e.g., "Chota Nagpur Plateau"
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Culture", cultureSchema);
