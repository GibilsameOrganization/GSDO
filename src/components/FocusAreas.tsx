import React, { useState, useEffect } from 'react';
import { DollarSign, Utensils, Heart, Users, Handshake, LucideIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useContent } from '@/contexts/ContentContext';

interface FocusArea {
  title: string;
  description: string;
  icon: string;
  color: string;
}

// Icon mapping for dynamic loading
const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  Utensils,
  Heart,
  Users,
  Handshake,
};

const defaultFocusAreas: FocusArea[] = [
  {
    title: "Poverty Alleviation and Livelihoods",
    description: "Empowering communities through sustainable livelihood programs and economic opportunities to break the cycle of poverty.",
    icon: "DollarSign",
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Food Security and Nutrition",
    description: "Ensuring access to nutritious food and promoting sustainable agricultural practices to combat hunger and malnutrition.",
    icon: "Utensils",
    color: "bg-orange-100 text-orange-600"
  },
  {
    title: "Health and Well-being",
    description: "Improving healthcare access and promoting wellness initiatives to enhance quality of life for vulnerable populations.",
    icon: "Heart",
    color: "bg-red-100 text-red-600"
  },
  {
    title: "Gender Equality and Women's Empowerment",
    description: "Advancing gender equality through education, leadership development, and economic empowerment programs for women and girls.",
    icon: "Users",
    color: "bg-purple-100 text-purple-600"
  },
  {
    title: "Peacebuilding and Social Cohesion",
    description: "Fostering peaceful communities through conflict resolution, dialogue, and programs that promote social unity and understanding.",
    icon: "Handshake",
    color: "bg-blue-100 text-blue-600"
  }
];

const FocusAreas = () => {
  const { sectionRefreshTriggers } = useContent();
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>(defaultFocusAreas);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFocusAreas();
  }, []);

  // Listen for content updates
  useEffect(() => {
    if (sectionRefreshTriggers['focus_areas']) {
      console.log('FocusAreas: Refresh triggered, refetching content...');
      fetchFocusAreas();
    }
  }, [sectionRefreshTriggers]);

  const fetchFocusAreas = async () => {
    try {
      console.log('FocusAreas: Fetching content from database...');
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'focus_areas')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('FocusAreas: Error fetching content:', error);
      } else if (data && data.content) {
        console.log('FocusAreas: Content fetched successfully:', data.content);
        const content = data.content as any;
        if (content.areas && Array.isArray(content.areas)) {
          setFocusAreas(content.areas);
        }
      } else {
        console.log('FocusAreas: No content found in database, using defaults');
      }
    } catch (error) {
      console.error('FocusAreas: Unexpected error fetching content:', error);
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gsdo-black mb-4">Our Focus Areas</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We work across multiple interconnected areas to create comprehensive and lasting impact in the communities we serve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {focusAreas.map((area, index) => {
            const IconComponent = iconMap[area.icon] || Users; // Fallback to Users icon
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-lg ${area.color} flex items-center justify-center mb-4`}>
                  <IconComponent size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gsdo-black mb-3">{cleanText(area.title)}</h3>
                <p className="text-gray-600">
                  {cleanText(area.description)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FocusAreas;
