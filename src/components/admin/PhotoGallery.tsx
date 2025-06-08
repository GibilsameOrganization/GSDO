
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, ExternalLink, Copy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PhotoItem {
  name: string;
  publicUrl: string;
  size?: number;
  created_at?: string;
}

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPhotos();
    }
  }, [user]);

  const fetchPhotos = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.storage
        .from('photos')
        .list(user.id, {
          limit: 100,
          offset: 0,
        });

      if (error) throw error;

      const photoItems: PhotoItem[] = [];
      
      // Get all files from subdirectories
      for (const item of data || []) {
        if (item.name && !item.name.includes('.')) {
          // This is a folder, get files from it
          const { data: folderData, error: folderError } = await supabase.storage
            .from('photos')
            .list(`${user.id}/${item.name}`, {
              limit: 100,
              offset: 0,
            });

          if (!folderError && folderData) {
            for (const file of folderData) {
              if (file.name && file.name.includes('.')) {
                const { data: urlData } = supabase.storage
                  .from('photos')
                  .getPublicUrl(`${user.id}/${item.name}/${file.name}`);
                
                photoItems.push({
                  name: `${item.name}/${file.name}`,
                  publicUrl: urlData.publicUrl,
                  size: file.metadata?.size,
                  created_at: file.created_at,
                });
              }
            }
          }
        } else if (item.name && item.name.includes('.')) {
          // This is a file in the root user directory
          const { data: urlData } = supabase.storage
            .from('photos')
            .getPublicUrl(`${user.id}/${item.name}`);
          
          photoItems.push({
            name: item.name,
            publicUrl: urlData.publicUrl,
            size: item.metadata?.size,
            created_at: item.created_at,
          });
        }
      }

      setPhotos(photoItems);
    } catch (error: any) {
      toast({
        title: "Error loading photos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (photoName: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.storage
        .from('photos')
        .remove([`${user.id}/${photoName}`]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });

      fetchPhotos(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error deleting photo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Success",
        description: "URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading photos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Uploaded Photos</h3>
        <Button onClick={fetchPhotos} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {photos.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No photos uploaded yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-square">
                <img
                  src={photo.publicUrl}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate mb-2">{photo.name}</p>
                {photo.size && (
                  <p className="text-xs text-gray-500 mb-3">
                    {(photo.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyUrl(photo.publicUrl)}
                    className="flex items-center space-x-1"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy URL</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(photo.publicUrl, '_blank')}
                    className="flex items-center space-x-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletePhoto(photo.name)}
                    className="flex items-center space-x-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
