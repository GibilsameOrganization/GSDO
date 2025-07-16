import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/contexts/ContentContext";

interface WhoWeAreContent {
  title: string;
  description: string;
  mission: string;
  vision: string;
}

const WhoWeAre = () => {
  const { sectionRefreshTriggers } = useContent();
  const [content, setContent] = useState<WhoWeAreContent>({
    title: 'Who We Are',
    description: 'The Gibilsame Sustainable Development Organisation (GSDO) is an independent, non-governmental, and non-profit organisation founded on January 1st, 2025, by a dedicated group of professionals and community activists in Somaliland.',
    mission: 'Empowering communities through sustainable development and humanitarian action',
    vision: 'A world where all people have equal opportunities to thrive and prosper',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  // Listen for content updates
  useEffect(() => {
    if (sectionRefreshTriggers['who_we_are']) {
      console.log('WhoWeAre: Refresh triggered, refetching content...');
      fetchContent();
    }
  }, [sectionRefreshTriggers]);

  const fetchContent = async () => {
    try {
      console.log('WhoWeAre: Fetching content from database...');
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'who_we_are')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('WhoWeAre: Error fetching content:', error);
      } else if (data && data.content) {
        console.log('WhoWeAre: Content fetched successfully:', data.content);
        const fetchedContent = data.content as any;
        setContent({
          title: fetchedContent.title || content.title,
          description: fetchedContent.description || content.description,
          mission: fetchedContent.mission || content.mission,
          vision: fetchedContent.vision || content.vision,
        });
      } else {
        console.log('WhoWeAre: No content found in database, using defaults');
      }
    } catch (error) {
      console.error('WhoWeAre: Unexpected error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-8 max-w-2xl mx-auto"></div>
            </div>
          </div>
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gsdo-black mb-8">
            {content.title}
          </h2>
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          {/* Main Description */}
          <div className="text-left">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6"
               dangerouslySetInnerHTML={{ __html: content.description }}>
            </p>
            
            {/* Registration Info */}
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed"
               dangerouslySetInnerHTML={{ __html: "We are officially registered with the <strong>Ministry of Planning and National Development of Somaliland</strong>, under Certificate No. L43.13.1787.2025M/J, issued on <strong>March 15th, 2025</strong>." }}>
            </p>
          </div>

          {/* Mission and Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Mission */}
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-royal-blue">
              <h3 className="text-xl font-bold text-gsdo-black mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed"
                 dangerouslySetInnerHTML={{ __html: content.mission }}>
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-600">
              <h3 className="text-xl font-bold text-gsdo-black mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed"
                 dangerouslySetInnerHTML={{ __html: content.vision }}>
              </p>
            </div>
          </div>

          {/* Why We Exist Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gsdo-black mb-6">Why We Exist</h3>
            <div className="text-left">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We believe that sustainable development is the pathway to lasting peace and prosperity. Our work focuses on empowering local populations, enhancing environmental sustainability, and fostering inclusive economic growth.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Through our integrated approach to development, we address the root causes of poverty and inequality while building resilient communities that can thrive for generations to come.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;

