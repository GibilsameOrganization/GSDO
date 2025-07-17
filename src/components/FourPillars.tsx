import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/contexts/ContentContext";

interface Pillar {
  title: string;
  description: string;
  image: string;
}

interface FourPillarsContent {
  pillar1: Pillar;
  pillar2: Pillar;
  pillar3: Pillar;
  pillar4: Pillar;
}

const FourPillars = () => {
  const [pillars, setPillars] = useState<Pillar[]>([
    {
      title: "WE ACT WITH INTEGRITY",
      description: "We earn trust by operating with full transparency and accountability—ensuring every action reflects our values and ethical commitment to the communities we serve.",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=60"
    },
    {
      title: "WE'RE INCLUSIVE",
      description: "We believe every voice matters. Our programs are designed to uplift marginalized groups, promote equality, and create space for all to participate and thrive.",
      image: "https://images.unsplash.com/photo-1524250609324-3030cdb213d3?auto=format&fit=crop&w=400&q=60"
    },
    {
      title: "WE'RE EFFICIENT",
      description: "Your donation does more when you give it to GSDO. 90% of the money GSDO spends goes toward our sustainable development work that transforms communities.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=60"
    },
    {
      title: "WE'RE TRUSTED",
      description: "With over 15 years of service, GSDO has built trust through sustainable development and advocacy for social equity.",
      image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=400&q=60"
    }
  ]);
  const [loading, setLoading] = useState(true);
  const { sectionRefreshTriggers } = useContent();

  useEffect(() => {
    fetchFourPillarsContent();
  }, [sectionRefreshTriggers.landing_four_pillars]);

  const fetchFourPillarsContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'landing_four_pillars')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching four pillars content:', error);
      } else if (data && data.content) {
        const fourPillarsContent = data.content as any;
        const newPillars = [
          fourPillarsContent.pillar1 || pillars[0],
          fourPillarsContent.pillar2 || pillars[1],
          fourPillarsContent.pillar3 || pillars[2],
          fourPillarsContent.pillar4 || pillars[3],
        ];
        setPillars(newPillars);
      }
    } catch (error) {
      console.error('Unexpected error fetching four pillars content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to clean HTML tags from text
  const cleanText = (text: string) => {
    return text.replace(/<[^>]*>/g, '');
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 md:h-64 bg-gray-200 rounded-lg mb-0"></div>
                <div className="h-24 md:h-32 bg-royal-blue rounded-b-lg mt-0"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Four Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {pillars.map((pillar, index) => (
            <div 
              key={index} 
              className="flex flex-col rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image Section */}
              <div className="h-48 md:h-64 lg:h-72 overflow-hidden">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load pillar image:', pillar.image);
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=60";
                  }}
                />
              </div>

              {/* Text Section */}
              <div className="bg-royal-blue text-white p-4 md:p-6 flex-1 flex flex-col justify-center">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4 text-white uppercase tracking-wide">
                  {cleanText(pillar.title)}
                </h3>
                <div className="text-sm md:text-base lg:text-lg text-blue-100 leading-relaxed">
                  {cleanText(pillar.description)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourPillars; 