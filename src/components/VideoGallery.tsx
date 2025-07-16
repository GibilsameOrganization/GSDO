import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, Filter, Play, Clock, Tag } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import type { Database } from '@/integrations/supabase/types';

type Video = Database['public']['Tables']['videos']['Row'];

interface VideoGalleryProps {
  category?: string;
  limit?: number;
  showFilters?: boolean;
  title?: string;
  description?: string;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({
  category,
  limit,
  showFilters = true,
  title = "Video Gallery",
  description
}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchVideos();
  }, [category]);

  useEffect(() => {
    filterVideos();
  }, [videos, searchTerm, selectedCategory]);

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
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data?.map(v => v.category).filter(Boolean) || [])];
      setCategories(uniqueCategories);
    }
    setLoading(false);
  };

  const filterVideos = () => {
    let filtered = videos;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (video.tags && video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    setFilteredVideos(filtered);
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

  if (loading) {
    return (
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">{title}</h2>
            {description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">{description}</p>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">{title}</h2>
          {description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">{description}</p>
          )}
        </div>

        {showFilters && (
          <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {categories.length > 0 && (
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="text-sm text-gray-600">
              {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
            </div>
          </div>
        )}

        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Play className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filter criteria.'
                : 'No videos are currently available.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
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
                      {video.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {video.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{video.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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

export default VideoGallery; 