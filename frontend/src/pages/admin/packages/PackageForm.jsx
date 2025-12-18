import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { addPackage, getPackageById, updatePackage } from "../../../api/packageService";
import toast from "react-hot-toast";

export default function PackageForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, setValue } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadPackage();
        }
    }, [id]);

    const loadPackage = async () => {
        try {
            const data = await getPackageById(id);
            Object.keys(data).forEach((key) => {
                setValue(key, data[key]);
            });
        } catch (error) {
            toast.error("Failed to load package details");
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (id) {
                await updatePackage(id, data);
                toast.success("Package updated successfully");
            } else {
                await addPackage(data);
                toast.success("Package added successfully");
            }
            navigate("/admin/packages/list");
        } catch (error) {
            toast.error("Failed to save package");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {id ? "Edit Package" : "Add New Package"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Package Title</label>
                    <input
                        {...register("title", { required: true })}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g. Betla National Park Tour"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                    <input
                        {...register("duration", { required: true })}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g. 3 Days / 2 Nights"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                    <input
                        type="number"
                        {...register("price", { required: true })}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g. 8000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                        {...register("description")}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows="4"
                        placeholder="Package details..."
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                    <input
                        {...register("image")}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="https://..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                    {loading ? "Saving..." : id ? "Update Package" : "Add Package"}
                </button>
            </form>
        </div>
    );
}
