import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, deleteEvent } from "../../../api/eventService";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import ReportModal from "../../../components/common/ReportModal";

export default function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await getEvents();
            setEvents(data);
        } catch (error) {
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEvent(id);
            toast.success("Event deleted successfully");
            loadEvents();
        } catch (error) {
            toast.error("Failed to delete event");
        }
    };

    const handleExport = async ({ format, startDate, endDate, status }) => {
        try {
            toast.loading(`Generating ${format.toUpperCase()} report...`);

            const query = new URLSearchParams({ format, startDate, endDate, status }).toString();
            const url = `http://localhost:5000/api/admin/reports/events?${query}`;

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
            link.download = `events_report.${format}`;
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

    if (loading) return <div className="p-10 text-center">Loading Events...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Events</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Generate Report
                    </button>
                    <Link
                        to="/admin/events/add"
                        className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
                    >
                        <FaPlus /> Add Event
                    </Link>
                </div>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onExport={handleExport}
                title="Event"
            />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                            <th className="p-4">Title</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Location</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">No events found.</td>
                            </tr>
                        ) : (
                            events.map((event) => (
                                <tr key={event._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-4 font-medium text-gray-800 dark:text-white">{event.title}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{event.location}</td>
                                    <td className="p-4 flex gap-3">
                                        <Link
                                            to={`/admin/events/edit/${event._id}`}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(event._id)}
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
