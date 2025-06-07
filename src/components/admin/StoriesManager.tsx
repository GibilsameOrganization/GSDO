
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  excerpt: string;
  location: string;
  impact: string;
  image_url: string;
  order_index: number;
  active: boolean;
}

const StoriesManager = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    location: '',
    impact: '',
    image_url: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('order_index');

    if (error) {
      toast({
        title: "Error fetching stories",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setStories(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const storyData = {
      ...formData,
      order_index: editingStory ? editingStory.order_index : (stories.length + 1),
    };

    if (editingStory) {
      const { error } = await supabase
        .from('stories')
        .update(storyData)
        .eq('id', editingStory.id);

      if (error) {
        toast({
          title: "Error updating story",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Story updated successfully!",
        });
        fetchStories();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('stories')
        .insert([storyData]);

      if (error) {
        toast({
          title: "Error creating story",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Story created successfully!",
        });
        fetchStories();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting story",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Story deleted successfully!",
      });
      fetchStories();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      location: '',
      impact: '',
      image_url: '',
    });
    setEditingStory(null);
  };

  const openEditDialog = (story: Story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      excerpt: story.excerpt,
      location: story.location,
      impact: story.impact,
      image_url: story.image_url,
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gsdo-black">Field Stories</h3>
          <p className="text-sm text-gray-600">Manage the stories displayed in the carousel</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-royal-blue hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingStory ? 'Edit Story' : 'Add New Story'}</DialogTitle>
              <DialogDescription>
                {editingStory ? 'Update the story details' : 'Create a new field story'}
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
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="impact">Impact</Label>
                <Input
                  id="impact"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  placeholder="e.g., 500 families served"
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
              <Button type="submit" className="w-full bg-royal-blue hover:bg-blue-700">
                {editingStory ? 'Update Story' : 'Create Story'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {stories.map((story) => (
          <Card key={story.id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={story.image_url}
                  alt={story.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gsdo-black">{story.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">{story.excerpt}</p>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Location:</span> {story.location} | 
                    <span className="font-medium"> Impact:</span> {story.impact}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => openEditDialog(story)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(story.id)}
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
      </div>
    </div>
  );
};

export default StoriesManager;
