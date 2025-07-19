import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type VolunteerOpportunity = Database['public']['Tables']['volunteer_opportunities']['Row'];

const VolunteerOpportunitiesManager = () => {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    duration: '',
    requirements: '',
    benefits: '',
    application_deadline: '',
    start_date: '',
    end_date: '',
    type: 'volunteer',
    status: 'active',
    category: '',
    tags: '',
    contact_email: '',
    contact_phone: '',
    application_url: '',
    image_url: '',
    active: true,
    order_index: 0,
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const opportunityTypes = [
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'internship', label: 'Internship' },
    { value: 'job', label: 'Job' },
    { value: 'tender', label: 'Tender' },
  ];

  const opportunityStatuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'closed', label: 'Closed' },
    { value: 'filled', label: 'Filled' },
  ];

  const categories = [
    'Field Work',
    'Education',
    'Health',
    'Environment',
    'Digital',
    'Fundraising',
    'Language',
    'Research',
    'Community',
    'Administration',
  ];

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    const { data, error } = await supabase
      .from('volunteer_opportunities')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      toast({
        title: "Error fetching opportunities",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setOpportunities(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      duration: '',
      requirements: '',
      benefits: '',
      application_deadline: '',
      start_date: '',
      end_date: '',
      type: 'volunteer',
      status: 'active',
      category: '',
      tags: '',
      contact_email: '',
      contact_phone: '',
      application_url: '',
      image_url: '',
      active: true,
      order_index: 0,
    });
    setEditingOpportunity(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location || !formData.duration) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const opportunityData = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      duration: formData.duration,
      requirements: formData.requirements || null,
      benefits: formData.benefits || null,
      application_deadline: formData.application_deadline || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      type: formData.type,
      status: formData.status,
      category: formData.category || null,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      application_url: formData.application_url || null,
      image_url: formData.image_url || null,
      active: formData.active,
      order_index: formData.order_index,
      updated_at: new Date().toISOString(),
    };

    if (editingOpportunity) {
      // Update existing opportunity
      const { error } = await supabase
        .from('volunteer_opportunities')
        .update(opportunityData)
        .eq('id', editingOpportunity.id);

      if (error) {
        toast({
          title: "Error updating opportunity",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Opportunity updated successfully!",
        });
        setIsDialogOpen(false);
        resetForm();
        fetchOpportunities();
      }
    } else {
      // Create new opportunity
      const { error } = await supabase
        .from('volunteer_opportunities')
        .insert({
          ...opportunityData,
          created_at: new Date().toISOString(),
          created_by: user?.id,
        });

      if (error) {
        toast({
          title: "Error creating opportunity",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Opportunity created successfully!",
        });
        setIsDialogOpen(false);
        resetForm();
        fetchOpportunities();
      }
    }
  };

  const handleEdit = (opportunity: VolunteerOpportunity) => {
    setEditingOpportunity(opportunity);
    setFormData({
      title: opportunity.title,
      description: opportunity.description,
      location: opportunity.location,
      duration: opportunity.duration,
      requirements: opportunity.requirements || '',
      benefits: opportunity.benefits || '',
      application_deadline: opportunity.application_deadline || '',
      start_date: opportunity.start_date || '',
      end_date: opportunity.end_date || '',
      type: opportunity.type,
      status: opportunity.status,
      category: opportunity.category || '',
      tags: opportunity.tags ? opportunity.tags.join(', ') : '',
      contact_email: opportunity.contact_email || '',
      contact_phone: opportunity.contact_phone || '',
      application_url: opportunity.application_url || '',
      image_url: opportunity.image_url || '',
      active: opportunity.active || true,
      order_index: opportunity.order_index || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      const { error } = await supabase
        .from('volunteer_opportunities')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting opportunity",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Opportunity deleted successfully!",
        });
        fetchOpportunities();
      }
    }
  };

  const toggleActive = async (opportunity: VolunteerOpportunity) => {
    const { error } = await supabase
      .from('volunteer_opportunities')
      .update({ active: !opportunity.active })
      .eq('id', opportunity.id);

    if (error) {
      toast({
        title: "Error updating opportunity",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Opportunity ${opportunity.active ? 'deactivated' : 'activated'} successfully!`,
      });
      fetchOpportunities();
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading opportunities...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gsdo-black">Volunteer Opportunities</h2>
          <p className="text-gray-600">Manage volunteer opportunities, internships, jobs, and tenders</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for the volunteer opportunity
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Field Program Assistant"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Kenya"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 6-12 months"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {opportunityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {opportunityStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order_index">Display Order</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <ReactQuill
                  id="description"
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  theme="snow"
                  placeholder="Detailed description of the opportunity..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'color': [] }, { 'background': [] }],
                      ['link'],
                      ['clean']
                    ]
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="requirements">Requirements</Label>
                  <ReactQuill
                    id="requirements"
                    value={formData.requirements}
                    onChange={(value) => setFormData({ ...formData, requirements: value })}
                    theme="snow"
                    placeholder="Skills, experience, and qualifications needed..."
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link'],
                        ['clean']
                      ]
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="benefits">Benefits</Label>
                  <ReactQuill
                    id="benefits"
                    value={formData.benefits}
                    onChange={(value) => setFormData({ ...formData, benefits: value })}
                    theme="snow"
                    placeholder="What volunteers will gain from this opportunity..."
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link'],
                        ['clean']
                      ]
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="application_deadline">Application Deadline</Label>
                  <Input
                    id="application_deadline"
                    type="date"
                    value={formData.application_deadline}
                    onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="application_url">Application URL</Label>
                <Input
                  id="application_url"
                  type="url"
                  value={formData.application_url}
                  onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                  placeholder="https://example.com/apply"
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="water, sanitation, community, rural"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingOpportunity ? 'Update' : 'Create'} Opportunity
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {opportunity.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {opportunity.duration}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={opportunity.type === 'volunteer' ? 'default' : 'secondary'}>
                    {opportunity.type}
                  </Badge>
                  <Badge variant={opportunity.status === 'active' ? 'default' : 'outline'}>
                    {opportunity.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {opportunity.description}
              </p>
              
              {opportunity.category && (
                <div className="mb-3">
                  <Badge variant="outline" className="text-xs">
                    {opportunity.category}
                  </Badge>
                </div>
              )}

              {opportunity.tags && opportunity.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {opportunity.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {opportunity.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{opportunity.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleActive(opportunity)}
                  >
                    {opportunity.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(opportunity)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(opportunity.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500">
                  Order: {opportunity.order_index}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {opportunities.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities yet</h3>
          <p className="text-gray-600">Create your first volunteer opportunity to get started.</p>
        </div>
      )}
    </div>
  );
};

export default VolunteerOpportunitiesManager; 