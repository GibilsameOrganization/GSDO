
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Our Work", path: "/our-work" },
    { name: "Get Involved", path: "/get-involved" },
    { name: "News", path: "/news" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-royal-blue/95 backdrop-blur-md shadow-lg' 
        : 'bg-royal-blue'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg overflow-hidden ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                <img 
                  src="https://zpnoanzthieyqjwkvelw.supabase.co/storage/v1/object/public/photos//IMG_4436.jpeg" 
                  alt="GSDO Logo" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white group-hover:text-gray-100 transition-colors">GSDO</span>
                <p className="text-xs text-white/80 hidden sm:block">Sustainable Development</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 relative overflow-hidden group ${
                  location.pathname === item.path 
                    ? 'bg-white/20 text-white' 
                    : 'hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-white/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            ))}
            
            <Link
              to="/donate"
              className="ml-4 bg-white text-royal-blue px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Donate
            </Link>
            
            {/* Auth Buttons */}
            {user && (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-white/20">
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/30 text-white hover:bg-white hover:text-royal-blue transition-all"
                    onClick={() => navigate('/manage')}
                  >
                    Admin
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/30 text-white hover:bg-white hover:text-royal-blue transition-all"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-2 pt-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-3 text-white hover:bg-white/10 transition-all duration-200 rounded-lg ${
                  location.pathname === item.path ? 'bg-white/20' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <Link
              to="/donate"
              className="block mx-4 my-3 bg-white text-royal-blue px-4 py-3 rounded-lg font-semibold text-center hover:bg-gray-100 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Donate Now
            </Link>
            
            {/* Mobile Auth Buttons */}
            {user && (
              <div className="pt-3 mt-3 border-t border-white/20">
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full mb-2 border-white/30 text-white hover:bg-white hover:text-royal-blue"
                    onClick={() => {
                      navigate('/manage');
                      setIsMenuOpen(false);
                    }}
                  >
                    Admin Panel
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-white/30 text-white hover:bg-white hover:text-royal-blue"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
