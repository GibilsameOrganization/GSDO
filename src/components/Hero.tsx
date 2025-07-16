import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/contexts/ContentContext";

interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
}

const Hero = () => {
  const [content, setContent] = useState<HeroContent>({
    title: 'YOUR SUPPORT\nBUILDS FUTURES.\nEMPOWER\nCOMMUNITIES\nTODAY.',
    subtitle: 'Join us in building resilient communities through sustainable development and humanitarian action.',
    ctaText: 'DONATE & EMPOWER',
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

  const scrollToNext = () => {
    const nextSection = document.querySelector('#who-we-are');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
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
          {content.title.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < content.title.split('\n').length - 1 && <br />}
            </span>
          ))}
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
        <a 
          href="#donate" 
          className="btn-primary"
          style={{
            background: '#1e40af',
            padding: '0.9rem 2.2rem',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#ffffff',
            textDecoration: 'none',
            cursor: 'pointer',
            display: 'inline-block',
            transition: 'filter 0.2s ease'
          }}
        >
          {content.ctaText}
        </a>
        <div 
          className="hero__chevron" 
          onClick={scrollToNext} 
          style={{ 
            cursor: 'pointer',
            marginTop: '3.5rem',
            fontSize: '1.5rem',
            color: '#ffffff'
          }}
        >
          &#709;
        </div>
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
