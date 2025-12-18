import { useState, useEffect } from "react";

// Y
import video1 from "../../assets/explore/vdo1.mp4";
import video2 from "../../assets/explore/vdo2.mp4";
import video3 from "../../assets/explore/vdo4.mp4";
import img1 from "../../assets/explore/img1.jpg";
import video4 from "../../assets/explore/vdo5.mp4";
import img2 from "../../assets/explore/img2.jpg";

export default function ExploreHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { type: "video", src: video1 },
    { type: "video", src: video2 },
    { type: "video", src: video3 },
    { type: "video", src: video4 },
    { type: "image", src: img1 },
    { type: "image", src: img2 },
  ];

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[60vh] w-full overflow-hidden rounded-2xl mb-12 shadow-lg">

      {/* SLIDES */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {slide.type === "video" ? (
            <video
              src={slide.src}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={slide.src}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {/* OVERLAY (lighter now) */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* TEXT CONTENT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-white text-5xl font-bold drop-shadow-lg mb-4">
          Explore Jharkhand
        </h1>

        <p className="text-gray-200 text-lg max-w-2xl">
          Discover waterfalls, hills, culture, wildlife, heritage and more.
        </p>
      </div>
    </section>
  );
}