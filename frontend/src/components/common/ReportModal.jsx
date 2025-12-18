import { useState } from "react";
import { FaFileCsv, FaFilePdf, FaTimes, FaDownload } from "react-icons/fa";

export default function ReportModal({ isOpen, onClose, onExport, title }) {
    const [format, setFormat] = useState("csv");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("all");

    if (!isOpen) return null;

    const handleExport = () => {
        onExport({ format, startDate, endDate, status });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Generate {title} Report</h2>

                <div className="space-y-6">
                    {/* Format Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export Format</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setFormat("csv")}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${format === "csv"
                                        ? "border-green-500 bg-green-50 text-green-700"
                                        : "border-gray-200 hover:border-green-200"
                                    }`}
                            >
                                <FaFileCsv size={24} />
                                <span className="font-medium">CSV</span>
                            </button>
                            <button
                                onClick={() => setFormat("pdf")}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${format === "pdf"
                                        ? "border-red-500 bg-red-50 text-red-700"
                                        : "border-gray-200 hover:border-red-200"
                                    }`}
                            >
                                <FaFilePdf size={24} />
                                <span className="font-medium">PDF</span>
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range (Optional)</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="all">All Records</option>
                            <option value="approved">Approved Only</option>
                            <option value="pending">Pending Only</option>
                        </select>
                    </div>

                    <button
                        onClick={handleExport}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                        <FaDownload />
                        Download Report
                    </button>
                </div>
            </div>
        </div>
    );
}
