import { useEffect, useState } from "react";
import { fetchImages } from "../../api";
import ModernCard from "../shared/ModernCard";

const FALLBACK =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80";

export default function PopularAttractionsSection() {
  const [list, setList] = useState([]);

  const attractions = [
    {
      name: "Netarhat",
      desc: "The ‘Queen of Chotanagpur’ known for incredible sunrise & sunset.",
    },
    {
      name: "Hundru Falls",
      desc: "One of Jharkhand’s most powerful and scenic waterfalls.",
    },
    {
      name: "Dassam Falls",
      desc: "Crystal-clear cascading waterfall surrounded by dense forests.",
    },
    {
      name: "Patratu Valley",
      desc: "India’s most beautiful curved mountain valley road.",
    },
    {
      name: "Parasnath Hills",
      desc: "Holy Jain pilgrimage site and highest peak in Jharkhand.",
    },
    {
      name: "Betla National Park",
      desc: "Wildlife sanctuary famous for elephants & forest safaris.",
    },
  ];

  useEffect(() => {
    async function load() {
      const pool = await fetchImages(
        "india landscapes waterfalls hills forest travel tourism",
        50
      );

      const mapped = attractions.map((a, i) => ({
        ...a,
        img: pool[i] || FALLBACK,
        link: `/explore?place=${a.name.toLowerCase().replace(/\s+/g, "-")}`,
      }));

      setList(mapped);
    }

    load();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold mb-10 title-underline">Popular Attractions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {list.map((item, i) => (
          <ModernCard
            key={i}
            image={item.img}
            title={item.name}
            description={item.desc}
            link={item.link}
            footer="View Details"
          />
        ))}
      </div>
    </section>
  );
}
