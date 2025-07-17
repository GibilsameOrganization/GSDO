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
      <LazySection minHeight="500px">
        <Hero />
      </LazySection>
      
      {/* Impact Metrics */}
      <LazySection minHeight="600px">
        <ImpactMetrics />
      </LazySection>
      
      {/* Four Pillars */}
      <LazySection minHeight="600px">
        <FourPillars />
      </LazySection>
      
      {/* Focus Areas Section */}
      <LazySection minHeight="500px">
        <FocusAreasSection />
      </LazySection>
      
      {/* Mission Statement with Videos */}
      <LazySection minHeight="600px">
        <MissionStatement />
      </LazySection>
      
      {/* Newsletter Section */}
      <LazySection minHeight="500px">
        <NewsletterSection />
      </LazySection>
      
      {/* Stories Section */}
      <LazySection minHeight="600px">
        <StoriesSection />
      </LazySection>
      
      {/* Final CTA Banner */}
      <LazySection minHeight="300px">
        <FinalCTABanner />
      </LazySection>
      
      {/* Footer */}
      <LazySection minHeight="400px">
        <CareFooter />
      </LazySection>
    </div>
  );
};

export default Index;
