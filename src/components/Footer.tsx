
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
              <div className="w-10 h-10 bg-royal-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
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
              <p>123 Development Street</p>
              <p>Global City, GC 12345</p>
              <p>+1 (555) 123-4567</p>
              <p>info@gsdo.org</p>
            </div>
            
            {/* Social Media */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-royal-blue transition-colors">Facebook</a>
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
