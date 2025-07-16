import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MailingListSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Form */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Sign up for our mailing list.</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  FIRST NAME*
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  LAST NAME*
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  EMAIL*
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="bg-royal-blue hover:bg-blue-700 text-white px-8 py-3 font-semibold rounded-lg"
              >
                SUBMIT
              </Button>
            </form>
            <p className="text-sm text-gray-600">
              Text GSDO to 227287 and reCAPTCHA protection
            </p>
          </div>
          
          {/* Right Side - Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop"
              alt="Woman with children"
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-royal-blue rounded-full opacity-80"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MailingListSection; 