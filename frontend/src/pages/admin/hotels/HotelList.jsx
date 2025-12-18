import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHotels, deleteHotel } from "../../../api/hotelService";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import ReportModal from "../../../components/common/ReportModal";

export default function HotelList() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        loadHotels();
    }, []);

    const loadHotels = async () => {
        try {
            const data = await getHotels();
            setHotels(data);
        } catch (error) {
            toast.error("Failed to load hotels");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this hotel?")) return;
        try {
            await deleteHotel(id);
            toast.success("Hotel deleted successfully");
            loadHotels();
        } catch (error) {
            console.error("Error deleting hotel:", error);
            toast.error("Failed to delete hotel");
        }
    };

    const handleExport = async ({ format, startDate, endDate, status }) => {
        const toastId = toast.loading(`Generating ${format.toUpperCase()} report...`);

        try {
            const params = new URLSearchParams({
                format,
                startDate: startDate || '',
                endDate: endDate || '',
                status: status || 'all'
            });

            const response = await fetch(`http://localhost:5000/api/admin/reports/hotels?${params}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': format === 'pdf' ? 'application/pdf' : 'text/csv'
                }
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `hotels_report.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success('Report downloaded!', { id: toastId });
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Download failed. Check if backend is running.', { id: toastId });
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Hotels...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Hotels</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Generate Report
                    </button>
                    <Link
                        to="/admin/hotels/add"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
                    >
                        <FaPlus /> Add Hotel
                    </Link>
                </div>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onExport={handleExport}
                title="Hotel"
            />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                            <th className="p-4">Name</th>
                            <th className="p-4">Location</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotels.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">No hotels found.</td>
                            </tr>
                        ) : (
                            hotels.map((hotel) => (
                                <tr key={hotel._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-4 font-medium text-gray-800 dark:text-white">{hotel.name}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{hotel.location}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">₹{hotel.price}</td>
                                    <td className="p-4 flex gap-3">
                                        <Link
                                            to={`/admin/hotels/edit/${hotel._id}`}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(hotel._id)}
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
