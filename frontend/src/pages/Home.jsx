import HeroSlider from "../components/home/HeroSlider";
import PopularAttractionsSection from "../components/home/PopularAttractionsSection";
import FeaturedPackagesSection from "../components/home/FeaturedPackagesSection";
import HotelsSection from "../components/home/HotelsSection";
import WhyJharkhand from "../components/home/WhyJharkhand";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <PopularAttractionsSection />
      <FeaturedPackagesSection />
      <HotelsSection />
      <WhyJharkhand />
    </>
  );
}
