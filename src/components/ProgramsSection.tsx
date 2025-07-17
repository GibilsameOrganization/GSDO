import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useContent } from '@/contexts/ContentContext';

interface Program {
  title: string;
  description: string;
  impact: string;
  countries: string;
  image: string;
  order_index: number;
}

const ProgramsSection = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const { sectionRefreshTriggers } = useContent();

  useEffect(() => {
    fetchPrograms();
  }, [sectionRefreshTriggers.current_programs]);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'current_programs')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching current programs:', error);
      } else if (data && data.content) {
        const content = data.content as any;
        setPrograms(content.programs || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-12 text-center">Current Programs</h2>
          <div className="space-y-12">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (programs.length === 0) {
    return null; // Don't render anything if no programs
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-12 text-center">Current Programs</h2>
        <div className="space-y-12">
          {programs.map((program, index) => (
            <div key={program.title} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <img src={program.image} alt={program.title} className="w-full h-64 object-cover rounded-lg" />
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <h3 className="text-2xl font-bold text-gsdo-black mb-4">{program.title}</h3>
                <p className="text-gray-600 text-lg mb-6">{program.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-royal-blue">Impact</span>
                    <p className="text-gsdo-black font-semibold">{program.impact}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-royal-blue">Countries</span>
                    <p className="text-gsdo-black font-semibold">{program.countries}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection; 