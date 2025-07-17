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
      <section 
        className="hero" 
        aria-label="GSDO hero banner"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '640px',
          display: 'grid',
          gridTemplateColumns: '40% 60%',
          overflow: 'hidden',
          isolation: 'isolate'
        }}
      >
        <div 
          className="hero__content"
          style={{
            background: '#1e40af',
            padding: '4rem 2rem 3.5rem 2rem',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded mb-4"></div>
            <div className="h-8 bg-white/20 rounded mb-4"></div>
            <div className="h-6 bg-white/20 rounded mb-8"></div>
            <div className="h-10 bg-white/20 rounded w-48"></div>
          </div>
        </div>
        <div className="animate-pulse bg-gray-200"></div>
      </section>
    );
  }

  return (
    <section 
      className="hero" 
      aria-label="GSDO hero banner"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '640px',
        display: 'grid',
        gridTemplateColumns: '40% 60%',
        overflow: 'hidden',
        isolation: 'isolate'
      }}
    >
      {/* Transparent section on the left */}
      <div 
        className="hero__content"
        style={{
          background: '#1e40af',
          padding: '4rem 2rem 3.5rem 2rem',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <h1 
          className="hero__title"
          style={{
            fontSize: 'clamp(2.4rem, 2.2vw + 1.8rem, 3.4rem)',
            lineHeight: '1.08',
            marginBottom: '2rem',
            fontWeight: '800'
          }}
        >
          {content.title}
        </h1>
        <p 
          className="hero__subtitle"
          style={{
            fontSize: '1rem',
            maxWidth: '28ch',
            marginBottom: '2.5rem'
          }}
        >
          {content.subtitle}
        </p>
        <Link 
          to="/donate" 
          className="btn-primary"
          style={{
            background: '#f97316',
            padding: '0.9rem 2.2rem',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#ffffff',
            textDecoration: 'none',
            cursor: 'pointer',
            display: 'inline-block',
            transition: 'filter 0.2s ease',
            textAlign: 'center',
            width: 'fit-content'
          }}
        >
          {content.ctaText}
        </Link>
      </div>

      {/* Image on the right */}
      <img
        className="hero__image"
        src={content.imageUrl}
        alt="Empowered community members"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
        onError={(e) => {
          console.error('Failed to load hero image');
          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80";
        }}
      />
    </section>
  );
};

export default Hero;
