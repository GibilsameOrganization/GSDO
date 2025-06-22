import React from "react";
import Navigation from "@/components/Navigation";
import LazySection from "@/components/LazySection";

// Lazy load heavy components
const Hero = React.lazy(() => import("@/components/Hero"));
const WhoWeAre = React.lazy(() => import("@/components/WhoWeAre"));
const ImpactMetrics = React.lazy(() => import("@/components/ImpactMetrics"));
const FocusAreas = React.lazy(() => import("@/components/FocusAreas"));
const StoriesCarousel = React.lazy(() => import("@/components/StoriesCarousel"));
const GetInvolvedSection = React.lazy(() => import("@/components/GetInvolvedSection"));
const NewsSection = React.lazy(() => import("@/components/NewsSection"));
const Footer = React.lazy(() => import("@/components/Footer"));

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero loads immediately since it's above the fold */}
      <LazySection minHeight="500px">
        <Hero />
      </LazySection>
      
      {/* Other sections load as they come into view */}
      <LazySection minHeight="300px">
        <WhoWeAre />
      </LazySection>
      
      <LazySection minHeight="250px">
        <ImpactMetrics />
      </LazySection>
      
      <LazySection minHeight="400px">
        <FocusAreas />
      </LazySection>
      
      <LazySection minHeight="350px">
        <StoriesCarousel />
      </LazySection>
      
      <LazySection minHeight="300px">
        <GetInvolvedSection />
      </LazySection>
      
      <LazySection minHeight="400px">
        <NewsSection />
      </LazySection>
      
      <LazySection minHeight="200px">
        <Footer />
      </LazySection>
    </div>
  );
};

export default Index;
