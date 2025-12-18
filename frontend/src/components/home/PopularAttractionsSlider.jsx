import { useEffect, useState } from "react";
import { fetchImages } from "../../api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

export default function PopularAttractionsSlider() {
  const [attractions, setAttractions] = useState([]);

  const places = [
    "Netarhat Jharkhand",
    "Hundru Falls Jharkhand",
    "Dassam Falls Ranchi",
    "Patratu Valley Ranchi",
    "Parasnath Hill Jain",
    "Betla National Park Jharkhand",
    "Kiriburu Sunsets Jharkhand",
    "Jonha Falls Ranchi"
  ];

  useEffect(() => {
    async function load() {
      let list = [];

      for (let name of places) {
        const imgs = await fetchImages(name, 1);

        if (imgs.length > 0) {
          list.push({
            title: name.replace("Jharkhand", "").replace("Ranchi", "").trim(),
            img: imgs[0].urls.small
          });
        }
      }

      setAttractions(list);
    }

    load();
  }, []);

  if (attractions.length === 0) {
    return <div className="h-40 bg-gray-200 animate-pulse rounded-xl"></div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h2 className="text-3xl font-heading text-center mb-8">Popular Attractions</h2>

      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="w-full"
      >
        {attractions.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer">
              <img src={item.img} className="h-48 w-full object-cover" alt={item.title} />
              <div className="p-3 text-center font-heading text-lg">
                {item.title}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
