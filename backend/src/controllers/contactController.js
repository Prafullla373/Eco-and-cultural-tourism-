import ContactMessage from "../models/ContactMessage.js";

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Private
export const submitMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newMessage = await ContactMessage.create({
            user: req.user._id,
            name,
            email,
            subject,
            message,
        });

        res.status(201).json({
            message: "Message sent successfully",
            data: newMessage,
        });
    } catch (error) {
        console.error("Error submitting contact message:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
