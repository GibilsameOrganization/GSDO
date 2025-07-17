import React from "react";
import Navigation from "@/components/Navigation";
import LazySection from "@/components/LazySection";

// Lazy load heavy components
const Hero = React.lazy(() => import("@/components/Hero"));
const ImpactMetrics = React.lazy(() => import("@/components/ImpactMetrics"));
const FourPillars = React.lazy(() => import("@/components/FourPillars"));
const FocusAreasSection = React.lazy(() => import("@/components/FocusAreasSection"));
const MissionStatement = React.lazy(() => import("@/components/MissionStatement"));
const NewsletterSection = React.lazy(() => import("@/components/NewsletterSection"));
const StoriesSection = React.lazy(() => import("@/components/StoriesSection"));
const FinalCTABanner = React.lazy(() => import("@/components/FinalCTABanner"));
const CareFooter = React.lazy(() => import("@/components/CareFooter"));

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero loads immediately since it's above the fold */}
      <LazySection minHeight="500px" className="pt-16 lg:pt-20">
        <Hero />
      </LazySection>
      
      {/* Impact Metrics */}
      <LazySection minHeight="400px" className="py-8 md:py-12">
        <ImpactMetrics />
      </LazySection>
      
      {/* Four Pillars */}
      <LazySection minHeight="600px" className="py-8 md:py-12">
        <FourPillars />
      </LazySection>
      
      {/* Focus Areas Section */}
      <LazySection minHeight="500px" className="py-8 md:py-12">
        <FocusAreasSection />
      </LazySection>
      
      {/* Mission Statement with Videos */}
      <LazySection minHeight="600px" className="py-8 md:py-12">
        <MissionStatement />
      </LazySection>
      
      {/* Newsletter Section */}
      <LazySection minHeight="500px" className="py-8 md:py-12">
        <NewsletterSection />
      </LazySection>
      
      {/* Stories Section */}
      <LazySection minHeight="600px" className="py-8 md:py-12">
        <StoriesSection />
      </LazySection>
      
      {/* Final CTA Banner */}
      <LazySection minHeight="300px" className="py-8 md:py-12">
        <FinalCTABanner />
      </LazySection>
      
      {/* Footer */}
      <LazySection minHeight="400px" className="py-8 md:py-12">
        <CareFooter />
      </LazySection>
    </div>
  );
};

export default Index;
