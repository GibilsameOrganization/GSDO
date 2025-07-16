import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
}

const CareHero = () => {
  const [content, setContent] = useState<HeroContent>({
    title: 'Empowering People. Building Sustainable Futures.',
    subtitle: 'Together, we create lasting change in communities worldwide through sustainable development and humanitarian action. Your support helps us build resilient communities and transform lives.',
    ctaText: 'GIVE NOW',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop',
  });
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const testImageUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log('Image URL test result:', {
        url,
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      return response.ok;
    } catch (error) {
      console.error('Image URL test failed:', error);
      return false;
    }
  };

  const fixSupabaseUrl = (url: string) => {
    // Check if it's a Supabase storage URL and fix common issues
    if (url.includes('supabase.co/storage')) {
      console.log('Detected Supabase storage URL:', url);
      
      // Clean up any extra whitespace or newlines
      const cleanedUrl = url.trim();
      
      // Ensure the URL has the correct format
      if (!cleanedUrl.includes('/object/public/')) {
        console.log('Fixing Supabase URL format...');
        // Try to fix common Supabase URL issues
        const fixedUrl = cleanedUrl.replace('/storage/v1/object/public/', '/storage/v1/object/public/');
        console.log('Fixed URL:', fixedUrl);
        return fixedUrl;
      }
      
      return cleanedUrl;
    }
    return url.trim();
  };

  const cleanSubtitleContent = (content: string) => {
    // Remove any unwanted HTML tags or formatting
    return content
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const fetchHeroContent = async () => {
    try {
      console.log('Fetching hero content from database...');
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'landing_hero')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching hero content:', error);
      } else if (data && data.content) {
        const heroContent = data.content as any;
        console.log('Hero content from database:', heroContent);
        console.log('Image URL from database:', heroContent.imageUrl);
        
        // Test the image URL if it exists
        if (heroContent.imageUrl) {
          const fixedImageUrl = fixSupabaseUrl(heroContent.imageUrl);
          await testImageUrl(fixedImageUrl);
          
          setContent({
            title: heroContent.title || content.title,
            subtitle: cleanSubtitleContent(heroContent.subtitle || content.subtitle),
            ctaText: heroContent.ctaText || content.ctaText,
            imageUrl: fixedImageUrl,
          });
        } else {
          setContent({
            title: heroContent.title || content.title,
            subtitle: cleanSubtitleContent(heroContent.subtitle || content.subtitle),
            ctaText: heroContent.ctaText || content.ctaText,
            imageUrl: content.imageUrl,
          });
        }
      } else {
        console.log('No hero content found in database, using defaults');
      }
    } catch (error) {
      console.error('Unexpected error fetching hero content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative h-screen overflow-hidden pt-16">
        <div className="absolute inset-0 top-16">
          <img
            src={content.imageUrl}
            alt="Hero background"
            className="w-full h-full object-cover"
            onLoad={() => {
              console.log('Hero image loaded successfully (loading state):', content.imageUrl);
              setImageLoading(false);
              setImageError(false);
            }}
            onError={(e) => {
              console.error('Failed to load hero image (loading state):', content.imageUrl);
              console.error('Image error details:', e);
              setImageError(true);
              setImageLoading(false);
              // Fallback to default image
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center pt-8 pb-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 top-16">
        <img
          src={content.imageUrl}
          alt="Hero background"
          className="w-full h-full object-cover"
          onLoad={() => {
            console.log('Hero image loaded successfully:', content.imageUrl);
            setImageLoading(false);
            setImageError(false);
          }}
          onError={(e) => {
            console.error('Failed to load hero image:', content.imageUrl);
            console.error('Image error details:', e);
            setImageError(true);
            setImageLoading(false);
            // Fallback to default image
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {content.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              {content.subtitle}
            </p>
            <Button 
              size="lg" 
              className="bg-royal-blue hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>{content.ctaText}</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareHero; 