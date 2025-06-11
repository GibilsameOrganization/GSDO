
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';

interface SiteContentData {
  title: string;
  description: string;
  mission: string;
  vision: string;
  values: string;
}

const SiteContentManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SiteContentData>({
    title: '',
    description: '',
    mission: '',
    vision: '',
    values: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshSection } = useContent();

  useEffect(() => {
    fetchSiteContent();
  }, []);

  const fetchSiteContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'who_we_are')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching content:', error);
        toast({
          title: "Error fetching content",
          description: error.message,
          variant: "destructive",
        });
      } else if (data && data.content) {
        const content = data.content as any;
        setFormData({
          title: content.title || '',
          description: content.description || '',
          mission: content.mission || '',
          vision: content.vision || '',
          values: content.values || '',
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return; // Prevent multiple submissions

    setSaving(true);

    try {
      const contentData = {
        section_key: 'who_we_are',
        content: formData as any,
        updated_by: user?.id,
      };

      const { error } = await supabase
        .from('site_content')
        .upsert(contentData, { onConflict: 'section_key' });

      if (error) {
        console.error('Error saving content:', error);
        toast({
          title: "Error saving content",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Site content updated successfully!",
        });
        // Trigger content refresh on the frontend
        refreshSection('who_we_are');
        console.log('SiteContentManager: Content saved, triggering refresh');
      }
    } catch (error) {
      console.error('Unexpected error during save:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gsdo-black">Site Content</h3>
        <p className="text-sm text-gray-600">Edit the "Who We Are" section content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Who We Are Section</CardTitle>
          <CardDescription>
            This content appears on the homepage in the "Who We Are" section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Who We Are"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Main Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[120px]"
                placeholder="Main description of your organization..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mission">Our Mission</Label>
                <Textarea
                  id="mission"
                  value={formData.mission}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  placeholder="Your organization's mission..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vision">Our Vision</Label>
                <Textarea
                  id="vision"
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  placeholder="Your organization's vision..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="values">Our Values</Label>
                <Textarea
                  id="values"
                  value={formData.values}
                  onChange={(e) => setFormData({ ...formData, values: e.target.value })}
                  placeholder="Your organization's values..."
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="bg-royal-blue hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteContentManager;
