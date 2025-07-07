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

interface ImpactMetric {
  id: string;
  metric_key: string;
  value: number;
  label: string;
  description: string | null;
  order_index: number;
  active: boolean;
}

const ImpactMetricsManager = () => {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<ImpactMetric | null>(null);
  const [formData, setFormData] = useState({
    metric_key: '',
    value: '',
    label: '',
    description: '',
    active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    const { data, error } = await supabase
      .from('impact_metrics')
      .select('*')
      .order('order_index');

    if (error) {
      toast({
        title: "Error fetching metrics",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMetrics(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const metricData = {
      metric_key: formData.metric_key,
      value: parseInt(formData.value),
      label: formData.label,
      description: formData.description || null,
      order_index: editingMetric ? editingMetric.order_index : (metrics.length + 1),
      active: formData.active,
    };

    if (editingMetric) {
      const { error } = await supabase
        .from('impact_metrics')
        .update(metricData)
        .eq('id', editingMetric.id);

      if (error) {
        toast({
          title: "Error updating metric",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Metric updated successfully!",
        });
        fetchMetrics();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('impact_metrics')
        .insert([metricData]);

      if (error) {
        toast({
          title: "Error creating metric",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Metric created successfully!",
        });
        fetchMetrics();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('impact_metrics')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting metric",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Metric deleted successfully!",
      });
      fetchMetrics();
    }
  };

  const resetForm = () => {
    setFormData({
      metric_key: '',
      value: '',
      label: '',
      description: '',
      active: true,
    });
    setEditingMetric(null);
  };

  const openEditDialog = (metric: ImpactMetric) => {
    setEditingMetric(metric);
    setFormData({
      metric_key: metric.metric_key,
      value: metric.value.toString(),
      label: metric.label,
      description: metric.description || '',
      active: metric.active ?? true,
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
          <h3 className="text-lg font-semibold text-gsdo-black">Impact Metrics</h3>
          <p className="text-sm text-gray-600">Manage the impact metrics displayed on your homepage</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-royal-blue hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Metric
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingMetric ? 'Edit Metric' : 'Add New Metric'}</DialogTitle>
              <DialogDescription>
                {editingMetric ? 'Update the metric details' : 'Create a new impact metric'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metric_key">Metric Key</Label>
                <Input
                  id="metric_key"
                  value={formData.metric_key}
                  onChange={(e) => setFormData({ ...formData, metric_key: e.target.value })}
                  placeholder="e.g., lives, projects, communities"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Lives Impacted"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the metric"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-royal-blue"
                />
                <Label htmlFor="active">Active (show on homepage)</Label>
              </div>
              <Button type="submit" className="w-full bg-royal-blue hover:bg-blue-700">
                {editingMetric ? 'Update Metric' : 'Create Metric'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-royal-blue mb-2">
                  {metric.value.toLocaleString()}
                </div>
                <div className="text-lg font-semibold text-gsdo-black">
                  {metric.label}
                </div>
                {metric.description && (
                  <div className="text-sm text-gray-600 mt-2">
                    {metric.description}
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={() => openEditDialog(metric)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(metric.id)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImpactMetricsManager;
