
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PhotoUploader from './PhotoUploader';
import PhotoGallery from './PhotoGallery';

const PhotoManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gsdo-black">Photo Management</h3>
        <p className="text-sm text-gray-600">Upload and manage photos for your website</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Photos</TabsTrigger>
          <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Photos</CardTitle>
              <CardDescription>
                Upload photos to use in your hero slides, news articles, and stories. 
                Supported formats: JPG, PNG, WebP. Maximum size: 5MB per file.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Hero Slides</h4>
                  <PhotoUploader folder="hero" />
                </div>
                <div>
                  <h4 className="font-medium mb-3">News & Articles</h4>
                  <PhotoUploader folder="news" />
                </div>
                <div>
                  <h4 className="font-medium mb-3">Stories</h4>
                  <PhotoUploader folder="stories" />
                </div>
                <div>
                  <h4 className="font-medium mb-3">General</h4>
                  <PhotoUploader folder="general" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <PhotoGallery />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhotoManager;
