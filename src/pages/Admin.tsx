import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Users, FileText, BarChart3, Image, Globe, Camera, Target, BookOpen, Video } from 'lucide-react';
import HeroSlidesManager from '@/components/admin/HeroSlidesManager';
import NewsManager from '@/components/admin/NewsManager';
import ImpactMetricsManager from '@/components/admin/ImpactMetricsManager';
import StoriesManager from '@/components/admin/StoriesManager';
import SiteContentManager from '@/components/admin/SiteContentManager';
import PhotoManager from '@/components/admin/PhotoManager';
import FocusAreasManager from '@/components/admin/FocusAreasManager';
import AboutManager from '@/components/admin/AboutManager';
import VideoManager from '@/components/admin/VideoManager';

const Admin = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      console.log('Admin: Starting sign out process...');
      await signOut();
      console.log('Admin: Sign out completed, navigating to home');
      navigate('/');
    } catch (error) {
      console.error('Admin: Error signing out:', error);
      // Even if there's an error, navigate to home since local state is cleared
      navigate('/');
    }
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
          <div className="overflow-x-auto">
            <TabsList className="flex w-max min-w-full gap-1 p-1">
              <TabsTrigger value="content" className="flex items-center space-x-1 text-xs px-3 py-2 whitespace-nowrap">
                <Globe className="h-3 w-3" />
                <span>Site Content</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center space-x-1 text-xs px-3 py-2 whitespace-nowrap">
                <BookOpen className="h-3 w-3" />
                <span>About Page</span>
              </TabsTrigger>
              <TabsTrigger value="focus-areas" className="flex items-center space-x-1 text-xs px-3 py-2 whitespace-nowrap">
                <Target className="h-3 w-3" />
                <span>Focus Areas</span>
              </TabsTrigger>
              <TabsTrigger value="photos" className="flex items-center space-x-1 text-xs px-3 py-2 whitespace-nowrap">
                <Camera className="h-3 w-3" />
                <span>Photos</span>
              </TabsTrigger>
              <TabsTrigger value="hero" className="flex items-center space-x-1 text-xs px-3 py-2 whitespace-nowrap">
                <Image className="h-3 w-3" />
                <span>Hero Slides</span>
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center space-x-1 text-xs px-3 py-2 whitespace-nowrap">
                <BarChart3 className="h-3 w-3" />
                <span>Impact Metrics</span>
              </TabsTrigger>
              <TabsTrigger value="stories" className="flex items-center space-x-1 text-xs px-3 py-2 whitespace-nowrap">
                <Users className="h-3 w-3" />
                <span>Stories</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center space-x-1 text-xs px-3 py-2 whitespace-nowrap">
                <FileText className="h-3 w-3" />
                <span>News & Newsletters</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center space-x-1 text-xs px-3 py-2 whitespace-nowrap">
                <Video className="h-3 w-3" />
                <span>Videos</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="content">
            <SiteContentManager />
          </TabsContent>

          <TabsContent value="about">
            <AboutManager />
          </TabsContent>

          <TabsContent value="focus-areas">
            <FocusAreasManager />
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

          <TabsContent value="videos">
            <VideoManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
