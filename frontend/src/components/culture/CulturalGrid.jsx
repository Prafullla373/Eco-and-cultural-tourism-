import CulturalCard from "./CulturalCard";

export default function CulturalGrid({ items, loading }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-10 pb-20">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div key={n} className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-80 animate-pulse" />
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">
                <p className="text-xl">No cultural items found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-10 pb-20">
            {items.map((item) => (
                <CulturalCard key={item._id} item={item} />
            ))}
        </div>
    );
}
