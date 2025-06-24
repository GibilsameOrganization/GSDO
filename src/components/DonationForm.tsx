import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Heart, Users, Globe } from 'lucide-react';

const DonationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    message: '',
    donationType: 'one-time'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Form submission started with data:', {
      name: formData.name,
      email: formData.email,
      amount: formData.amount,
      donationType: formData.donationType
    });

    try {
      const reference = `GSDO-${Date.now()}`;
      console.log('Generated reference:', reference);

      console.log('Calling supabase function...');
      const { error, data } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          amount: formData.amount,
          message: formData.message,
          donationType: formData.donationType,
          type: 'donation'
        }
      });

      console.log('Supabase function response:', { error, data });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Email sent successfully, navigating to confirmation page...');
      
      // Navigate to confirmation page with donation details
      const navigationState = {
        donationReference: reference,
        donorName: formData.name,
        donorEmail: formData.email,
        amount: formData.amount,
        donationType: formData.donationType
      };

      console.log('Navigation state prepared:', navigationState);

      navigate('/donation-confirmation', {
        state: navigationState
      });

      console.log('Navigation function called successfully');

      // Reset form after successful navigation
      setFormData({
        name: '',
        email: '',
        phone: '',
        amount: '',
        message: '',
        donationType: 'one-time'
      });

      console.log('Form reset completed');
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      toast({
        title: "Submission failed",
        description: `Error: ${error.message || 'Please try again later or contact us directly.'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('Form submission completed, loading set to false');
    }
  };

  const impactExamples = [
    { amount: 50, impact: "Provides clean water for a family of 5 for one month" },
    { amount: 100, impact: "Funds school supplies for 10 children" },
    { amount: 250, impact: "Supports a community health worker for one month" },
    { amount: 500, impact: "Builds a sanitation facility for a rural school" }
  ];



  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-royal-blue rounded-lg flex items-center justify-center mr-4">
              <Heart className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gsdo-black">Make a Donation</h2>
              <p className="text-gray-600">Every contribution makes a difference</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gsdo-black">Your Information</h3>
              
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Donation Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gsdo-black">Donation Details</h3>
              
              <div>
                <Label htmlFor="donationType">Donation Type</Label>
                <select
                  id="donationType"
                  name="donationType"
                  value={formData.donationType}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="one-time">One-time Donation</option>
                  <option value="monthly">Monthly Donation</option>
                  <option value="quarterly">Quarterly Donation</option>
                  <option value="annual">Annual Donation</option>
                </select>
              </div>

              <div>
                <Label htmlFor="amount">Donation Amount (USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter amount"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Share why you're supporting our cause or any special instructions..."
                  rows={4}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-royal-blue hover:bg-blue-700 h-12 text-lg"
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed with Donation"}
            </Button>



            <p className="text-sm text-gray-600 text-center">
              After submitting, you'll be redirected to a confirmation page with complete banking details and next steps.
            </p>
          </form>
        </div>

        {/* Impact Information */}
        <div className="space-y-6">
          {/* Impact Examples */}
          <div className="bg-light-gray p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gsdo-black mb-4 flex items-center">
              <Globe className="mr-2 text-royal-blue" size={20} />
              Your Impact
            </h3>
            <div className="space-y-4">
              {impactExamples.map((example, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <div className="w-16 h-8 bg-royal-blue rounded flex items-center justify-center text-white font-semibold text-sm">
                    ${example.amount}
                  </div>
                  <p className="text-gray-700 text-sm flex-1">{example.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Donate */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gsdo-black mb-4 flex items-center">
              <Users className="mr-2 text-royal-blue" size={20} />
              Why Your Donation Matters
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-royal-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>100% of donations go directly to programs and communities in need</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-royal-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Transparent reporting on how your money is used</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-royal-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Direct impact on sustainable development goals</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-royal-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Regular updates on project progress and outcomes</span>
              </li>
            </ul>
          </div>

          {/* Security Info */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Secure & Trusted</h4>
            <p className="text-green-700 text-sm">
              Your information is protected with bank-level security. We never store sensitive payment information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
