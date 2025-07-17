import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Clock, Tag, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import type { Database } from '@/integrations/supabase/types';

type Video = Database['public']['Tables']['videos']['Row'];

interface VideoSectionProps {
  title?: string;
  description?: string;
  category?: string;
  limit?: number;
  showViewAll?: boolean;
  layout?: 'grid' | 'carousel' | 'featured';
  className?: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  title = "Featured Videos",
  description,
  category,
  limit = 6,
  showViewAll = true,
  layout = 'grid',
  className = ''
}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, [category, limit]);

  const fetchVideos = async () => {
    setLoading(true);
    let query = supabase
      .from('videos')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleViewAllClick = () => {
    navigate('/videos');
  };

  if (loading) {
    return (
      <section className={`py-16 bg-light-gray ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">{title}</h2>
            {description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{description}</p>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null; // Don't render anything if no videos
  }

  const renderGridLayout = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <Card 
          key={video.id} 
          className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => handleVideoClick(video)}
        >
          <CardHeader className="pb-2">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Play className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <div className="bg-black bg-opacity-50 rounded-full p-3">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
            
            {video.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {video.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              {video.category && (
                <Badge variant="secondary" className="text-xs">
                  {video.category}
                </Badge>
              )}
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(video.duration)}</span>
              </div>
            </div>

            {video.tags && video.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {video.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {video.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{video.tags.length - 2} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderFeaturedLayout = () => {
    const [featuredVideo, ...otherVideos] = videos;
    
    return (
      <div className="space-y-8">
        {/* Featured Video */}
        {featuredVideo && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gsdo-black">Featured Video</h3>
            <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {featuredVideo.thumbnail_url ? (
                    <img
                      src={featuredVideo.thumbnail_url}
                      alt={featuredVideo.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Play className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-black bg-opacity-50 rounded-full p-4">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  {featuredVideo.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-3 py-1 rounded">
                      {formatDuration(featuredVideo.duration)}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardTitle className="text-xl">{featuredVideo.title}</CardTitle>
                
                {featuredVideo.description && (
                  <p className="text-gray-600">
                    {featuredVideo.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  {featuredVideo.category && (
                    <Badge variant="secondary">
                      {featuredVideo.category}
                    </Badge>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(featuredVideo.duration)}</span>
                  </div>
                </div>

                {featuredVideo.tags && featuredVideo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {featuredVideo.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other Videos */}
        {otherVideos.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gsdo-black">More Videos</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherVideos.map((video) => (
                <Card 
                  key={video.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleVideoClick(video)}
                >
                  <CardHeader className="pb-2">
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Play className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-black bg-opacity-50 rounded-full p-2">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {formatDuration(video.duration)}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle className="text-base line-clamp-2">{video.title}</CardTitle>
                    
                    <div className="flex items-center justify-between">
                      {video.category && (
                        <Badge variant="secondary" className="text-xs">
                          {video.category}
                        </Badge>
                      )}
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(video.duration)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className={`py-16 bg-light-gray ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">{title}</h2>
          {description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">{description}</p>
          )}
          {showViewAll && (
            <Button variant="outline" className="mt-4" onClick={handleViewAllClick}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Videos
            </Button>
          )}
        </div>

        {layout === 'featured' ? renderFeaturedLayout() : renderGridLayout()}
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedVideo && (
            <div className="space-y-4">
              <VideoPlayer
                src={selectedVideo.video_url}
                poster={selectedVideo.thumbnail_url || undefined}
                title={selectedVideo.title}
                controls={true}
                className="w-full"
              />
              
              {selectedVideo.description && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Description</h4>
                  <p className="text-gray-600">{selectedVideo.description}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                {selectedVideo.category && (
                  <Badge variant="secondary">
                    {selectedVideo.category}
                  </Badge>
                )}
                
                {selectedVideo.duration && (
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDuration(selectedVideo.duration)}
                  </span>
                )}
              </div>

              {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoSection; 