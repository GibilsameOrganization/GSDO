import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useContent } from '@/contexts/ContentContext';

interface WhoWeAreContent {
  title: string;
  description: string;
  mission: string;
  vision: string;
  values: string;
}

const WhoWeAre = () => {
  const { sectionRefreshTriggers } = useContent();
  const [content, setContent] = useState<WhoWeAreContent>({
    title: 'Who We Are',
    description: 'Gibilsame Sustainable Development Organization (GSDO) is an international NGO dedicated to creating lasting change in communities worldwide. Through sustainable development initiatives, humanitarian aid, and advocacy for social equity, we work to ensure that everyone has the opportunity to build a better future.',
    mission: 'Empowering communities through sustainable development and humanitarian action',
    vision: 'A world where all people have equal opportunities to thrive and prosper',
    values: 'Integrity, inclusivity, innovation, and impact in everything we do',
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
          values: fetchedContent.values || content.values,
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center">
                    <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
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
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-6">
            {content.title}
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed"
             dangerouslySetInnerHTML={{ __html: content.description }}>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gsdo-black mb-2">Our Mission</h3>
              <p className="text-gray-600" 
                 dangerouslySetInnerHTML={{ __html: content.mission }}>
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gsdo-black mb-2">Our Vision</h3>
              <p className="text-gray-600" 
                 dangerouslySetInnerHTML={{ __html: content.vision }}>
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gsdo-black mb-2">Our Values</h3>
              <p className="text-gray-600" 
                 dangerouslySetInnerHTML={{ __html: content.values }}>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
