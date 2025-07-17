import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import { Trash2, Plus } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface FocusArea {
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface NewsletterSection {
  title: string;
  subtitle: string;
  videoUrl: string;
  videoTitle: string;
  showVideo: boolean;
}

interface Program {
  title: string;
  description: string;
  impact: string;
  countries: string;
  image: string;
  order_index: number;
}

const FocusAreasManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [newsletterSection, setNewsletterSection] = useState<NewsletterSection>({
    title: 'Stay Connected',
    subtitle: 'Subscribe to our newsletter for the latest updates on our sustainable development work.',
    videoUrl: '',
    videoTitle: '',
    showVideo: false,
  });
  const [currentPrograms, setCurrentPrograms] = useState<Program[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshSection } = useContent();

  useEffect(() => {
    fetchFocusAreas();
    fetchNewsletterSection();
    fetchCurrentPrograms();
  }, []);

  const fetchFocusAreas = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('section_key', 'focus_areas')
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        toast({
          title: "Error fetching focus areas",
          description: error.message,
          variant: "destructive",
        });
      }
    } else if (data) {
      const content = data.content as any;
      setFocusAreas(content.areas || []);
    }
  };

  const fetchNewsletterSection = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('section_key', 'newsletter_section')
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching newsletter section:', error);
      }
    } else if (data) {
      const content = data.content as any;
      setNewsletterSection({
        title: content.title || 'Stay Connected',
        subtitle: content.subtitle || 'Subscribe to our newsletter for the latest updates on our sustainable development work.',
        videoUrl: content.videoUrl || '',
        videoTitle: content.videoTitle || '',
        showVideo: content.showVideo || false,
      });
    }
  };

  const fetchCurrentPrograms = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('section_key', 'current_programs')
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching current programs:', error);
      }
    } else if (data) {
      const content = data.content as any;
      setCurrentPrograms(content.programs || []);
    }
    setLoading(false);
  };

  const handleFocusAreasSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const contentData = {
      section_key: 'focus_areas',
      content: { areas: focusAreas } as any,
      updated_by: user?.id,
    };

    const { error } = await supabase
      .from('site_content')
      .upsert(contentData, { onConflict: 'section_key' });

    if (error) {
      toast({
        title: "Error saving focus areas",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Focus areas updated successfully!",
      });
      refreshSection('focus_areas');
    }
    
    setSaving(false);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const contentData = {
      section_key: 'newsletter_section',
      content: newsletterSection as any,
      updated_by: user?.id,
    };

    const { error } = await supabase
      .from('site_content')
      .upsert(contentData, { onConflict: 'section_key' });

    if (error) {
      toast({
        title: "Error saving newsletter section",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Newsletter section updated successfully!",
      });
      refreshSection('newsletter_section');
    }
    
    setSaving(false);
  };

  const handleCurrentProgramsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const contentData = {
      section_key: 'current_programs',
      content: { programs: currentPrograms } as any,
      updated_by: user?.id,
    };

    const { error } = await supabase
      .from('site_content')
      .upsert(contentData, { onConflict: 'section_key' });

    if (error) {
      toast({
        title: "Error saving current programs",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Current programs updated successfully!",
      });
      refreshSection('current_programs');
    }
    
    setSaving(false);
  };

  const addFocusArea = () => {
    setFocusAreas([...focusAreas, { title: '', description: '', color: 'bg-blue-100 text-blue-600', icon: 'Users' }]);
  };

  const removeFocusArea = (index: number) => {
    setFocusAreas(focusAreas.filter((_, i) => i !== index));
  };

  const updateFocusArea = (index: number, field: keyof FocusArea, value: string) => {
    const updated = [...focusAreas];
    updated[index] = { ...updated[index], [field]: value };
    setFocusAreas(updated);
  };

  const updateNewsletterSection = (field: keyof NewsletterSection, value: string | boolean) => {
    setNewsletterSection(prev => ({ ...prev, [field]: value }));
  };

  const addCurrentProgram = () => {
    setCurrentPrograms([...currentPrograms, {
      title: '',
      description: '',
      impact: '',
      countries: '',
      image: '',
      order_index: currentPrograms.length
    }]);
  };

  const removeCurrentProgram = (index: number) => {
    setCurrentPrograms(currentPrograms.filter((_, i) => i !== index));
  };

  const updateCurrentProgram = (index: number, field: keyof Program, value: string | number) => {
    const updated = [...currentPrograms];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentPrograms(updated);
  };

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Handle YouTube URLs
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    
    // Handle YouTube short URLs
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : '';
    }
    
    return url;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gsdo-black">Focus Areas, Newsletter & Current Programs</h3>
        <p className="text-sm text-gray-600">Manage the focus areas, newsletter section, and current programs content</p>
      </div>

      <Tabs defaultValue="focus-areas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="focus-areas">Focus Areas</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter Section</TabsTrigger>
          <TabsTrigger value="current-programs">Current Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="focus-areas">
          <Card>
            <CardHeader>
              <CardTitle>Our Focus Areas Section</CardTitle>
              <CardDescription>
                Edit the focus areas that appear on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFocusAreasSubmit} className="space-y-6">
                {focusAreas.map((area, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Focus Area {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFocusArea(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${index}`}>Title</Label>
                        <Input
                          id={`title-${index}`}
                          value={area.title}
                          onChange={(e) => updateFocusArea(index, 'title', e.target.value)}
                          placeholder="Focus area title"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`icon-${index}`}>Icon (Lucide React)</Label>
                        <Input
                          id={`icon-${index}`}
                          value={area.icon}
                          onChange={(e) => updateFocusArea(index, 'icon', e.target.value)}
                          placeholder="e.g. Users, Heart, Droplets"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`color-${index}`}>Color Classes</Label>
                        <Input
                          id={`color-${index}`}
                          value={area.color}
                          onChange={(e) => updateFocusArea(index, 'color', e.target.value)}
                          placeholder="e.g. bg-blue-100 text-blue-600"
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`description-${index}`}>Description</Label>
                        <ReactQuill
                          id={`description-${index}`}
                          value={area.description}
                          onChange={(value) => updateFocusArea(index, 'description', value)}
                          theme="snow"
                          placeholder="Focus area description"
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addFocusArea}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Focus Area</span>
                </Button>

                <Button 
                  type="submit" 
                  className="bg-royal-blue hover:bg-blue-700"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Focus Areas'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Section</CardTitle>
              <CardDescription>
                Edit the newsletter section content and video embedding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewsletterSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newsletter-title">Section Title</Label>
                    <Input
                      id="newsletter-title"
                      value={newsletterSection.title}
                      onChange={(e) => updateNewsletterSection('title', e.target.value)}
                      placeholder="Stay Connected"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newsletter-subtitle">Section Subtitle</Label>
                    <Input
                      id="newsletter-subtitle"
                      value={newsletterSection.subtitle}
                      onChange={(e) => updateNewsletterSection('subtitle', e.target.value)}
                      placeholder="Subscribe to our newsletter..."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show-video"
                      checked={newsletterSection.showVideo}
                      onChange={(e) => updateNewsletterSection('showVideo', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="show-video">Show Video Instead of Image</Label>
                  </div>

                  {newsletterSection.showVideo && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="video-url">Video URL</Label>
                        <Input
                          id="video-url"
                          value={newsletterSection.videoUrl}
                          onChange={(e) => updateNewsletterSection('videoUrl', e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                        />
                        <p className="text-sm text-gray-500">
                          Supports YouTube and Vimeo URLs
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="video-title">Video Title (Optional)</Label>
                        <Input
                          id="video-title"
                          value={newsletterSection.videoTitle}
                          onChange={(e) => updateNewsletterSection('videoTitle', e.target.value)}
                          placeholder="Video title for accessibility"
                        />
                      </div>

                      {newsletterSection.videoUrl && (
                        <div className="space-y-2">
                          <Label>Video Preview</Label>
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <iframe
                              src={getVideoEmbedUrl(newsletterSection.videoUrl)}
                              title={newsletterSection.videoTitle || "Embedded video"}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="bg-royal-blue hover:bg-blue-700"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Newsletter Section'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current-programs">
          <Card>
            <CardHeader>
              <CardTitle>Current Programs Section</CardTitle>
              <CardDescription>
                Edit the current programs that appear on the Our Work page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCurrentProgramsSubmit} className="space-y-6">
                {currentPrograms.map((program, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Program {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCurrentProgram(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`program-title-${index}`}>Program Title</Label>
                        <Input
                          id={`program-title-${index}`}
                          value={program.title}
                          onChange={(e) => updateCurrentProgram(index, 'title', e.target.value)}
                          placeholder="Program title"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`program-image-${index}`}>Image URL</Label>
                        <Input
                          id={`program-image-${index}`}
                          value={program.image}
                          onChange={(e) => updateCurrentProgram(index, 'image', e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`program-impact-${index}`}>Impact</Label>
                        <Input
                          id={`program-impact-${index}`}
                          value={program.impact}
                          onChange={(e) => updateCurrentProgram(index, 'impact', e.target.value)}
                          placeholder="e.g. 500,000 people served"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`program-countries-${index}`}>Countries</Label>
                        <Input
                          id={`program-countries-${index}`}
                          value={program.countries}
                          onChange={(e) => updateCurrentProgram(index, 'countries', e.target.value)}
                          placeholder="e.g. Mali, Burkina Faso, Niger"
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`program-description-${index}`}>Description</Label>
                        <ReactQuill
                          id={`program-description-${index}`}
                          value={program.description}
                          onChange={(value) => updateCurrentProgram(index, 'description', value)}
                          theme="snow"
                          placeholder="Program description"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`program-order-${index}`}>Display Order</Label>
                        <Input
                          id={`program-order-${index}`}
                          type="number"
                          value={program.order_index}
                          onChange={(e) => updateCurrentProgram(index, 'order_index', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addCurrentProgram}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Program</span>
                </Button>

                <Button 
                  type="submit" 
                  className="bg-royal-blue hover:bg-blue-700"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Current Programs'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FocusAreasManager;
