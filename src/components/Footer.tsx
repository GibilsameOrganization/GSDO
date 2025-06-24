import { Link } from "react-router-dom";
import NewsletterSignup from "./NewsletterSignup";

const Footer = () => {
  return (
    <footer className="bg-gsdo-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
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
              Empowering communities worldwide through sustainable development, social equity, and humanitarian aid.
            </p>
            
            {/* Newsletter */}
            <NewsletterSignup />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/our-work" className="text-gray-300 hover:text-white transition-colors">Our Work</Link></li>
              <li><Link to="/get-involved" className="text-gray-300 hover:text-white transition-colors">Get Involved</Link></li>
              <li><Link to="/news" className="text-gray-300 hover:text-white transition-colors">News & Stories</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
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
            
            {/* Social Media */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/share/1CLnjJy3LG/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-royal-blue transition-colors"
                >
                  Facebook
                </a>
                <a href="#" className="text-gray-300 hover:text-royal-blue transition-colors">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-royal-blue transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Gibilsame Sustainable Development Organization. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
