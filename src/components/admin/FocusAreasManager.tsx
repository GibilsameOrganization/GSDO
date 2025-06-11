
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
import { Trash2, Plus } from 'lucide-react';

interface FocusArea {
  title: string;
  description: string;
  color: string;
  icon: string;
}

const FocusAreasManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshSection } = useContent();

  useEffect(() => {
    fetchFocusAreas();
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
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      // Trigger content refresh on the frontend
      refreshSection('focus_areas');
      console.log('FocusAreasManager: Content saved, triggering refresh');
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gsdo-black">Focus Areas</h3>
        <p className="text-sm text-gray-600">Manage the "Our Focus Areas" section content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Focus Areas Section</CardTitle>
          <CardDescription>
            Edit the focus areas that appear on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Textarea
                      id={`description-${index}`}
                      value={area.description}
                      onChange={(e) => updateFocusArea(index, 'description', e.target.value)}
                      placeholder="Focus area description"
                      required
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
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusAreasManager;
