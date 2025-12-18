import { useEffect, useState } from "react";
import { fetchImages } from "../../api";
import ModernCard from "../shared/ModernCard";

const FALLBACK =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

export default function HotelsSection() {
  const [list, setList] = useState([]);

  const hotels = [
    { name: "Radisson Blu Ranchi", footer: "Ranchi", rating: 4.7 },
    { name: "Hotel BNR Chanakya", footer: "Ranchi", rating: 4.5 },
    { name: "Netarhat Prabhat Vihar", footer: "Netarhat", rating: 4.2 },
    { name: "Betla Forest Lodge", footer: "Betla", rating: 4.1 },
    { name: "Kapil Hotel Patratu", footer: "Patratu", rating: 4.4 },
    { name: "Hotel Green Horizon", footer: "Ranchi", rating: 4.3 },
  ];

  useEffect(() => {
    async function load() {
      const pool = await fetchImages("luxury hotel resort room india", 50);

      const mapped = hotels.map((h, i) => ({
        ...h,
        img: pool[i] || FALLBACK,
        link: "/hotels",
        footer: h.footer,
      }));

      setList(mapped);
    }

    load();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold mb-10 title-underline">Recommended Hotels & Stays</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {list.map((item, i) => (
          <ModernCard
            key={i}
            image={item.img}
            title={item.name}
            rating={item.rating}
            footer={item.footer}
            link={item.link}
          />
        ))}
      </div>
    </section>
  );
}
