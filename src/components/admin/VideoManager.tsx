import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Play, Eye, EyeOff, Video } from 'lucide-react';
import VideoUploader from './VideoUploader';
import type { Database } from '@/integrations/supabase/types';

type Video = Database['public']['Tables']['videos']['Row'];

const VideoManager = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    active: true,
    order_index: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      toast({
        title: "Error fetching videos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  const handleVideoUpload = async (videoUrl: string, thumbnailUrl?: string) => {
    if (!editingVideo) {
      // Creating new video
      const { error } = await supabase
        .from('videos')
        .insert({
          title: formData.title,
          description: formData.description || null,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl || null,
          category: formData.category || null,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null,
          active: formData.active,
          order_index: formData.order_index,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        toast({
          title: "Error creating video",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Video created successfully!",
        });
        setIsDialogOpen(false);
        resetForm();
        fetchVideos();
      }
    } else {
      // Updating existing video
      const { error } = await supabase
        .from('videos')
        .update({
          title: formData.title,
          description: formData.description || null,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl || editingVideo.thumbnail_url,
          category: formData.category || null,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null,
          active: formData.active,
          order_index: formData.order_index,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingVideo.id);

      if (error) {
        toast({
          title: "Error updating video",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Video updated successfully!",
        });
        setIsDialogOpen(false);
        resetForm();
        fetchVideos();
      }
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      category: video.category || '',
      tags: video.tags?.join(', ') || '',
      active: video.active || false,
      order_index: video.order_index || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting video",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Video deleted successfully!",
        });
        fetchVideos();
      }
    }
  };

  const resetForm = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      tags: '',
      active: true,
      order_index: 0,
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'Unknown';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Video Management</h2>
          <Button disabled>Loading...</Button>
        </div>
        <div className="text-center py-8">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Video Management</h2>
        <Button onClick={openCreateDialog} className="bg-royal-blue hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg truncate">{video.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  {video.active ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
              {video.category && (
                <Badge variant="secondary" className="w-fit">
                  {video.category}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {video.thumbnail_url && (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                </div>
              )}
              
              {video.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {video.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatDuration(video.duration)}</span>
                <span>{formatFileSize(video.file_size)}</span>
              </div>

              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {video.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
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

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">
                  Order: {video.order_index || 0}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(video)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(video.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No videos yet</h3>
          <p className="text-gray-500 mb-4">Get started by uploading your first video.</p>
          <Button onClick={openCreateDialog} className="bg-royal-blue hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Video
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? 'Edit Video' : 'Add New Video'}
            </DialogTitle>
            <DialogDescription>
              {editingVideo 
                ? 'Update video information and upload a new file if needed.'
                : 'Upload a video and add its details.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter video title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Stories, News, Impact"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter video description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Order Index</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="active">Active (visible on website)</Label>
            </div>

            <div className="space-y-4">
              <Label>Video Upload</Label>
              <VideoUploader
                onUploadComplete={handleVideoUpload}
                folder="videos"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoManager; 