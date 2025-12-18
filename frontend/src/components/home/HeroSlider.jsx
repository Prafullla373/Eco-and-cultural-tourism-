import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

export default function HeroSlider() {
  // ⭐ 7 Distinct Categories with High-Quality Images
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?q=80&w=1920&auto=format&fit=crop", // Nature (Betla/Forest)
      title: "Untamed Nature",
      desc: "Explore the lush green forests and national parks of Jharkhand.",
      category: "nature"
    },
    {
      image: "https://images.unsplash.com/photo-1516214104703-d870798883c5?q=80&w=1920&auto=format&fit=crop", // Culture (Tribal/Dance)
      title: "Vibrant Culture",
      desc: "Immerse yourself in the rich tribal heritage and art forms.",
      category: "culture"
    },
    {
      image: "https://images.unsplash.com/photo-1623941000298-5b481629d38f?q=80&w=1920&auto=format&fit=crop", // Religious (Temple)
      title: "Spiritual Journeys",
      desc: "Find peace at ancient temples and sacred pilgrimage sites.",
      category: "religious"
    },
    {
      image: "https://images.unsplash.com/photo-1581852017103-68accd557cc7?q=80&w=1920&auto=format&fit=crop", // Wildlife (Elephant)
      title: "Wild Encounters",
      desc: "Witness majestic elephants and wildlife in their natural habitat.",
      category: "wildlife"
    },
    {
      image: "https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?q=80&w=1920&auto=format&fit=crop", // Dams (Water/Scenic)
      title: "Serene Dams",
      desc: "Relax by the tranquil waters of Patratu, Maithon, and Tilaiya.",
      category: "dams"
    },
    {
      image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1920&auto=format&fit=crop", // Waterfalls
      title: "Majestic Waterfalls",
      desc: "Feel the mist of Hundru, Dassam, and Jonha falls.",
      category: "waterfalls"
    },
    {
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb02b8?q=80&w=1920&auto=format&fit=crop", // Heritage (Terracotta/Forts)
      title: "Timeless Heritage",
      desc: "Discover the terracotta temples of Maluti and historic forts.",
      category: "heritage"
    }
  ];

  return (
    <div className="w-full h-[85vh] relative group">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        speed={1000}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-in-out transform scale-100 hover:scale-105"
                style={{ backgroundImage: `url(${slide.image})` }}
              ></div>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-20">
                <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 text-amber-300 text-sm font-bold tracking-wider uppercase mb-4 backdrop-blur-md border border-amber-500/30 animate-fadeIn">
                  {slide.category}
                </span>

                <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl tracking-tight leading-tight max-w-4xl">
                  {slide.title}
                </h1>

                <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl font-light drop-shadow-md">
                  {slide.desc}
                </p>

                <div className="flex gap-4">
                  <Link
                    to={`/explore?category=${slide.category}`}
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
                  >
                    Explore Now
                  </Link>
                  <Link
                    to="/packages"
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-full backdrop-blur-md border border-white/30 transition-all transform hover:-translate-y-1"
                  >
                    View Packages
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom CSS for Swiper Navigation/Pagination to match theme */}
      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          color: #ffffff;
          transform: scale(1.1);
        }
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #10b981; /* Emerald 500 */
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
