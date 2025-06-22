
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterSignupProps {
  variant?: 'inline' | 'card';
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ variant = 'inline' }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: name || 'Newsletter Subscriber',
          email,
          subject: 'Newsletter Subscription',
          message: 'Newsletter subscription request',
          type: 'newsletter'
        }
      });

      if (error) throw error;

      toast({
        title: "Successfully subscribed!",
        description: "Welcome to our newsletter. Check your email for confirmation.",
      });

      setEmail('');
      setName('');
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'card') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gsdo-black mb-2">Stay Updated</h3>
        <p className="text-gray-600 mb-4">
          Subscribe to our newsletter for the latest updates on our sustainable development work.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            className="w-full bg-royal-blue hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-semibold mb-3">Stay Connected</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-gsdo-black"
        />
        <div className="flex">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-r-none text-gsdo-black"
            required
          />
          <Button 
            type="submit"
            className="bg-royal-blue hover:bg-blue-700 px-6 rounded-l-none"
            disabled={loading}
          >
            {loading ? "..." : "Subscribe"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewsletterSignup;
