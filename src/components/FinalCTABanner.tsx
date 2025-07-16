import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/contexts/ContentContext";

interface FinalCTAContent {
  title: string;
  subtitle: string;
  ctaText: string;
}

const FinalCTABanner = () => {
  const { sectionRefreshTriggers } = useContent();
  const [content, setContent] = useState<FinalCTAContent>({
    title: "YOUR SUPPORT = SUSTAINABLE CHANGE",
    subtitle: "Communities around the world are building resilient futures through sustainable development. Together, we can make a lasting difference. Your support helps us empower communities and transform lives.",
    ctaText: "GIVE NOW",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinalCTAContent();
  }, []);

  // Listen for content updates
  useEffect(() => {
    if (sectionRefreshTriggers['landing_final_cta']) {
      console.log('FinalCTABanner: Refresh triggered, refetching content...');
      fetchFinalCTAContent();
    }
  }, [sectionRefreshTriggers]);

  const fetchFinalCTAContent = async () => {
    try {
      console.log('FinalCTABanner: Fetching content from database...');
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'landing_final_cta')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('FinalCTABanner: Error fetching content:', error);
      } else if (data && data.content) {
        console.log('FinalCTABanner: Content fetched successfully:', data.content);
        const finalCTAContent = data.content as any;
        setContent({
          title: finalCTAContent.title || content.title,
          subtitle: finalCTAContent.subtitle || content.subtitle,
          ctaText: finalCTAContent.ctaText || content.ctaText,
        });
      } else {
        console.log('FinalCTABanner: No content found in database, using defaults');
      }
    } catch (error) {
      console.error('FinalCTABanner: Unexpected error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-royal-blue to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded mb-6"></div>
            <div className="h-6 bg-white/20 rounded mb-8 max-w-3xl mx-auto"></div>
            <div className="h-12 bg-white/20 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-royal-blue to-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {content.title}
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          {content.subtitle}
        </p>
        <Button 
          size="lg" 
          className="bg-royal-blue hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto"
        >
          <span>{content.ctaText}</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};

export default FinalCTABanner; 