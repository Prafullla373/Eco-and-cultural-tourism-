import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash, FaUserPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import ReportModal from "../../components/common/ReportModal";

export default function ManageAdmins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset } = useForm();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const fetchAdmins = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/users", { withCredentials: true });
            setAdmins(res.data);
        } catch (error) {
            toast.error("Failed to fetch admins");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const onSubmit = async (data) => {
        try {
            await axios.post("http://localhost:5000/api/admin/users", data, { withCredentials: true });
            toast.success("Admin created successfully");
            reset();
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create admin");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this admin?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { withCredentials: true });
            toast.success("Admin deleted");
            fetchAdmins();
        } catch (error) {
            toast.error("Failed to delete admin");
        }
    };

    const handleExport = async ({ format, startDate, endDate, status }) => {
        try {
            toast.loading(`Generating ${format.toUpperCase()} report...`);

            const query = new URLSearchParams({ format, startDate, endDate, status }).toString();
            const url = `http://localhost:5000/api/admin/reports/users?${query}`;

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
            link.download = `users_report.${format}`;
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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Manage Admins</h2>
                <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Generate Report
                </button>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onExport={handleExport}
                title="User"
            />

            {/* Create Admin Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><FaUserPlus /> Add New Admin</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input {...register("name", { required: true })} placeholder="Name" className="p-2 border rounded" />
                    <input {...register("email", { required: true })} placeholder="Email" className="p-2 border rounded" />
                    <input {...register("password", { required: true })} type="password" placeholder="Password" className="p-2 border rounded" />
                    <input {...register("mobile", { required: true })} placeholder="Mobile" className="p-2 border rounded" />
                    <select {...register("role", { required: true })} className="p-2 border rounded">
                        <option value="hotel_manager">Hotel Manager</option>
                        <option value="package_manager">Package Manager</option>
                        <option value="event_manager">Event Manager</option>
                        <option value="cultural_manager">Cultural Manager</option>
                        <option value="eco_manager">Eco Manager</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                    <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">Create Admin</button>
                </form>
            </div>

            {/* Admin List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin._id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{admin.name}</td>
                                <td className="p-4">{admin.email}</td>
                                <td className="p-4 capitalize">{admin.role.replace("_", " ")}</td>
                                <td className="p-4">
                                    <button onClick={() => handleDelete(admin._id)} className="text-red-500 hover:text-red-700">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
