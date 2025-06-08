
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Users, FileText, BarChart3, Image, Globe, Camera } from 'lucide-react';
import HeroSlidesManager from '@/components/admin/HeroSlidesManager';
import NewsManager from '@/components/admin/NewsManager';
import ImpactMetricsManager from '@/components/admin/ImpactMetricsManager';
import StoriesManager from '@/components/admin/StoriesManager';
import SiteContentManager from '@/components/admin/SiteContentManager';
import PhotoManager from '@/components/admin/PhotoManager';

const Admin = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gsdo-black">GSDO Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gsdo-black mb-2">Content Management</h2>
          <p className="text-gray-600">Manage your website content and newsletters</p>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Site Content</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>Photos</span>
            </TabsTrigger>
            <TabsTrigger value="hero" className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>Hero Slides</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Impact Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="stories" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Stories</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>News & Newsletters</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <SiteContentManager />
          </TabsContent>

          <TabsContent value="photos">
            <PhotoManager />
          </TabsContent>

          <TabsContent value="hero">
            <HeroSlidesManager />
          </TabsContent>

          <TabsContent value="metrics">
            <ImpactMetricsManager />
          </TabsContent>

          <TabsContent value="stories">
            <StoriesManager />
          </TabsContent>

          <TabsContent value="news">
            <NewsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
