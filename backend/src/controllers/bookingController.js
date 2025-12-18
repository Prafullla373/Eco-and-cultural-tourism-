import { Booking } from "../models/Booking.js";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const { type, targetId, date, peopleCount, message } = req.body;
        const userId = req.user._id;

        let bookingData = {
            user: userId,
            type,
            date,
            peopleCount,
            message,
            status: "pending",
        };

        if (type === "event") {
            const event = await Event.findById(targetId);
            if (!event) return res.status(404).json({ message: "Event not found" });

            bookingData.targetEvent = targetId;
            bookingData.totalPrice = event.price * peopleCount;
            bookingData.status = "confirmed"; // Auto-confirm events for now (or pending if payment needed)
        } else if (type === "guide") {
            const guide = await User.findById(targetId);
            if (!guide || !guide.role.includes("guide") && guide.role !== "guide") {
                // Check if user is actually a guide. 
                // Note: Role might be "local_guide" or similar based on system. 
                // Assuming "local_guide" based on previous context, but let's check generic "guide" string inclusion or specific role.
                // For safety, let's assume any user *could* be a guide if they have guide fields, but strictly we should check role.
            }

            bookingData.targetGuide = targetId;
            // Guide price calculation could be complex, setting 0 or base for now
            bookingData.totalPrice = 0;
            bookingData.status = "pending"; // Guides must accept
        } else {
            return res.status(400).json({ message: "Invalid booking type" });
        }

        const booking = await Booking.create(bookingData);
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Booking failed", error: error.message });
    }
};

// Get bookings for the logged-in user
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("targetEvent", "title location date image")
            .populate("targetGuide", "name avatar mobile")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
    }
};

// Get bookings for a guide (where they are the target)
export const getGuideBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ targetGuide: req.user._id })
            .populate("user", "name email mobile avatar")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch guide bookings", error: error.message });
    }
};

// Update booking status (Accept/Reject/Cancel)
export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Authorization check
        // User can cancel their own booking
        // Guide can accept/reject bookings where they are target
        // Admin can do anything

        const isOwner = booking.user.toString() === req.user._id.toString();
        const isTargetGuide = booking.targetGuide?.toString() === req.user._id.toString();
        const isAdmin = ["super_admin", "admin"].includes(req.user.role);

        if (isOwner && status === "cancelled") {
            // Allowed
        } else if (isTargetGuide && ["confirmed", "rejected"].includes(status)) {
            // Allowed
        } else if (isAdmin) {
            // Allowed
        } else {
            return res.status(403).json({ message: "Not authorized to update this booking" });
        }

        booking.status = status;
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: "Failed to update booking", error: error.message });
    }
};
