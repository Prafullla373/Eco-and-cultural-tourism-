import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { addLocation, getLocationById, updateLocation } from "../../../api/locationService";
import toast from "react-hot-toast";

export default function LocationForm({ category }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, setValue } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadLocation();
        }
    }, [id]);

    const loadLocation = async () => {
        try {
            const data = await getLocationById(id);
            Object.keys(data).forEach((key) => {
                setValue(key, data[key]);
            });
        } catch (error) {
            toast.error("Failed to load location details");
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (id) {
                await updateLocation(id, data);
                toast.success("Location updated successfully");
            } else {
                await addLocation(data);
                toast.success("Location added successfully");
            }
            navigate(category === "culture" ? "/admin/culture/list" : "/admin/eco/list");
        } catch (error) {
            toast.error("Failed to save location");
        } finally {
            setLoading(false);
        }
    };

    const culturalTypes = ["cultural", "temple", "heritage", "museum", "festival_spot"];
    const ecoTypes = ["eco", "wildlife", "waterfall", "trekking", "adventure"];
    const availableTypes = category === "culture" ? culturalTypes : ecoTypes;

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {id ? "Edit Site" : "Add New Site"} ({category === "culture" ? "Cultural" : "Eco"})
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input
                        {...register("name", { required: true })}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g. Jagannath Temple"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (Unique ID)</label>
                    <input
                        {...register("slug", { required: true })}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g. jagannath-temple-ranchi"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select
                        {...register("type", { required: true })}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white capitalize"
                    >
                        <option value="">Select Type</option>
                        {availableTypes.map(type => (
                            <option key={type} value={type}>{type.replace('_', ' ')}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
                    <input
                        {...register("district")}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g. Ranchi"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                        {...register("description")}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows="4"
                        placeholder="Site details..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                    {loading ? "Saving..." : id ? "Update Site" : "Add Site"}
                </button>
            </form>
        </div>
    );
}
