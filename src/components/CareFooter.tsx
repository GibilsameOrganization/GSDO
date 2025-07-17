import React from "react";
import { Link } from "react-router-dom";

const CareFooter = () => {
  return (
    <footer className="bg-gsdo-black text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Left Side - Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden">
                <img 
                  src="https://zpnoanzthieyqjwkvelw.supabase.co/storage/v1/object/public/photos//IMG_4436.jpeg" 
                  alt="GSDO Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-lg md:text-xl font-bold">GSDO</span>
                <p className="text-xs md:text-sm text-gray-300">Gibilsame Sustainable Development Organization</p>
              </div>
            </div>
            <p className="text-sm md:text-base text-gray-300 mb-6 max-w-md leading-relaxed">
              Empowering communities worldwide through sustainable development, social equity, and humanitarian aid. GSDO works to create lasting change in communities across the globe.
            </p>
          </div>

          {/* Middle - 90% Circle */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-royal-blue rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg md:text-2xl">90%</span>
            </div>
            <p className="text-gray-300 text-center md:text-left mb-2 text-sm md:text-base">of all our expenses go to program services</p>
            <Link to="/about" className="text-blue-400 hover:text-blue-300 text-xs md:text-sm">
              Learn more
            </Link>
          </div>

          {/* Right Side - Contact Information */}
          <div className="space-y-6 md:space-y-8">
            {/* Contact Us */}
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-base md:text-lg">Contact Us</h4>
              <div className="space-y-2 text-gray-300 text-sm md:text-base">
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
              <h4 className="font-semibold mb-3 text-base md:text-lg">Follow Us</h4>
              <div className="flex space-x-4 md:space-x-6">
                <a href="#" className="text-gray-300 hover:text-royal-blue transition-colors text-sm md:text-base">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-royal-blue transition-colors text-sm md:text-base">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-royal-blue transition-colors text-sm md:text-base">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CareFooter; 