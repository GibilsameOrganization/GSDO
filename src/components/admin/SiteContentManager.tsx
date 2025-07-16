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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface SiteContentData {
  title: string;
  description: string;
  mission: string;
  vision: string;
  values: string;
}

interface LandingPageData {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    imageUrl: string;
  };
  mission: {
    statement: string;
  };
  fourPillars: {
    pillar1: {
      title: string;
      description: string;
      image: string;
    };
    pillar2: {
      title: string;
      description: string;
      image: string;
    };
    pillar3: {
      title: string;
      description: string;
      image: string;
    };
    pillar4: {
      title: string;
      description: string;
      image: string;
    };
  };
  stories: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  focusAreas: {
    title: string;
    subtitle: string;
    ctaText: string;
    image: string;
  };
  finalCta: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
}

const SiteContentManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('who-we-are');
  const [formData, setFormData] = useState<SiteContentData>({
    title: '',
    description: '',
    mission: '',
    vision: '',
    values: '',
  });
  const [landingPageData, setLandingPageData] = useState<LandingPageData>({
    hero: {
      title: 'YOUR SUPPORT\nBUILDS FUTURES.\nEMPOWER\nCOMMUNITIES\nTODAY.',
      subtitle: 'Join us in building resilient communities through sustainable development and humanitarian action.',
      ctaText: 'DONATE & EMPOWER',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
    },
    mission: {
      statement: 'Every day, together with you, GSDO empowers communities and helps millions of people build sustainable futures worldwide.',
    },
    fourPillars: {
      pillar1: {
        title: "We're efficient.",
        description: "Your donation does more when you give it to GSDO. 90% of the money GSDO spends goes toward our sustainable development work that transforms communities.",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
      },
      pillar2: {
        title: "We're far-reaching.",
        description: "We work across multiple continents, partnering with communities in over 25 countries to create lasting change.",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop"
      },
      pillar3: {
        title: "We're locally led.",
        description: "Our approach is rooted in community-driven development. We work directly with local communities, governments, and partner organizations to address root causes.",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop"
      },
      pillar4: {
        title: "We're trusted.",
        description: "With over 15 years of service, GSDO has built trust through sustainable development, humanitarian aid, and advocacy for social equity.",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop"
      },
    },
    stories: {
      title: 'LATEST NEWS & STORIES',
      subtitle: 'Read about our programs, people, and communities.',
      ctaText: 'SEE ALL STORIES',
    },
    focusAreas: {
      title: "WE END POVERTY BY FOCUSING ON HUNGER, HEALTH, EDUCATION, AND EQUALITY, DAILY AND IN TIMES OF CRISIS.",
      subtitle: "",
      ctaText: "LEARN ABOUT OUR WORK",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop"
    },
    finalCta: {
      title: "YOUR SUPPORT = SUSTAINABLE CHANGE",
      subtitle: "Communities around the world are building resilient futures through sustainable development. Together, we can make a lasting difference. Your support helps us empower communities and transform lives.",
      ctaText: "GIVE NOW",
    },
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshSection } = useContent();

  useEffect(() => {
    fetchSiteContent();
  }, []);

  const fetchSiteContent = async () => {
    try {
      // Fetch Who We Are section
      const { data: whoWeAreData, error: whoWeAreError } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'who_we_are')
        .maybeSingle();

      if (whoWeAreError && whoWeAreError.code !== 'PGRST116') {
        console.error('Error fetching who we are content:', whoWeAreError);
      } else if (whoWeAreData && whoWeAreData.content) {
        const content = whoWeAreData.content as any;
        setFormData({
          title: content.title || '',
          description: content.description || '',
          mission: content.mission || '',
          vision: content.vision || '',
          values: content.values || '',
        });
      }

      // Fetch Landing Page sections
      const sections = ['landing_hero', 'landing_mission', 'landing_four_pillars', 'landing_stories', 'landing_focus_areas', 'landing_final_cta'];
      
      for (const section of sections) {
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('section_key', section)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error(`Error fetching ${section} content:`, error);
        } else if (data && data.content) {
          const content = data.content as any;
          
          switch (section) {
                         case 'landing_hero':
               setLandingPageData(prev => ({
                 ...prev,
                 hero: {
                   title: content.title || prev.hero.title,
                   subtitle: content.subtitle || prev.hero.subtitle,
                   ctaText: content.ctaText || prev.hero.ctaText,
                   imageUrl: content.imageUrl || prev.hero.imageUrl,
                 }
               }));
              break;
            case 'landing_mission':
              setLandingPageData(prev => ({
                ...prev,
                mission: {
                  statement: content.statement || prev.mission.statement,
                }
              }));
              break;
            case 'landing_four_pillars':
              setLandingPageData(prev => ({
                ...prev,
                fourPillars: {
                  pillar1: content.pillar1 || prev.fourPillars.pillar1,
                  pillar2: content.pillar2 || prev.fourPillars.pillar2,
                  pillar3: content.pillar3 || prev.fourPillars.pillar3,
                  pillar4: content.pillar4 || prev.fourPillars.pillar4,
                }
              }));
              break;
            case 'landing_stories':
              setLandingPageData(prev => ({
                ...prev,
                stories: {
                  title: content.title || prev.stories.title,
                  subtitle: content.subtitle || prev.stories.subtitle,
                  ctaText: content.ctaText || prev.stories.ctaText,
                }
              }));
              break;
            case 'landing_focus_areas':
              setLandingPageData(prev => ({
                ...prev,
                focusAreas: {
                  title: content.title || prev.focusAreas.title,
                  subtitle: content.subtitle || prev.focusAreas.subtitle,
                  ctaText: content.ctaText || prev.focusAreas.ctaText,
                  image: content.image || prev.focusAreas.image,
                }
              }));
              break;
            case 'landing_final_cta':
              setLandingPageData(prev => ({
                ...prev,
                finalCta: {
                  title: content.title || prev.finalCta.title,
                  subtitle: content.subtitle || prev.finalCta.subtitle,
                  ctaText: content.ctaText || prev.finalCta.ctaText,
                }
              }));
              break;
          }
        }
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
      let successCount = 0;
      const totalSections = activeTab === 'who-we-are' ? 1 : 1; // For now, just save the active section

      // Save Who We Are section
      if (activeTab === 'who-we-are') {
        const contentData = {
          section_key: 'who_we_are',
          content: formData as any,
          updated_by: user?.id,
        };

        const { error } = await supabase
          .from('site_content')
          .upsert(contentData, { onConflict: 'section_key' });

        if (error) {
          console.error('Error saving who we are content:', error);
          toast({
            title: "Error saving content",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        successCount++;
        refreshSection('who_we_are');
      }

      // Save Landing Page sections based on active tab
      if (activeTab === 'landing-hero') {
        const contentData = {
          section_key: 'landing_hero',
          content: landingPageData.hero,
          updated_by: user?.id,
        };

        const { error } = await supabase
          .from('site_content')
          .upsert(contentData, { onConflict: 'section_key' });

        if (error) {
          console.error('Error saving hero content:', error);
          toast({
            title: "Error saving content",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        successCount++;
        refreshSection('landing_hero');
      }

      if (activeTab === 'landing-mission') {
        const contentData = {
          section_key: 'landing_mission',
          content: landingPageData.mission,
          updated_by: user?.id,
        };

        const { error } = await supabase
          .from('site_content')
          .upsert(contentData, { onConflict: 'section_key' });

        if (error) {
          console.error('Error saving mission content:', error);
          toast({
            title: "Error saving content",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        successCount++;
      }

      if (activeTab === 'landing-four-pillars') {
        const contentData = {
          section_key: 'landing_four_pillars',
          content: landingPageData.fourPillars,
          updated_by: user?.id,
        };

        const { error } = await supabase
          .from('site_content')
          .upsert(contentData, { onConflict: 'section_key' });

        if (error) {
          console.error('Error saving four pillars content:', error);
          toast({
            title: "Error saving content",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        successCount++;
      }

      if (activeTab === 'landing-stories') {
        const contentData = {
          section_key: 'landing_stories',
          content: landingPageData.stories,
          updated_by: user?.id,
        };

        const { error } = await supabase
          .from('site_content')
          .upsert(contentData, { onConflict: 'section_key' });

        if (error) {
          console.error('Error saving stories content:', error);
          toast({
            title: "Error saving content",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        successCount++;
        refreshSection('landing_stories');
      }

      if (activeTab === 'landing-focus-areas') {
        const contentData = {
          section_key: 'landing_focus_areas',
          content: landingPageData.focusAreas,
          updated_by: user?.id,
        };

        const { error } = await supabase
          .from('site_content')
          .upsert(contentData, { onConflict: 'section_key' });

        if (error) {
          console.error('Error saving focus areas content:', error);
          toast({
            title: "Error saving content",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        successCount++;
        refreshSection('landing_focus_areas');
      }

      if (activeTab === 'landing-final-cta') {
        const contentData = {
          section_key: 'landing_final_cta',
          content: landingPageData.finalCta,
          updated_by: user?.id,
        };

        const { error } = await supabase
          .from('site_content')
          .upsert(contentData, { onConflict: 'section_key' });

        if (error) {
          console.error('Error saving final CTA content:', error);
          toast({
            title: "Error saving content",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        successCount++;
        refreshSection('landing_final_cta');
      }

      if (successCount > 0) {
        toast({
          title: "Success",
          description: "Content updated successfully!",
        });
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
        <h3 className="text-lg font-semibold text-gsdo-black">Landing Page Content</h3>
        <p className="text-sm text-gray-600">Manage all sections of the landing page</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="who-we-are">Who We Are</TabsTrigger>
          <TabsTrigger value="landing-hero">Hero Section</TabsTrigger>
          <TabsTrigger value="landing-mission">Mission</TabsTrigger>
          <TabsTrigger value="landing-four-pillars">Four Pillars</TabsTrigger>
          <TabsTrigger value="landing-stories">Stories</TabsTrigger>
          <TabsTrigger value="landing-focus-areas">Focus Areas</TabsTrigger>
          <TabsTrigger value="landing-final-cta">Final CTA</TabsTrigger>
        </TabsList>

        {/* Who We Are Section */}
        <TabsContent value="who-we-are">
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
                  <ReactQuill
                    id="description"
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    theme="snow"
                    placeholder="Main description of your organization..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mission">Our Mission</Label>
                    <ReactQuill
                      id="mission"
                      value={formData.mission}
                      onChange={(value) => setFormData({ ...formData, mission: value })}
                      theme="snow"
                      placeholder="Your organization's mission..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vision">Our Vision</Label>
                    <ReactQuill
                      id="vision"
                      value={formData.vision}
                      onChange={(value) => setFormData({ ...formData, vision: value })}
                      theme="snow"
                      placeholder="Your organization's vision..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="values">Our Values</Label>
                    <ReactQuill
                      id="values"
                      value={formData.values}
                      onChange={(value) => setFormData({ ...formData, values: value })}
                      theme="snow"
                      placeholder="Your organization's values..."
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
        </TabsContent>

        {/* Hero Section */}
        <TabsContent value="landing-hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Main hero section content with title, subtitle, CTA button, and image
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Hero Title</Label>
                  <Input
                    id="hero-title"
                    value={landingPageData.hero.title}
                    onChange={(e) => setLandingPageData(prev => ({
                      ...prev,
                      hero: { ...prev.hero, title: e.target.value }
                    }))}
                    placeholder="YOUR SUPPORT\nBUILDS FUTURES.\nEMPOWER\nCOMMUNITIES\nTODAY."
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Use \n for line breaks to create stacked text effect
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                  <Input
                    id="hero-subtitle"
                    value={landingPageData.hero.subtitle}
                    onChange={(e) => setLandingPageData(prev => ({
                      ...prev,
                      hero: { ...prev.hero, subtitle: e.target.value }
                    }))}
                    placeholder="Join us in building resilient communities through sustainable development and humanitarian action."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-cta">CTA Button Text</Label>
                  <Input
                    id="hero-cta"
                    value={landingPageData.hero.ctaText}
                    onChange={(e) => setLandingPageData(prev => ({
                      ...prev,
                      hero: { ...prev.hero, ctaText: e.target.value }
                    }))}
                    placeholder="DONATE & EMPOWER"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-image">Hero Image URL</Label>
                  <Input
                    id="hero-image"
                    value={landingPageData.hero.imageUrl}
                    onChange={(e) => setLandingPageData(prev => ({
                      ...prev,
                      hero: { ...prev.hero, imageUrl: e.target.value }
                    }))}
                    placeholder="https://images.unsplash.com/photo-..."
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Enter a high-resolution image URL. Recommended size: 1920x1080 or larger.
                  </p>
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
        </TabsContent>

        {/* Mission Section */}
        <TabsContent value="landing-mission">
          <Card>
            <CardHeader>
              <CardTitle>Mission Statement</CardTitle>
              <CardDescription>
                The mission statement that appears below the hero section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mission-statement">Mission Statement</Label>
                  <ReactQuill
                    id="mission-statement"
                    value={landingPageData.mission.statement}
                    onChange={(value) => setLandingPageData(prev => ({
                      ...prev,
                      mission: { statement: value }
                    }))}
                    theme="snow"
                    placeholder="Mission statement..."
                  />
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
        </TabsContent>

        {/* Four Pillars Section */}
        <TabsContent value="landing-four-pillars">
          <Card>
            <CardHeader>
              <CardTitle>Four Pillars Section</CardTitle>
              <CardDescription>
                The four pillars that showcase GSDO's approach and impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {[1, 2, 3, 4].map((pillarNum) => (
                  <div key={pillarNum} className="border rounded-lg p-6 space-y-4">
                    <h4 className="font-semibold text-lg">Pillar {pillarNum}</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`pillar${pillarNum}-title`}>Title</Label>
                      <Input
                        id={`pillar${pillarNum}-title`}
                        value={landingPageData.fourPillars[`pillar${pillarNum}` as keyof typeof landingPageData.fourPillars].title}
                        onChange={(e) => setLandingPageData(prev => ({
                          ...prev,
                          fourPillars: {
                            ...prev.fourPillars,
                            [`pillar${pillarNum}`]: {
                              ...prev.fourPillars[`pillar${pillarNum}` as keyof typeof prev.fourPillars],
                              title: e.target.value
                            }
                          }
                        }))}
                        placeholder={`Pillar ${pillarNum} title`}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`pillar${pillarNum}-description`}>Description</Label>
                      <ReactQuill
                        id={`pillar${pillarNum}-description`}
                        value={landingPageData.fourPillars[`pillar${pillarNum}` as keyof typeof landingPageData.fourPillars].description}
                        onChange={(value) => setLandingPageData(prev => ({
                          ...prev,
                          fourPillars: {
                            ...prev.fourPillars,
                            [`pillar${pillarNum}`]: {
                              ...prev.fourPillars[`pillar${pillarNum}` as keyof typeof prev.fourPillars],
                              description: value
                            }
                          }
                        }))}
                        theme="snow"
                        placeholder={`Pillar ${pillarNum} description`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`pillar${pillarNum}-image`}>Image URL</Label>
                      <Input
                        id={`pillar${pillarNum}-image`}
                        value={landingPageData.fourPillars[`pillar${pillarNum}` as keyof typeof landingPageData.fourPillars].image}
                        onChange={(e) => setLandingPageData(prev => ({
                          ...prev,
                          fourPillars: {
                            ...prev.fourPillars,
                            [`pillar${pillarNum}`]: {
                              ...prev.fourPillars[`pillar${pillarNum}` as keyof typeof prev.fourPillars],
                              image: e.target.value
                            }
                          }
                        }))}
                        placeholder="Image URL"
                        required
                      />
                    </div>
                  </div>
                ))}

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
        </TabsContent>

        {/* Stories Section */}
        <TabsContent value="landing-stories">
          <Card>
            <CardHeader>
              <CardTitle>Stories Section</CardTitle>
              <CardDescription>
                The stories section that displays featured stories on the landing page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="stories-title">Section Title</Label>
                  <Input
                    id="stories-title"
                    value={landingPageData.stories.title}
                    onChange={(e) => setLandingPageData(prev => ({
                      ...prev,
                      stories: { ...prev.stories, title: e.target.value }
                    }))}
                    placeholder="STORIES THAT MATTER"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stories-subtitle">Subtitle</Label>
                  <Input
                    id="stories-subtitle"
                    value={landingPageData.stories.subtitle}
                    onChange={(e) => setLandingPageData(prev => ({
                      ...prev,
                      stories: { ...prev.stories, subtitle: e.target.value }
                    }))}
                    placeholder="Read about our programs, people, and communities."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stories-cta">CTA Button Text</Label>
                  <Input
                    id="stories-cta"
                    value={landingPageData.stories.ctaText}
                    onChange={(e) => setLandingPageData(prev => ({
                      ...prev,
                      stories: { ...prev.stories, ctaText: e.target.value }
                    }))}
                    placeholder="SEE ALL STORIES"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>Content Note</Label>
                  <p className="text-sm text-gray-600">
                    This section automatically displays the latest 4 published news articles from the News & Stories page. 
                    To manage the articles, go to the News Manager in the admin panel.
                  </p>
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
        </TabsContent>

        {/* Focus Areas Section */}
        <TabsContent value="landing-focus-areas">
          <Card>
            <CardHeader>
              <CardTitle>Focus Areas Section</CardTitle>
              <CardDescription>
                The focus areas section with title, subtitle, CTA, and image
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="focus-title">Title</Label>
                  <Input
                    id="focus-title"
                    value={landingPageData.focusAreas.title}
                    onChange={(e) => setLandingPageData(prev => ({
                      ...prev,
                      focusAreas: { ...prev.focusAreas, title: e.target.value }
                    }))}
                    placeholder="WE END POVERTY BY FOCUSING ON..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus-subtitle">Subtitle</Label>
                  <Input
                    id="focus-subtitle"
                    value={landingPageData.focusAreas.subtitle}
                    onChange={(e) => setLandingPageData(prev => ({
                      ...prev,
                      focusAreas: { ...prev.focusAreas, subtitle: e.target.value }
                    }))}
                    placeholder="Optional subtitle"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus-cta">CTA Button Text</Label>
                  <Input
                    id="focus-cta"
                    value={landingPageData.focusAreas.ctaText}
                    onChange={(e) => setLandingPageData(prev => ({
                      ...prev,
                      focusAreas: { ...prev.focusAreas, ctaText: e.target.value }
                    }))}
                    placeholder="LEARN ABOUT OUR WORK"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus-image">Image URL</Label>
                  <Input
                    id="focus-image"
                    value={landingPageData.focusAreas.image}
                    onChange={(e) => setLandingPageData(prev => ({
                      ...prev,
                      focusAreas: { ...prev.focusAreas, image: e.target.value }
                    }))}
                    placeholder="Image URL"
                    required
                  />
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
        </TabsContent>

        {/* Final CTA Section */}
        <TabsContent value="landing-final-cta">
          <Card>
            <CardHeader>
              <CardTitle>Final CTA Section</CardTitle>
              <CardDescription>
                The final call-to-action section with title, subtitle, and CTA button
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="final-cta-title">Title</Label>
                  <Input
                    id="final-cta-title"
                    value={landingPageData.finalCta.title}
                    onChange={(e) => setLandingPageData(prev => ({
                      ...prev,
                      finalCta: { ...prev.finalCta, title: e.target.value }
                    }))}
                    placeholder="YOUR SUPPORT = SUSTAINABLE CHANGE"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="final-cta-subtitle">Subtitle</Label>
                  <ReactQuill
                    id="final-cta-subtitle"
                    value={landingPageData.finalCta.subtitle}
                    onChange={(value) => setLandingPageData(prev => ({
                      ...prev,
                      finalCta: { ...prev.finalCta, subtitle: value }
                    }))}
                    theme="snow"
                    placeholder="Final CTA subtitle..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="final-cta-button">CTA Button Text</Label>
                  <Input
                    id="final-cta-button"
                    value={landingPageData.finalCta.ctaText}
                    onChange={(e) => setLandingPageData(prev => ({
                      ...prev,
                      finalCta: { ...prev.finalCta, ctaText: e.target.value }
                    }))}
                    placeholder="GIVE NOW"
                    required
                  />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteContentManager;
