import { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxOpen, FaMapMarkedAlt, FaRupeeSign, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function PackageManagerDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/admin/dashboard-stats", {
                    withCredentials: true,
                });
                setStats(res.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Package Manager Overview</h2>
                <Link
                    to="/admin/packages/add"
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
                >
                    <FaPlus /> Add Package
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={FaBoxOpen} title="Total Packages" value={stats?.totalPackages || 0} color="bg-blue-500" />
                <StatCard icon={FaMapMarkedAlt} title="Active Bookings" value="12" color="bg-green-500" />
                <StatCard icon={FaRupeeSign} title="Total Revenue" value="₹1.2L" color="bg-yellow-500" />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Package Management</h3>
                    <Link to="/admin/packages/list" className="text-primary hover:underline">View All Packages</Link>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Create and manage tour packages, update itineraries, and track bookings.</p>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, title, value, color }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className={`p-4 rounded-full text-white ${color} shadow-lg shadow-gray-200 dark:shadow-none`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
            </div>
        </div>
    );
}
