// backend/src/controllers/dashboardController.js
import { User } from "../models/User.js";
import Hotel from "../models/Hotel.js";
import { Location } from "../models/Location.js"; // Eco & Cultural spots might be here or separate
import { Package } from "../models/Package.js";
import { Event } from "../models/Event.js";
import { ROLES } from "../utils/roleConstants.js";

export const getDashboardStats = async (req, res) => {
    try {
        const { role } = req.user;
        let stats = {};

        switch (role) {
            case ROLES.SUPER_ADMIN:
                stats = await getSuperAdminStats();
                break;
            case ROLES.HOTEL_MANAGER:
                stats = await getHotelManagerStats();
                break;
            case ROLES.CULTURAL_MANAGER:
                stats = await getCulturalManagerStats();
                break;
            case ROLES.ECO_MANAGER:
                stats = await getEcoManagerStats();
                break;
            case ROLES.EVENT_MANAGER:
                stats = await getEventManagerStats();
                break;
            case ROLES.PACKAGE_MANAGER:
                stats = await getPackageManagerStats();
                break;
            default:
                return res.status(403).json({ message: "Unauthorized role for dashboard" });
        }

        res.json(stats);
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// --- Helper Functions ---

const getSuperAdminStats = async () => {
    const totalUsers = await User.countDocuments({ role: ROLES.USER });
    const totalAdmins = await User.countDocuments({ role: { $ne: ROLES.USER } });
    const totalHotels = await Hotel.countDocuments();
    const totalPackages = await Package.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalEcoSpots = await Location.countDocuments({ type: 'eco' });

    return {
        totalUsers,
        totalAdmins,
        totalHotels,
        totalPackages,
        totalEvents,
        totalEcoSpots,
        recentActivity: [],
    };
};

const getHotelManagerStats = async () => {
    const totalHotels = await Hotel.countDocuments();
    // In a real app, we'd filter by manager ID if hotels were assigned to specific managers
    return {
        totalHotels,
        occupancyRate: 75, // Still dummy as we don't have booking data yet
        hotelTypes: { Luxury: await Hotel.countDocuments({ price: { $gt: 5000 } }), Budget: await Hotel.countDocuments({ price: { $lte: 5000 } }) },
    };
};

const getCulturalManagerStats = async () => {
    const totalCulturalSpots = await Location.countDocuments({ type: 'cultural' });
    return {
        totalCulturalSpots,
        visitorsGrowth: [10, 20, 15, 30, 40], // Dummy
    };
};

const getEcoManagerStats = async () => {
    const totalEcoSpots = await Location.countDocuments({ type: 'eco' });
    return {
        totalEcoSpots,
        biodiversityStats: { Flora: 120, Fauna: 80 }, // Dummy
    };
};

const getEventManagerStats = async () => {
    const totalEvents = await Event.countDocuments();
    return {
        totalEvents,
        upcomingEvents: await Event.countDocuments({ date: { $gte: new Date() } }),
        ticketBookings: [50, 80, 60, 90], // Dummy
    };
};

const getPackageManagerStats = async () => {
    const totalPackages = await Package.countDocuments();
    return {
        totalPackages,
        popularDestinations: ["Betla", "Netarhat"], // Dummy
    };
};
