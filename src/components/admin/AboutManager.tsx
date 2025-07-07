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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface AboutContentData {
  hero: {
    title: string;
    subtitle: string;
  };
  ourStory: {
    title: string;
    paragraphs: string[];
  };
  leadershipTeam: {
    title: string;
    members: Array<{
      name: string;
      title: string;
      image: string;
    }>;
  };
}

const AboutManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<AboutContentData>({
    hero: {
      title: 'About GSDO',
      subtitle: 'Founded on the belief that sustainable development is the pathway to lasting peace and prosperity'
    },
    ourStory: {
      title: 'Our Story',
      paragraphs: [
        'Gibilsame Sustainable Development Organization was founded in 2009 by a group of passionate development practitioners who believed that lasting change could only come through community-driven, sustainable approaches to development.',
        'Starting with a small water project in rural Mali, GSDO has grown into a global organization working across multiple continents. Our approach has always been rooted in the belief that communities themselves are the best agents of their own development, and our role is to provide the tools, resources, and support they need to create lasting change.',
        'Today, GSDO operates in over 25 countries, working directly with local communities, governments, and partner organizations to address the root causes of poverty and inequality through integrated development programs.'
      ]
    },
    leadershipTeam: {
      title: 'Leadership Team',
      members: [
        {
          name: 'Dr. Amina Hassan',
          title: 'Executive Director',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2088&auto=format&fit=crop'
        },
        {
          name: 'James Mitchell',
          title: 'Director of Programs',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2087&auto=format&fit=crop'
        },
        {
          name: 'Dr. Priya Sharma',
          title: 'Director of Research',
          image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2061&auto=format&fit=crop'
        }
      ]
    }
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshSection } = useContent();

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'about_page')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching about content:', error);
        toast({
          title: "Error fetching content",
          description: error.message,
          variant: "destructive",
        });
      } else if (data && data.content) {
        setFormData(data.content as any);
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
    if (saving) return;

    setSaving(true);

    try {
      const contentData = {
        section_key: 'about_page',
        content: formData as any, // Type assertion to handle Json type
        updated_by: user?.id,
      };

      const { error } = await supabase
        .from('site_content')
        .upsert(contentData, { onConflict: 'section_key' });

      if (error) {
        console.error('Error saving about content:', error);
        toast({
          title: "Error saving content",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "About page content updated successfully!",
        });
        refreshSection('about_page');
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

  const updateParagraph = (index: number, value: string) => {
    const updatedParagraphs = [...formData.ourStory.paragraphs];
    updatedParagraphs[index] = value;
    setFormData({
      ...formData,
      ourStory: {
        ...formData.ourStory,
        paragraphs: updatedParagraphs
      }
    });
  };

  const addParagraph = () => {
    setFormData({
      ...formData,
      ourStory: {
        ...formData.ourStory,
        paragraphs: [...formData.ourStory.paragraphs, '']
      }
    });
  };

  const removeParagraph = (index: number) => {
    const updatedParagraphs = [...formData.ourStory.paragraphs];
    updatedParagraphs.splice(index, 1);
    setFormData({
      ...formData,
      ourStory: {
        ...formData.ourStory,
        paragraphs: updatedParagraphs
      }
    });
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const updatedMembers = [...formData.leadershipTeam.members];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    };
    setFormData({
      ...formData,
      leadershipTeam: {
        ...formData.leadershipTeam,
        members: updatedMembers
      }
    });
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      leadershipTeam: {
        ...formData.leadershipTeam,
        members: [
          ...formData.leadershipTeam.members,
          {
            name: '',
            title: '',
            image: ''
          }
        ]
      }
    });
  };

  const removeTeamMember = (index: number) => {
    const updatedMembers = [...formData.leadershipTeam.members];
    updatedMembers.splice(index, 1);
    setFormData({
      ...formData,
      leadershipTeam: {
        ...formData.leadershipTeam,
        members: updatedMembers
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gsdo-black">About Page Content</h3>
        <p className="text-sm text-gray-600">Edit the content that appears on the About page</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="story">Our Story</TabsTrigger>
            <TabsTrigger value="leadership">Leadership Team</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>
                  Edit the main heading and subtitle that appear at the top of the About page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Title</Label>
                  <Input
                    id="hero-title"
                    value={formData.hero.title}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, title: e.target.value }
                    })}
                    placeholder="About GSDO"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">Subtitle</Label>
                  <ReactQuill
                    id="hero-subtitle"
                    value={formData.hero.subtitle}
                    onChange={(value) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, subtitle: value }
                    })}
                    theme="snow"
                    placeholder="Brief description about your organization"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="story">
            <Card>
              <CardHeader>
                <CardTitle>Our Story</CardTitle>
                <CardDescription>
                  Edit the "Our Story" section content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="story-title">Section Title</Label>
                  <Input
                    id="story-title"
                    value={formData.ourStory.title}
                    onChange={(e) => setFormData({
                      ...formData,
                      ourStory: { ...formData.ourStory, title: e.target.value }
                    })}
                    placeholder="Our Story"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>Paragraphs</Label>
                  {formData.ourStory.paragraphs.map((paragraph, index) => (
                    <div key={index} className="flex gap-2">
                      <ReactQuill
                        value={paragraph}
                        onChange={(value) => updateParagraph(index, value)}
                        theme="snow"
                        placeholder={`Paragraph ${index + 1}`}
                      />
                      {formData.ourStory.paragraphs.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeParagraph(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addParagraph}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Paragraph
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leadership">
            <Card>
              <CardHeader>
                <CardTitle>Leadership Team</CardTitle>
                <CardDescription>
                  Edit the leadership team section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leadership-title">Section Title</Label>
                  <Input
                    id="leadership-title"
                    value={formData.leadershipTeam.title}
                    onChange={(e) => setFormData({
                      ...formData,
                      leadershipTeam: { ...formData.leadershipTeam, title: e.target.value }
                    })}
                    placeholder="Leadership Team"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>Team Members</Label>
                  {formData.leadershipTeam.members.map((member, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`member-${index}-name`}>Name</Label>
                          <Input
                            id={`member-${index}-name`}
                            value={member.name}
                            onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                            placeholder="Member Name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`member-${index}-title`}>Title</Label>
                          <Input
                            id={`member-${index}-title`}
                            value={member.title}
                            onChange={(e) => updateTeamMember(index, 'title', e.target.value)}
                            placeholder="Member Title"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`member-${index}-image`}>Image URL</Label>
                          <Input
                            id={`member-${index}-image`}
                            value={member.image}
                            onChange={(e) => updateTeamMember(index, 'image', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            required
                          />
                        </div>
                        {formData.leadershipTeam.members.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeTeamMember(index)}
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove Member
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTeamMember}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Team Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button 
          type="submit" 
          className="bg-royal-blue hover:bg-blue-700"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};

export default AboutManager;
