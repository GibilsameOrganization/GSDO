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

          {/* Right Side - Navigation Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/our-work" className="text-gray-300 hover:text-white transition-colors">Our Work</Link></li>
                <li><Link to="/get-involved" className="text-gray-300 hover:text-white transition-colors">How to Help</Link></li>
                <li><Link to="/donate" className="text-gray-300 hover:text-white transition-colors">Ways to Give</Link></li>
                <li><Link to="/news" className="text-gray-300 hover:text-white transition-colors">News & Stories</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/donate" className="text-gray-300 hover:text-white transition-colors">Donate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">More</h4>
              <ul className="space-y-2">
                <li><Link to="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/partnerships" className="text-gray-300 hover:text-white transition-colors">Corporate Partnerships</Link></li>
                <li><Link to="/reports" className="text-gray-300 hover:text-white transition-colors">Annual Reports</Link></li>
                <li><Link to="/transparency" className="text-gray-300 hover:text-white transition-colors">Accountability & Transparency</Link></li>
                <li><Link to="/financial" className="text-gray-300 hover:text-white transition-colors">Financial Responsibility</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CareFooter; 