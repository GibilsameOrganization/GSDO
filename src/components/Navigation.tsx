
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

  return (
    <header 
      className="site-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#0056d9',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      <nav 
        className="navbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* Logo */}
        <Link 
          to="/" 
          className="logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#ffffff',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '1.5rem'
          }}
        >
          <img 
            src="https://zpnoanzthieyqjwkvelw.supabase.co/storage/v1/object/public/photos//IMG_4436.jpeg"
            alt="GSDO Logo"
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'cover',
              borderRadius: '4px'
            }}
          />
          GSDO
        </Link>

        {/* Mobile menu toggle */}
        <input 
          type="checkbox" 
          id="nav-toggle" 
          className="nav-toggle" 
          checked={isMenuOpen}
          onChange={(e) => setIsMenuOpen(e.target.checked)}
          style={{ display: 'none' }}
        />
        <label 
          htmlFor="nav-toggle" 
          className="hamburger" 
          aria-label="Menu"
          style={{
            display: 'none',
            flexDirection: 'column',
            cursor: 'pointer',
            padding: '0.5rem',
            zIndex: 1001
          }}
        >
          <span style={{ width: '25px', height: '3px', background: '#ffffff', margin: '3px 0', transition: 'all 0.3s ease' }}></span>
          <span style={{ width: '25px', height: '3px', background: '#ffffff', margin: '3px 0', transition: 'all 0.3s ease' }}></span>
          <span style={{ width: '25px', height: '3px', background: '#ffffff', margin: '3px 0', transition: 'all 0.3s ease' }}></span>
        </label>

        {/* Navigation Links */}
        <ul 
          className="nav-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}
        >
          <li>
            <Link 
              to="/our-work"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Our Work
            </Link>
          </li>
          <li>
            <Link 
              to="/news"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              News & Stories
            </Link>
          </li>
          <li>
            <Link 
              to="/get-involved"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              How to Help
            </Link>
          </li>
          <li>
            <Link 
              to="/about"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link 
              to="/donate" 
              className="btn-donate"
              style={{
                background: '#ff7b2e',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontWeight: '700',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e65a1a';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ff7b2e';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              Donate
            </Link>
          </li>
          {user && (
            <>
              {isAdmin && (
                <li>
                  <button 
                    onClick={() => navigate('/manage')}
                    style={{
                      background: 'transparent',
                      border: '1px solid #ffffff',
                      color: '#ffffff',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      fontWeight: '600',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.color = '#0056d9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                  >
                    Admin
                  </button>
                </li>
              )}
              <li>
                <button 
                  onClick={handleSignOut}
                  style={{
                    background: 'transparent',
                    border: '1px solid #ffffff',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#0056d9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
