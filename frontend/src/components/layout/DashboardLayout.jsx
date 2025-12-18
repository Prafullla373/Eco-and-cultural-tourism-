import { useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    FaChartPie, FaHotel, FaTree, FaLandmark, FaBoxOpen, FaCalendarAlt,
    FaUsers, FaSignOutAlt, FaBars, FaTimes, FaUser
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const SIDEBAR_LINKS = [
    { path: "/admin/dashboard", label: "Overview", icon: FaChartPie, roles: ["super_admin", "hotel_manager", "cultural_manager", "eco_manager", "event_manager", "package_manager"] },
    { path: "/admin/users", label: "Manage Admins", icon: FaUsers, roles: ["super_admin"] },
    { path: "/admin/hotels", label: "Hotels", icon: FaHotel, roles: ["super_admin", "hotel_manager"] },
    { path: "/admin/culture", label: "Cultural Spots", icon: FaLandmark, roles: ["super_admin", "cultural_manager"] },
    { path: "/admin/eco", label: "Eco Tourism", icon: FaTree, roles: ["super_admin", "eco_manager"] },
    { path: "/admin/packages", label: "Packages", icon: FaBoxOpen, roles: ["super_admin", "package_manager"] },
    { path: "/admin/events", label: "Events", icon: FaCalendarAlt, roles: ["super_admin", "event_manager"] },
    { path: "/admin/profile", label: "My Profile", icon: FaUser, roles: ["super_admin", "hotel_manager", "cultural_manager", "eco_manager", "event_manager", "package_manager"] },
];

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await logout();
        navigate("/admin/login");
    };

    const filteredLinks = SIDEBAR_LINKS.filter(link => link.roles.includes(user?.role));

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 260, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="bg-green-900 text-white flex-shrink-0 overflow-hidden h-screen sticky top-0 shadow-xl z-20"
                    >
                        <div className="p-6 flex items-center gap-3 border-b border-green-800">
                            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full bg-white" />
                            <div>
                                <h1 className="font-bold text-lg leading-tight">Jharkhand Tourism</h1>
                                <p className="text-xs text-green-300">Admin Portal</p>
                            </div>
                        </div>

                        <nav className="mt-6 px-4 space-y-2">
                            {filteredLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? "bg-green-700 text-white shadow-md"
                                            : "text-green-100 hover:bg-green-800 hover:text-white"
                                            }`}
                                    >
                                        <link.icon size={20} />
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="absolute bottom-0 w-full p-4 border-t border-green-800 bg-green-900">
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-lg font-bold overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0)
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-medium truncate">{user?.name}</p>
                                    <p className="text-xs text-green-300 capitalize">{user?.role?.replace("_", " ")}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full px-4 py-2 text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-10">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-600 hover:text-green-700 transition-colors"
                    >
                        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>

                    <div className="flex items-center gap-4">
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                            {user?.role?.replace("_", " ")}
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
