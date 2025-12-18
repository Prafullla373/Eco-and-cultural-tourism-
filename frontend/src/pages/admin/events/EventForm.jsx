import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { addEvent, getEventById, updateEvent } from "../../../api/eventService";
import toast from "react-hot-toast";

export default function EventForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, setValue } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadEvent();
        }
    }, [id]);

    const loadEvent = async () => {
        try {
            const data = await getEventById(id);
            Object.keys(data).forEach((key) => {
                if (key === 'date') {
                    setValue(key, data[key].split('T')[0]); // Format date for input
                } else {
                    setValue(key, data[key]);
                }
            });
        } catch (error) {
            toast.error("Failed to load event details");
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (id) {
                await updateEvent(id, data);
                toast.success("Event updated successfully");
            } else {
                await addEvent(data);
                toast.success("Event added successfully");
            }
            navigate("/admin/events/list");
        } catch (error) {
            toast.error("Failed to save event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {id ? "Edit Event" : "Add New Event"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
                    <input
                        {...register("title", { required: true })}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g. Sarhul Festival"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input
                        type="date"
                        {...register("date", { required: true })}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                        {...register("description")}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows="4"
                        placeholder="Event details..."
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
                    {loading ? "Saving..." : id ? "Update Event" : "Add Event"}
                </button>
            </form>
        </div>
    );
}
