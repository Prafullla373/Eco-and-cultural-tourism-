import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaHotel, FaTree, FaLandmark, FaBoxOpen, FaChartBar, FaChartPie, FaCalendarAlt } from "react-icons/fa";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState("bar");

    const [pending, setPending] = useState({ hotels: [], packages: [], events: [], locations: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await axios.get("http://localhost:5000/api/admin/dashboard-stats", { withCredentials: true });
                setStats(statsRes.data);

                const pendingRes = await axios.get("http://localhost:5000/api/admin/pending-approvals", { withCredentials: true });
                setPending(pendingRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleApprove = async (type, id) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/approve/${type}/${id}`, {}, { withCredentials: true });
            // Refresh pending list locally
            setPending(prev => ({
                ...prev,
                [type + "s"]: prev[type + "s"].filter(item => item._id !== id) // Assuming plural keys in state match
            }));
            // Note: API returns keys like 'hotels', 'packages'. My simple pluralization logic above might need adjustment if keys don't match exactly.
            // Actually the API returns 'hotels', 'packages', 'events', 'locations'.
            // So type 'hotel' -> 'hotels'.
        } catch (error) {
            console.error("Approval error:", error);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

    const systemData = {
        // ... (same as before)
        labels: ["Hotels", "Packages", "Admins", "Users", "Eco Spots", "Cultural Sites"],
        datasets: [
            {
                label: "Count",
                data: [
                    stats?.totalHotels || 0,
                    stats?.totalPackages || 0,
                    stats?.totalAdmins || 0,
                    stats?.totalUsers || 0,
                    stats?.totalEcoSpots || 0,
                    stats?.totalCulturalSpots || 0
                ],
                backgroundColor: [
                    "#10B981", // Emerald
                    "#F59E0B", // Amber
                    "#3B82F6", // Blue
                    "#6366F1", // Indigo
                    "#059669", // Green
                    "#D97706"  // Orange
                ],
                borderWidth: 1,
            },
        ],
    };

    const eventData = {
        labels: ["Upcoming", "Completed", "Cancelled"],
        datasets: [
            {
                data: [stats?.upcomingEvents || 5, 12, 2], // Mocking some event status data
                backgroundColor: ["#3B82F6", "#10B981", "#EF4444"],
            }
        ]
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h2>
                    <p className="text-gray-500 text-sm">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setChartType("bar")}
                        className={`p-2 rounded-md transition-all ${chartType === "bar" ? "bg-green-100 text-green-700" : "text-gray-500 hover:bg-gray-100"}`}
                        title="Bar Chart"
                    >
                        <FaChartBar />
                    </button>
                    <button
                        onClick={() => setChartType("pie")}
                        className={`p-2 rounded-md transition-all ${chartType === "pie" ? "bg-green-100 text-green-700" : "text-gray-500 hover:bg-gray-100"}`}
                        title="Pie Chart"
                    >
                        <FaChartPie />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={FaUsers} title="Total Users" value={stats?.totalUsers} color="bg-gradient-to-r from-blue-500 to-blue-600" />
                <StatCard icon={FaHotel} title="Hotels" value={stats?.totalHotels} color="bg-gradient-to-r from-emerald-500 to-emerald-600" />
                <StatCard icon={FaBoxOpen} title="Packages" value={stats?.totalPackages} color="bg-gradient-to-r from-amber-500 to-amber-600" />
                <StatCard icon={FaCalendarAlt} title="Events" value={stats?.totalEvents || 0} color="bg-gradient-to-r from-purple-500 to-purple-600" />
            </div>

            {/* Pending Approvals Section */}
            {(pending.hotels.length > 0 || pending.packages.length > 0 || pending.events.length > 0 || pending.locations.length > 0) && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-orange-200 dark:border-orange-900">
                    <h3 className="font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        Pending Approvals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pending.hotels.map(item => (
                            <ApprovalCard key={item._id} type="hotel" item={item} onApprove={handleApprove} />
                        ))}
                        {pending.packages.map(item => (
                            <ApprovalCard key={item._id} type="package" item={item} onApprove={handleApprove} />
                        ))}
                        {pending.events.map(item => (
                            <ApprovalCard key={item._id} type="event" item={item} onApprove={handleApprove} />
                        ))}
                        {pending.locations.map(item => (
                            <ApprovalCard key={item._id} type="location" item={item} onApprove={handleApprove} />
                        ))}
                    </div>
                </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold mb-6 text-gray-800 dark:text-white">System Distribution</h3>
                    <div className="h-80 flex items-center justify-center">
                        {chartType === "bar" ? (
                            <Bar data={systemData} options={{ responsive: true, maintainAspectRatio: false }} />
                        ) : (
                            <div className="w-80">
                                <Pie data={systemData} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold mb-6 text-gray-800 dark:text-white">Event Status</h3>
                    <div className="h-64 flex items-center justify-center">
                        <Doughnut data={eventData} options={{ cutout: "70%" }} />
                    </div>
                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Upcoming</span>
                            <span className="font-semibold dark:text-white">{stats?.upcomingEvents || 5}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><span className="w-3 h-3 rounded-full bg-green-500"></span> Completed</span>
                            <span className="font-semibold dark:text-white">12</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><span className="w-3 h-3 rounded-full bg-red-500"></span> Cancelled</span>
                            <span className="font-semibold dark:text-white">2</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ApprovalCard({ type, item, onApprove }) {
    return (
        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
            <div>
                <p className="font-medium text-sm text-gray-800 dark:text-white">{item.name || item.title}</p>
                <p className="text-xs text-gray-500 capitalize">{type}</p>
            </div>
            <button
                onClick={() => onApprove(type, item._id)}
                className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition"
            >
                Approve
            </button>
        </div>
    );
}

function StatCard({ icon: Icon, title, value, color }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className={`p-4 rounded-xl text-white ${color} shadow-lg shadow-gray-200 dark:shadow-none`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value || 0}</h3>
            </div>
        </div>
    );
}
