import React from "react";
import Navigation from "@/components/Navigation";
import LazySection from "@/components/LazySection";

// Lazy load heavy components
const Hero = React.lazy(() => import("@/components/Hero"));
const ImpactMetrics = React.lazy(() => import("@/components/ImpactMetrics"));
const FourPillars = React.lazy(() => import("@/components/FourPillars"));
const FocusAreasSection = React.lazy(() => import("@/components/FocusAreasSection"));
const NewsletterSignup = React.lazy(() => import("@/components/NewsletterSignup"));
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
      
      {/* Newsletter Signup Section */}
      <LazySection minHeight="500px">
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Newsletter Form */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Stay Connected</h2>
                <p className="text-lg text-gray-600">
                  Subscribe to our newsletter for the latest updates on our sustainable development work.
                </p>
                <NewsletterSignup variant="inline" />
              </div>
              
              {/* Right Side - Image */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop"
                  alt="Woman with children"
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-royal-blue rounded-full opacity-80"></div>
              </div>
            </div>
          </div>
        </section>
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
