import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/contexts/ContentContext";

interface FocusAreasContent {
  title: string;
  subtitle: string;
  ctaText: string;
  image: string;
}

const FocusAreasSection = () => {
  const { sectionRefreshTriggers } = useContent();
  const [content, setContent] = useState<FocusAreasContent>({
    title: "WE END POVERTY BY FOCUSING ON HUNGER, HEALTH, EDUCATION, AND EQUALITY, DAILY AND IN TIMES OF CRISIS.",
    subtitle: "",
    ctaText: "LEARN ABOUT OUR WORK",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFocusAreasContent();
  }, []);

  // Listen for content updates
  useEffect(() => {
    if (sectionRefreshTriggers['landing_focus_areas']) {
      console.log('FocusAreasSection: Refresh triggered, refetching content...');
      fetchFocusAreasContent();
    }
  }, [sectionRefreshTriggers]);

  const fetchFocusAreasContent = async () => {
    try {
      console.log('FocusAreasSection: Fetching content from database...');
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'landing_focus_areas')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('FocusAreasSection: Error fetching content:', error);
      } else if (data && data.content) {
        console.log('FocusAreasSection: Content fetched successfully:', data.content);
        const focusAreasContent = data.content as any;
        setContent({
          title: focusAreasContent.title || content.title,
          subtitle: focusAreasContent.subtitle || content.subtitle,
          ctaText: focusAreasContent.ctaText || content.ctaText,
          image: focusAreasContent.image || content.image,
        });
      } else {
        console.log('FocusAreasSection: No content found in database, using defaults');
      }
    } catch (error) {
      console.error('FocusAreasSection: Unexpected error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <img
              src={content.image}
              alt="Focus areas"
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-royal-blue rounded-full opacity-80"></div>
          </div>
          
          {/* Right Side - Text */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              {content.title}
            </h2>
            {content.subtitle && (
              <p className="text-xl text-gray-600">{content.subtitle}</p>
            )}
            <Button 
              size="lg" 
              className="bg-royal-blue hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>{content.ctaText}</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FocusAreasSection; 