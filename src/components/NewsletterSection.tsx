import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useContent } from '@/contexts/ContentContext';
import NewsletterSignup from './NewsletterSignup';

interface NewsletterSectionData {
  title: string;
  subtitle: string;
  videoUrl: string;
  videoTitle: string;
  showVideo: boolean;
}

const NewsletterSection = () => {
  const [sectionData, setSectionData] = useState<NewsletterSectionData>({
    title: 'Stay Connected',
    subtitle: 'Subscribe to our newsletter for the latest updates on our sustainable development work.',
    videoUrl: '',
    videoTitle: '',
    showVideo: false,
  });
  const [loading, setLoading] = useState(true);
  const { sectionRefreshTriggers } = useContent();

  useEffect(() => {
    fetchNewsletterSection();
  }, [sectionRefreshTriggers.newsletter_section]);

  const fetchNewsletterSection = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'newsletter_section')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching newsletter section:', error);
      } else if (data && data.content) {
        const content = data.content as any;
        setSectionData({
          title: content.title || 'Stay Connected',
          subtitle: content.subtitle || 'Subscribe to our newsletter for the latest updates on our sustainable development work.',
          videoUrl: content.videoUrl || '',
          videoTitle: content.videoTitle || '',
          showVideo: content.showVideo || false,
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Handle YouTube URLs
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    
    // Handle YouTube short URLs
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : '';
    }
    
    return url;
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Newsletter Form */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">{sectionData.title}</h2>
            <p className="text-lg text-gray-600">
              {sectionData.subtitle}
            </p>
            <NewsletterSignup variant="inline" />
          </div>
          
          {/* Right Side - Video or Image */}
          <div className="relative">
            {sectionData.showVideo && sectionData.videoUrl ? (
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <iframe
                  src={getVideoEmbedUrl(sectionData.videoUrl)}
                  title={sectionData.videoTitle || "Embedded video"}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <>
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop"
                  alt="Woman with children"
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-royal-blue rounded-full opacity-80"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection; 