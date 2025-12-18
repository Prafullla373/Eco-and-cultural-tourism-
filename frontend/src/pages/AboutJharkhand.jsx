import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaTree, FaDrum, FaOm, FaHiking, FaMapMarkedAlt, FaHistory, FaPaw, FaUtensils, FaPalette, FaMusic, FaMountain, FaUsers } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

export default function AboutJharkhand() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const heroSlides = [
    "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?q=80&w=1920&auto=format&fit=crop", // Forest
    "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1920&auto=format&fit=crop", // Waterfall
    "https://images.unsplash.com/photo-1516214104703-d870798883c5?q=80&w=1920&auto=format&fit=crop"  // Culture
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section with Swiper */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          speed={1000}
          className="h-full w-full"
        >
          {heroSlides.map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${img}')` }}
              ></div>
              <div className="absolute inset-0 bg-black/50"></div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg"
          >
            The Land of Forests
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl"
          >
            Discover the untold stories, ancient culture, and raw beauty of Jharkhand.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">

        {/* Introduction */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Welcome to Jharkhand
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Jharkhand, meaning <span className="font-semibold text-primary">"The Land of Forests"</span>, is a state in eastern India carved out of the southern part of Bihar in 2000. Known for its waterfalls, hills, and holy places, it is a hidden gem for travelers seeking authenticity. From the dense forests of Betla to the sacred peak of Parasnath, Jharkhand offers a unique blend of nature, spirituality, and tribal heritage.
          </p>
        </motion.section>

        {/* Highlights Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Why Visit Jharkhand?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FaTree, title: "Nature", desc: "Home to lush forests, national parks, and rich biodiversity.", color: "text-green-600" },
              { icon: FaDrum, title: "Culture", desc: "Experience vibrant tribal festivals, dance, and art forms.", color: "text-orange-500" },
              { icon: FaOm, title: "Spirituality", desc: "A pilgrimage hub with ancient temples and sacred sites.", color: "text-yellow-500" },
              { icon: FaHiking, title: "Adventure", desc: "Trekking, camping, and water sports for thrill-seekers.", color: "text-blue-500" },
              { icon: FaPaw, title: "Wildlife", desc: "Spot elephants, tigers, and deer in their natural habitat.", color: "text-emerald-600" },
              { icon: FaUtensils, title: "Cuisine", desc: "Savor local delicacies like Dhuska, Litti Chokha, and Pitha.", color: "text-red-500" },
              { icon: FaPalette, title: "Arts & Crafts", desc: "Famous for Sohrai paintings, bamboo crafts, and metal work.", color: "text-purple-500" }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center group"
              >
                <item.icon className={`text-5xl mx-auto mb-6 ${item.color} group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* History & Heritage (Image Left) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1623941000298-5b481629d38f?q=80&w=1000&auto=format&fit=crop" // Reliable Temple/History Image
              alt="Jharkhand Heritage"
              className="rounded-2xl shadow-2xl w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="flex items-center gap-3 text-primary font-semibold uppercase tracking-wider">
              <FaHistory /> History & Heritage
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              A Legacy of Resilience
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Jharkhand has a rich history of resistance and resilience. It was the center of the **Santhal Rebellion** and the **Munda Uprising** led by the legendary **Birsa Munda** against British colonial rule. The state is also famous for its prehistoric cave paintings, terracotta temples of Maluti, and the unique **Chhau dance**, a UNESCO Intangible Cultural Heritage.
            </p>
          </div>
        </motion.section>

        {/* Tribal Culture & Festivals (Image Right) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-orange-500 font-semibold uppercase tracking-wider">
              <FaUsers /> Tribal Culture & Festivals
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Celebrating Life
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              The tribal culture of Jharkhand is vibrant and deeply connected to nature. Major festivals like **Sarhul** (worship of Sal trees), **Karma** (celebrating the bond of nature and siblings), **Sohrai**, and **Tusu** are celebrated with great pomp. The communities live in harmony with the forests, preserving ancient traditions and sustainable ways of living.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1582234568858-69025946761f?q=80&w=1000&auto=format&fit=crop" // Tribal/Festival Image
              alt="Tribal Culture"
              className="rounded-2xl shadow-2xl w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </motion.section>

        {/* Traditional Dance & Music (Image Left) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1514533244299-8495bedf459e?q=80&w=1000&auto=format&fit=crop" // Dance/Music Image
              alt="Chhau Dance"
              className="rounded-2xl shadow-2xl w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="flex items-center gap-3 text-pink-600 font-semibold uppercase tracking-wider">
              <FaMusic /> Dance & Music
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Rhythm of the Soil
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Music and dance are the soul of Jharkhand. The world-famous **Chhau Dance**, performed with elaborate masks, narrates stories from epics. Other folk dances like **Jhumair**, **Domkach**, and **Paika** reflect the vibrant tribal lifestyle. Traditional instruments like the *Mandar*, *Nagart*, and *Bansuri* create a mesmerizing symphony that echoes through the hills.
            </p>
          </div>
        </motion.section>

        {/* Majestic Hills (Image Right) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-600 font-semibold uppercase tracking-wider">
              <FaMountain /> Majestic Hills
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Queen of Chotanagpur
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              The hills of Jharkhand offer breathtaking panoramic views. **Netarhat**, known as the "Queen of Chotanagpur," is famous for its stunning sunrises and sunsets. **Parasnath Hill**, the highest peak in the state, is not only a scenic wonder but also the most sacred pilgrimage site for Jains. The mist-covered valleys and winding roads make every journey here unforgettable.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop"
              alt="Jharkhand Hills"
              className="rounded-2xl shadow-2xl w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </motion.section>

        {/* Arts & Handicrafts (Image Left) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1606293926075-69a00febf280?q=80&w=1000&auto=format&fit=crop"
              alt="Tribal Art"
              className="rounded-2xl shadow-2xl w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="flex items-center gap-3 text-purple-500 font-semibold uppercase tracking-wider">
              <FaPalette /> Arts & Handicrafts
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Crafted by Tradition
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Jharkhand's art is a reflection of its deep connection with nature. **Sohrai and Khovar paintings**, which adorn the mud walls of tribal homes, are now GI-tagged treasures. The intricate **Dhokra metal craft**, utilizing the lost-wax casting technique, and exquisite **Bamboo works** showcase the exceptional skill of local artisans passed down through generations.
            </p>
          </div>
        </motion.section>

        {/* Geography (Image Right) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-blue-500 font-semibold uppercase tracking-wider">
              <FaMapMarkedAlt /> Geography
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              The Chotanagpur Plateau
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Most of Jharkhand lies on the **Chotanagpur Plateau**, the source of rivers like Damodar and Subarnarekha. Characterized by undulating hills, dense forests, and rocky terrain, it is a paradise for nature lovers. The state is also rich in mineral resources, earning it the nickname "The Ruhr of India".
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?q=80&w=1920&auto=format&fit=crop"
              alt="Chotanagpur Plateau"
              className="rounded-2xl shadow-2xl w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center py-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Ready to Explore?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Embark on a journey through the heart of nature and culture. Your adventure in Jharkhand awaits.
          </p>
          <Link
            to="/explore"
            className="inline-block px-10 py-4 bg-primary hover:bg-green-700 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            Start Your Journey
          </Link>
        </motion.section>

      </div>
    </div>
  );
}
