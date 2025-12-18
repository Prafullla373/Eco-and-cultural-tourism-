import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLocations, deleteLocation } from "../../../api/locationService";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import ReportModal from "../../../components/common/ReportModal";

export default function LocationList({ category }) {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        loadLocations();
    }, [category]);

    const loadLocations = async () => {
        try {
            const data = await getLocations();
            // Filter based on category (eco or cultural)
            const culturalTypes = ["cultural", "temple", "heritage", "museum", "festival_spot"];
            const ecoTypes = ["eco", "wildlife", "waterfall", "trekking", "adventure"];

            const filtered = data.filter(loc => {
                if (category === "culture") return culturalTypes.includes(loc.type);
                if (category === "eco") return ecoTypes.includes(loc.type);
                return true;
            });

            setLocations(filtered);
        } catch (error) {
            toast.error("Failed to load locations");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this location?")) return;
        try {
            await deleteLocation(id);
            toast.success("Location deleted successfully");
            loadLocations();
        } catch (error) {
            toast.error("Failed to delete location");
        }
    };

    const handleExport = async ({ format, startDate, endDate, status }) => {
        try {
            toast.loading(`Generating ${format.toUpperCase()} report...`);

            const query = new URLSearchParams({ format, startDate, endDate, status, type: category }).toString();
            const url = `http://localhost:5000/api/admin/reports/locations?${query}`;

            const response = await axios.get(url, {
                responseType: 'blob',
                withCredentials: true
            });

            // Create blob URL and trigger download
            const blob = new Blob([response.data], {
                type: format === 'pdf' ? 'application/pdf' : 'text/csv'
            });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `locations_report.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            toast.dismiss();
            toast.success('Report downloaded successfully!');
        } catch (error) {
            toast.dismiss();
            toast.error('Failed to download report');
            console.error('Export error:', error);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Locations...</div>;

    const basePath = category === "culture" ? "/admin/culture" : "/admin/eco";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Manage {category === "culture" ? "Cultural" : "Eco"} Sites
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Generate Report
                    </button>
                    <Link
                        to={`${basePath}/add`}
                        className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
                    >
                        <FaPlus /> Add Site
                    </Link>
                </div>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onExport={handleExport}
                title="Location"
            />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                            <th className="p-4">Name</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">District</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">No locations found.</td>
                            </tr>
                        ) : (
                            locations.map((loc) => (
                                <tr key={loc._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-4 font-medium text-gray-800 dark:text-white">{loc.name}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300 capitalize">{loc.type.replace('_', ' ')}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{loc.district}</td>
                                    <td className="p-4 flex gap-3">
                                        <Link
                                            to={`${basePath}/edit/${loc._id}`}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(loc._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
