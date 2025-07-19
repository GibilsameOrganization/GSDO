import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/contexts/ContentContext";
import WhoWeAre from "@/components/WhoWeAre";

interface AboutContentData {
  hero: {
    title: string;
    subtitle: string;
  };
  ourStory: {
    title: string;
    paragraphs: string[];
  };
  leadershipTeam: {
    title: string;
    members: Array<{
      name: string;
      title: string;
      image: string;
    }>;
  };
}

const About = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<AboutContentData>({
    hero: {
      title: 'About GSDO',
      subtitle: 'Founded on the belief that sustainable development is the pathway to lasting peace and prosperity'
    },
    ourStory: {
      title: 'Our Story',
      paragraphs: [
        'Gibilsame Sustainable Development Organization was founded in 2009 by a group of passionate development practitioners who believed that lasting change could only come through community-driven, sustainable approaches to development.',
        'Starting with a small water project in rural Mali, GSDO has grown into a global organization working across multiple continents. Our approach has always been rooted in the belief that communities themselves are the best agents of their own development, and our role is to provide the tools, resources, and support they need to create lasting change.',
        'Today, GSDO operates in over 25 countries, working directly with local communities, governments, and partner organizations to address the root causes of poverty and inequality through integrated development programs.'
      ]
    },
    leadershipTeam: {
      title: 'Leadership Team',
      members: [
        {
          name: 'Dr. Amina Hassan',
          title: 'Executive Director',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2088&auto=format&fit=crop'
        },
        {
          name: 'James Mitchell',
          title: 'Director of Programs',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2087&auto=format&fit=crop'
        },
        {
          name: 'Dr. Priya Sharma',
          title: 'Director of Research',
          image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2061&auto=format&fit=crop'
        }
      ]
    }
  });
  const { sectionRefreshTriggers } = useContent();

  useEffect(() => {
    fetchAboutContent();
  }, [sectionRefreshTriggers.about_page]);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'about_page')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching about content:', error);
      } else if (data && data.content) {
        setContent(data.content as any);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-royal-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{content.hero.title}</h1>
            <p className="text-xl md:text-2xl text-blue-100"
               dangerouslySetInnerHTML={{ __html: content.hero.subtitle }}>
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <WhoWeAre />

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Story Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gsdo-black mb-6">
                {content.ourStory.title}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-royal-blue to-blue-600 mx-auto"></div>
            </div>

            {/* Story Content Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <div className="space-y-8">
                {content.ourStory.paragraphs.map((paragraph, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start space-x-4">
                      {/* Timeline dot */}
                      <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-br from-royal-blue to-blue-600 rounded-full mt-2"></div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-left"
                           dangerouslySetInnerHTML={{ __html: paragraph }}>
                        </p>
                        
                        {/* Decorative line after each paragraph except the last */}
                        {index < content.ourStory.paragraphs.length - 1 && (
                          <div className="mt-6 w-16 h-0.5 bg-gradient-to-r from-royal-blue to-blue-600 opacity-30"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-12 text-center">{content.leadershipTeam.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.leadershipTeam.members.map((member) => (
              <div key={member.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gsdo-black mb-2">{member.name}</h3>
                  <p className="text-royal-blue font-medium">{member.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
