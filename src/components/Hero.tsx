import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/contexts/ContentContext";
import { Link } from "react-router-dom";

interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
}

const Hero = () => {
  const [content, setContent] = useState<HeroContent>({
    title: 'Sustainable Futures.',
    subtitle: 'Together, we create lasting change in communities worldwide through sustainable development and humanitarian action. Your support helps us build resilient communities and transform lives.',
    ctaText: 'GIVE NOW',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
  });
  const [loading, setLoading] = useState(true);
  const { sectionRefreshTriggers } = useContent();

  useEffect(() => {
    fetchHeroContent();
  }, [sectionRefreshTriggers.landing_hero]);

  const fetchHeroContent = async () => {
    try {
      console.log('Hero: Fetching content from database...');
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'landing_hero')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Hero: Error fetching content:', error);
      } else if (data && data.content) {
        console.log('Hero: Content fetched successfully:', data.content);
        const heroContent = data.content as any;
        setContent({
          title: heroContent.title || content.title,
          subtitle: heroContent.subtitle || content.subtitle,
          ctaText: heroContent.ctaText || content.ctaText,
          imageUrl: heroContent.imageUrl || content.imageUrl,
        });
      } else {
        console.log('Hero: No content found in database, using defaults');
      }
    } catch (error) {
      console.error('Hero: Unexpected error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative w-full min-h-[500px] md:min-h-[640px] grid grid-cols-1 lg:grid-cols-5 overflow-hidden">
        <div className="bg-royal-blue text-white p-6 md:p-8 lg:p-12 flex flex-col justify-center lg:col-span-2">
          <div className="animate-pulse space-y-4">
            <div className="h-8 md:h-12 bg-white/20 rounded"></div>
            <div className="h-6 md:h-8 bg-white/20 rounded"></div>
            <div className="h-4 md:h-6 bg-white/20 rounded"></div>
            <div className="h-10 md:h-12 bg-white/20 rounded w-32 md:w-48"></div>
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-3 animate-pulse bg-gray-200"></div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-[500px] md:min-h-[640px] grid grid-cols-1 lg:grid-cols-5 overflow-hidden">
      {/* Content section - responsive layout */}
      <div className="bg-royal-blue text-white p-6 md:p-8 lg:p-12 flex flex-col justify-center lg:col-span-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6 lg:mb-8">
          {content.title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-6 md:mb-8 lg:mb-10 max-w-md lg:max-w-none">
          {content.subtitle}
        </p>
        <Link 
          to="/donate" 
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-bold rounded transition-colors duration-200 inline-block w-fit"
        >
          {content.ctaText}
        </Link>
      </div>

      {/* Image section - responsive */}
      <div className="hidden lg:block lg:col-span-3 relative">
        <img
          src={content.imageUrl}
          alt="Empowered community members"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            console.error('Failed to load hero image');
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80";
          }}
        />
      </div>
      
      {/* Mobile image - shown only on mobile/tablet */}
      <div className="lg:hidden w-full h-48 md:h-64 relative">
        <img
          src={content.imageUrl}
          alt="Empowered community members"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            console.error('Failed to load hero image');
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80";
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
