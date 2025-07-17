import React from "react";
import { Link } from "react-router-dom";

const CareFooter = () => {
  return (
    <footer className="bg-gsdo-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Side - Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src="https://zpnoanzthieyqjwkvelw.supabase.co/storage/v1/object/public/photos//IMG_4436.jpeg" 
                  alt="GSDO Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-bold">GSDO</span>
                <p className="text-sm text-gray-300">Gibilsame Sustainable Development Organization</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering communities worldwide through sustainable development, social equity, and humanitarian aid. GSDO works to create lasting change in communities across the globe.
            </p>
          </div>

          {/* Middle - 90% Circle */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-royal-blue rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">90%</span>
            </div>
            <p className="text-gray-300 text-center mb-2">of all our expenses go to program services</p>
            <Link to="/about" className="text-blue-400 hover:text-blue-300 text-sm">
              Learn more
            </Link>
          </div>

          {/* Right Side - Contact Information */}
          <div className="grid grid-cols-1 gap-8">
            {/* Contact Us */}
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-300">
                <p>J957+WMM, ERG, SNG, SL</p>
                <p>+252-637779273</p>
                <p>+252-657043360</p>
                <p className="font-medium">Gibilsame NGO</p>
                <a href="mailto:info@gibilsame.org" className="text-royal-blue hover:text-blue-300 transition-colors">
                  info@gibilsame.org
                </a>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-royal-blue transition-colors">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-royal-blue transition-colors">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-royal-blue transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CareFooter; 