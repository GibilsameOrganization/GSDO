
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Droplets, Leaf, GraduationCap, Users, Shield, Target, Building, Globe, Zap, DollarSign, Apple, HandHeart, UserCheck, Handshake } from "lucide-react";

// Icon mapping for dynamic icon rendering
const iconMap: { [key: string]: React.ComponentType<{ size?: number }> } = {
  Heart,
  Droplets,
  Leaf,
  GraduationCap,
  Users,
  Shield,
  Target,
  Building,
  Globe,
  Zap,
  DollarSign,
  Apple,
  HandHeart,
  UserCheck,
  Handshake,
};

const FocusAreas = () => {
  const [areas, setAreas] = useState([
    {
      icon: "DollarSign",
      title: "Poverty Alleviation and Livelihoods",
      description: "Empowering communities through sustainable livelihood opportunities, skills development, and economic empowerment programs to break the cycle of poverty.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: "Apple",
      title: "Food Security and Nutrition",
      description: "Ensuring access to nutritious food and promoting sustainable agriculture practices to combat hunger and malnutrition in vulnerable communities.",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: "Heart",
      title: "Health and Well-being",
      description: "Improving healthcare access, promoting health education, and strengthening health systems to ensure better health outcomes for all.",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: "UserCheck",
      title: "Gender Equality and Women's Empowerment",
      description: "Promoting equal rights and opportunities for women and girls through education, economic participation, and advocacy for gender equality.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: "Handshake",
      title: "Peacebuilding and Social Cohesion",
      description: "Fostering peaceful communities through conflict resolution, dialogue facilitation, and programs that promote social harmony and unity.",
      color: "bg-blue-100 text-blue-600"
    }
  ]);

  useEffect(() => {
    fetchFocusAreas();
  }, []);

  const fetchFocusAreas = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('section_key', 'focus_areas')
      .single();

    if (data && data.content) {
      const content = data.content as any;
      if (content.areas && content.areas.length > 0) {
        setAreas(content.areas);
      }
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">
            Our Focus Areas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Working across multiple sectors to address the root causes of poverty and inequality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {areas.map((area, index) => {
            const IconComponent = iconMap[area.icon] || Users;
            return (
              <div
                key={area.title}
                className={`p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 ${area.color} rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gsdo-black mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="bg-royal-blue hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Learn More About Our Work
          </button>
        </div>
      </div>
    </section>
  );
};

export default FocusAreas;
