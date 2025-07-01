import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  order_index: number;
  active: boolean;
}

const HeroSlidesManager = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order_index');

    if (error) {
      toast({
        title: "Error fetching slides",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSlides(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const slideData = {
      ...formData,
      order_index: editingSlide ? editingSlide.order_index : (slides.length + 1),
      active: formData.active,
    };

    if (editingSlide) {
      const { error } = await supabase
        .from('hero_slides')
        .update(slideData)
        .eq('id', editingSlide.id);

      if (error) {
        toast({
          title: "Error updating slide",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Slide updated successfully!",
        });
        fetchSlides();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('hero_slides')
        .insert([slideData]);

      if (error) {
        toast({
          title: "Error creating slide",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Slide created successfully!",
        });
        fetchSlides();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting slide",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Slide deleted successfully!",
      });
      fetchSlides();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      active: true,
    });
    setEditingSlide(null);
  };

  const openEditDialog = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      image_url: slide.image_url,
      active: slide.active ?? true,
    });
    setIsDialogOpen(true);
  };

  const toggleSlideActive = async (id: string, currentActive: boolean | null) => {
    const { error } = await supabase
      .from('hero_slides')
      .update({ active: !currentActive })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error updating slide status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Slide ${!currentActive ? 'activated' : 'deactivated'} successfully!`,
      });
      fetchSlides();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gsdo-black">Hero Slides</h3>
          <p className="text-sm text-gray-600">Manage the hero carousel slides on your homepage</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-royal-blue hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSlide ? 'Edit Slide' : 'Add New Slide'}</DialogTitle>
              <DialogDescription>
                {editingSlide ? 'Update the slide details' : 'Create a new hero slide for the homepage'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 text-royal-blue focus:ring-royal-blue border-gray-300 rounded"
                  />
                  <Label htmlFor="active">Active (show on website)</Label>
                </div>
              </div>
              <Button type="submit" className="w-full bg-royal-blue hover:bg-blue-700">
                {editingSlide ? 'Update Slide' : 'Create Slide'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {slides.map((slide) => (
          <Card key={slide.id} className={`${slide.active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gsdo-black">{slide.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      slide.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {slide.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{slide.subtitle}</p>
                  <p className="text-xs text-gray-500">Order: {slide.order_index}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => toggleSlideActive(slide.id, slide.active)}
                    variant={slide.active ? "outline" : "default"}
                    size="sm"
                    className={slide.active ? "border-green-500 text-green-600 hover:bg-green-50" : "bg-green-600 hover:bg-green-700 text-white"}
                  >
                    {slide.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    onClick={() => openEditDialog(slide)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(slide.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {slides.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hero slides found. Create your first slide to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSlidesManager;
