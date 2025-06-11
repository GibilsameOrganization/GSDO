
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhoWeAre from "@/components/WhoWeAre";
import ImpactMetrics from "@/components/ImpactMetrics";
import FocusAreas from "@/components/FocusAreas";
import StoriesCarousel from "@/components/StoriesCarousel";
import GetInvolvedSection from "@/components/GetInvolvedSection";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <WhoWeAre />
      <ImpactMetrics />
      <FocusAreas />
      <StoriesCarousel />
      <GetInvolvedSection />
      <NewsSection />
      <Footer />
    </div>
  );
};

export default Index;
