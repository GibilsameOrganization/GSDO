import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/contexts/ContentContext";

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  created_at: string;
}

const MissionStatement = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { sectionRefreshTriggers } = useContent();

  useEffect(() => {
    fetchVideos();
  }, [sectionRefreshTriggers.videos]);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching videos:', error);
      } else if (data) {
        setVideos(data as Video[]);
      }
    } catch (error) {
      console.error('Unexpected error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8 max-w-3xl mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Videos Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">
            Featured Videos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how we're making a difference in communities around the world
          </p>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={video.thumbnail_url || "https://via.placeholder.com/400x225?text=Video"}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gsdo-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gsdo-black mb-2 line-clamp-2">
                    {video.title}
                  </h4>
                  {video.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {video.description}
                    </p>
                  )}
                  <a
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-royal-blue hover:text-blue-700 font-semibold text-sm transition-colors"
                  >
                    Watch Video →
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Videos Available</h3>
              <p className="text-gray-500">
                Videos uploaded through the admin panel will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MissionStatement; 