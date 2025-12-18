import { 
  FaWater, 
  FaTree, 
  FaMountain, 
  FaLeaf, 
  FaUsers, 
  FaGifts 
} from "react-icons/fa";

export default function WhyJharkhand() {
  const items = [
    {
      icon: <FaWater className="text-blue-500 text-3xl" />,
      title: "Land of Majestic Waterfalls",
      desc: "Jharkhand is home to India’s most breathtaking waterfalls like Hundru, Dassam & Jonha — perfect for nature enthusiasts.",
    },
    {
      icon: <FaMountain className="text-amber-600 text-3xl" />,
      title: "Beautiful Hills & Valleys",
      desc: "From Netarhat’s sunrise points to Patratu Valley’s scenic curves, Jharkhand offers incredible mountain experiences.",
    },
    {
      icon: <FaTree className="text-green-600 text-3xl" />,
      title: "Rich Wildlife & Forests",
      desc: "Betla National Park, Palamu Tiger Reserve & dense sal forests attract wildlife lovers and adventure seekers.",
    },
    {
      icon: <FaUsers className="text-purple-600 text-3xl" />,
      title: "Unique Tribal Culture",
      desc: "Experience tribal traditions, dance forms, handicrafts, and the vibrant lifestyle of 32 indigenous tribes.",
    },
    {
  icon: <FaGifts className="text-pink-500 text-3xl" />,
  title: "Colorful Festivals & Traditions",
  desc: "From Sarhul to Karma Puja, Jharkhand celebrates festivals that reflect nature, unity & rich cultural heritage.",
},
,
    {
      icon: <FaLeaf className="text-emerald-500 text-3xl" />,
      title: "Eco-Tourism Destination",
      desc: "Jharkhand promotes sustainable tourism with forest resorts, eco-trails, tribal stays & adventure activities.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Heading */}
      <h2 className="text-4xl font-bold text-center mb-14 title-underline">
        Why Visit Jharkhand?
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white p-7 rounded-2xl shadow-md border border-gray-200 
                       hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Icon */}
            <div className="mb-4 p-4 inline-flex items-center justify-center 
                           bg-gray-100 rounded-xl group-hover:bg-primary transition-all duration-300">
              {item.icon}
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>

            <p className="text-gray-600 leading-relaxed text-sm">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
