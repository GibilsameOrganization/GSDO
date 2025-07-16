import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Video, Play } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface VideoUploaderProps {
  onUploadComplete?: (url: string, thumbnailUrl?: string) => void;
  folder?: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ 
  onUploadComplete, 
  folder = 'videos' 
}) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file (MP4, WebM, MOV, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (100MB limit for videos)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a video under 100MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      setUploadProgress(0);
    }
  };

  const generateThumbnail = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        // Set canvas size
        canvas.width = 320;
        canvas.height = 180;
        
        // Seek to 1 second for thumbnail
        video.currentTime = 1;
      };
      
      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              // Convert blob to base64 for storage
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(blob);
            } else {
              resolve(null);
            }
          }, 'image/jpeg', 0.8);
        }
      };
      
      video.onerror = () => {
        resolve(null);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const uploadVideo = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    setUploadProgress(0);
    
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${folder}/${fileName}`;

      // Upload video file
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      // Generate thumbnail
      const thumbnailDataUrl = await generateThumbnail(selectedFile);
      let thumbnailUrl = null;

      if (thumbnailDataUrl) {
        // Convert base64 to blob and upload thumbnail
        const thumbnailBlob = await fetch(thumbnailDataUrl).then(r => r.blob());
        const thumbnailFileName = `${Date.now()}_thumb.jpg`;
        const thumbnailPath = `${user.id}/${folder}/${thumbnailFileName}`;

        const { error: thumbError } = await supabase.storage
          .from('videos')
          .upload(thumbnailPath, thumbnailBlob, {
            cacheControl: '3600',
            upsert: false
          });

        if (!thumbError) {
          const { data: thumbData } = supabase.storage
            .from('videos')
            .getPublicUrl(thumbnailPath);
          thumbnailUrl = thumbData.publicUrl;
        }
      }

      toast({
        title: "Success",
        description: "Video uploaded successfully!",
      });

      if (onUploadComplete) {
        onUploadComplete(data.publicUrl, thumbnailUrl || undefined);
      }

      setSelectedFile(null);
      setUploadProgress(0);
      // Reset the input
      const input = document.getElementById('video-upload') as HTMLInputElement;
      if (input) input.value = '';

    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    const input = document.getElementById('video-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="video-upload">Upload Video</Label>
        <Input
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        <p className="text-xs text-gray-500">
          Supported formats: MP4, WebM, MOV, AVI. Max size: 100MB
        </p>
      </div>

      {selectedFile && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4 text-royal-blue" />
              <span className="text-sm text-gray-700">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">
                ({formatFileSize(selectedFile.size)})
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-royal-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      <Button
        onClick={uploadVideo}
        disabled={!selectedFile || uploading}
        className="w-full bg-royal-blue hover:bg-blue-700"
      >
        {uploading ? (
          <div className="flex items-center space-x-2">
            <Upload className="h-4 w-4 animate-pulse" />
            <span>Uploading Video...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Play className="h-4 w-4" />
            <span>Upload Video</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default VideoUploader; 