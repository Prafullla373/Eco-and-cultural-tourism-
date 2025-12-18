import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { addHotel, getHotelById, updateHotel } from "../../../api/hotelService";
import toast from "react-hot-toast";

export default function HotelForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, setValue } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadHotel();
        }
    }, [id]);

    const loadHotel = async () => {
        try {
            const data = await getHotelById(id);
            // Set form values
            Object.keys(data).forEach((key) => {
                setValue(key, data[key]);
            });
        } catch (error) {
            toast.error("Failed to load hotel details");
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (id) {
                await updateHotel(id, data);
                toast.success("Hotel updated successfully");
            } else {
                await addHotel(data);
                toast.success("Hotel added successfully");
            }
            navigate("/admin/hotels/list");
        } catch (error) {
            toast.error("Failed to save hotel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {id ? "Edit Hotel" : "Add New Hotel"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hotel Name</label>
                    <input
                        {...register("name", { required: true })}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g. Radisson Blu"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                    <input
                        {...register("location", { required: true })}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g. Ranchi"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (per night)</label>
                    <input
                        type="number"
                        {...register("price", { required: true })}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g. 5000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                        {...register("description")}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows="4"
                        placeholder="Hotel description..."
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
                    {loading ? "Saving..." : id ? "Update Hotel" : "Add Hotel"}
                </button>
            </form>
        </div>
    );
}
