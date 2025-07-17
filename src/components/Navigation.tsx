
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-royal-blue shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-white font-bold text-xl lg:text-2xl"
          >
            <img 
              src="https://zpnoanzthieyqjwkvelw.supabase.co/storage/v1/object/public/photos//IMG_4436.jpeg"
              alt="GSDO Logo"
              className="w-8 h-8 lg:w-10 lg:h-10 object-cover rounded"
            />
            <span>GSDO</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link 
              to="/our-work"
              className="text-white font-semibold text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
            >
              Our Work
            </Link>
            <Link 
              to="/news"
              className="text-white font-semibold text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
            >
              News & Stories
            </Link>
            <Link 
              to="/get-involved"
              className="text-white font-semibold text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
            >
              How to Help
            </Link>
            <Link 
              to="/about"
              className="text-white font-semibold text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
            >
              About Us
            </Link>
            <Link 
              to="/donate" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 lg:px-6 lg:py-3 rounded font-bold text-sm uppercase tracking-wide transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Donate
            </Link>
            {user && (
              <>
                {isAdmin && (
                  <button 
                    onClick={() => navigate('/manage')}
                    className="bg-transparent border border-white text-white px-3 py-2 rounded font-semibold text-xs hover:bg-white hover:text-royal-blue transition-colors duration-200"
                  >
                    Admin
                  </button>
                )}
                <button 
                  onClick={handleSignOut}
                  className="bg-transparent border border-white text-white px-3 py-2 rounded font-semibold text-xs hover:bg-white hover:text-royal-blue transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="py-4 space-y-4 border-t border-blue-600">
            <Link 
              to="/our-work"
              className="block text-white font-semibold text-base py-2 hover:bg-blue-700 px-4 rounded transition-colors"
            >
              Our Work
            </Link>
            <Link 
              to="/news"
              className="block text-white font-semibold text-base py-2 hover:bg-blue-700 px-4 rounded transition-colors"
            >
              News & Stories
            </Link>
            <Link 
              to="/get-involved"
              className="block text-white font-semibold text-base py-2 hover:bg-blue-700 px-4 rounded transition-colors"
            >
              How to Help
            </Link>
            <Link 
              to="/about"
              className="block text-white font-semibold text-base py-2 hover:bg-blue-700 px-4 rounded transition-colors"
            >
              About Us
            </Link>
            <Link 
              to="/donate" 
              className="block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-bold text-base text-center transition-colors"
            >
              Donate
            </Link>
            {user && (
              <div className="pt-4 border-t border-blue-600 space-y-2">
                {isAdmin && (
                  <button 
                    onClick={() => navigate('/manage')}
                    className="w-full text-left bg-transparent border border-white text-white px-4 py-2 rounded font-semibold text-sm hover:bg-white hover:text-royal-blue transition-colors"
                  >
                    Admin
                  </button>
                )}
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left bg-transparent border border-white text-white px-4 py-2 rounded font-semibold text-sm hover:bg-white hover:text-royal-blue transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
