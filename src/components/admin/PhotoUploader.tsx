
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PhotoUploaderProps {
  onUploadComplete?: (url: string) => void;
  folder?: string;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ 
  onUploadComplete, 
  folder = 'general' 
}) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const uploadPhoto = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      toast({
        title: "Success",
        description: "Photo uploaded successfully!",
      });

      if (onUploadComplete) {
        onUploadComplete(data.publicUrl);
      }

      setSelectedFile(null);
      // Reset the input
      const input = document.getElementById('photo-upload') as HTMLInputElement;
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
    const input = document.getElementById('photo-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="photo-upload">Upload Photo</Label>
        <Input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
        />
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Upload className="h-4 w-4 text-royal-blue" />
            <span className="text-sm text-gray-700">{selectedFile.name}</span>
            <span className="text-xs text-gray-500">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
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
      )}

      <Button
        onClick={uploadPhoto}
        disabled={!selectedFile || uploading}
        className="w-full bg-royal-blue hover:bg-blue-700"
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </Button>
    </div>
  );
};

export default PhotoUploader;
