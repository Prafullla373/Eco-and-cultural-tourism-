import { useState, useEffect } from "react";
import axios from "axios";
import CulturalHero from "../../components/culture/CulturalHero";
import CulturalSearch from "../../components/culture/CulturalSearch";
import CulturalGrid from "../../components/culture/CulturalGrid";

export default function CulturalPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        location: "All",
        category: "All",
    });

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams(filters).toString();
            const res = await axios.get(`http://localhost:5000/api/culture?${query}`);
            setItems(res.data);
        } catch (error) {
            console.error("Failed to fetch culture data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (cat) => {
        setFilters({ ...filters, category: cat });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            <CulturalHero onCategoryClick={handleCategoryClick} />
            <CulturalSearch filters={filters} setFilters={setFilters} />
            <CulturalGrid items={items} loading={loading} />
        </div>
    );
}
