import { useEffect, useState } from "react";
import { fetchImages } from "../../api";
import ModernCard from "../shared/ModernCard";

const FALLBACK =
  "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80";

export default function FeaturedPackagesSection() {
  const [list, setList] = useState([]);

  const data = [
    {
      name: "Netarhat Weekend Trip",
      description: "2 days trip covering sunrise point, Upperghat view, and Pine forest eco-trails.",
      price: "₹2,999 / person",
    },
    {
      name: "Ranchi Waterfall Trail",
      description: "Explore Hundru, Dassam, Jonha waterfalls in a full-day guided trip.",
      price: "₹1,499 / person",
    },
    {
      name: "Patratu Valley Scenic Drive",
      description: "A stunning road trip through India's most beautiful valley curves.",
      price: "₹999 / person",
    },
    {
      name: "Parasnath Hill Pilgrimage",
      description: "Spiritual trek to Shikharji with temple visits & local cultural experiences.",
      price: "₹3,499 / person",
    },
    {
      name: "Betla Wildlife Safari",
      description: "Jungle safari, wildlife spotting & stay inside Betla National Park.",
      price: "₹6,499 / person",
    },
    {
      name: "Eco Tribal Experience",
      description: "Village tour, tribal dance, handicraft workshop & local food experience.",
      price: "₹3,999 / person",
    },
  ];

  useEffect(() => {
    async function load() {
      const pool = await fetchImages("india travel hills safari waterfalls cultural", 50);

      const mapped = data.map((p, i) => ({
        ...p,
        img: pool[i] || FALLBACK,
        link: "/packages",
        footer: "View Details",
      }));

      setList(mapped);
    }

    load();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold mb-10 title-underline">Featured Packages</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {list.map((item, i) => (
          <ModernCard
            key={i}
            image={item.img}
            title={item.name}
            description={item.description}
            price={item.price}
            link={item.link}
            footer="View Details"
          />
        ))}
      </div>
    </section>
  );
}
