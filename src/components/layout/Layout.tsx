import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Don't show the navigation on auth pages
  const isAuthPage = location.pathname.includes('/login') || 
                     location.pathname.includes('/register') ||
                     location.pathname.includes('/forgot-password');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && (
        <nav className="fixed top-0 left-0 right-0 bg-white/90 shadow-md z-50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center">
                <MapPin className="h-8 w-8 text-airbnb-red" />
                <span className="ml-2 text-2xl font-extrabold tracking-tight text-airbnb-red">Rentr</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                {/* Show different navigation based on user type */}
                {(!isAuthenticated || (isAuthenticated && user?.userType === 'seeker')) && (
                  <Link to="/properties" className="text-gray-700 hover:text-airbnb-red font-medium">For Seekers</Link>
                )}
                {(!isAuthenticated || (isAuthenticated && user?.userType === 'provider')) && (
                  <Link to="/list-property" className="text-gray-700 hover:text-airbnb-red font-medium">For Providers</Link>
                )}
                {isAuthenticated && user?.userType === 'provider' && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-airbnb-red font-medium">Dashboard</Link>
                )}
                <Link to="/help" className="text-gray-700 hover:text-airbnb-red font-medium">Help</Link>
                {isAuthenticated ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 bg-airbnb-red text-white px-5 py-2 rounded-lg shadow hover:bg-airbnb-red/90">
                      <User className="h-5 w-5" />
                      <span>{user?.firstName || 'User'} {user?.lastName || ''}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                      {user?.userType === 'provider' && (
                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                      )}
                      {user?.userType === 'provider' && (
                        <Link to="/list-property" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">List Property</Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/login">
                    <button className="flex items-center space-x-2 bg-airbnb-red text-white px-5 py-2 rounded-lg shadow hover:bg-airbnb-red/90">
                      <User className="h-5 w-5" />
                      <span>Sign In</span>
                    </button>
                  </Link>
                )}
              </div>
              <div className="md:hidden">
                <button 
                  className="text-gray-500 hover:text-airbnb-red"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50 p-4">
              <div className="flex flex-col space-y-4">
                <Link to="/" className="text-gray-700 hover:text-airbnb-red font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
                {(!isAuthenticated || (isAuthenticated && user?.userType === 'seeker')) && (
                  <Link to="/properties" className="text-gray-700 hover:text-airbnb-red font-medium" onClick={() => setIsMenuOpen(false)}>For Seekers</Link>
                )}
                {(!isAuthenticated || (isAuthenticated && user?.userType === 'provider')) && (
                  <Link to="/list-property" className="text-gray-700 hover:text-airbnb-red font-medium" onClick={() => setIsMenuOpen(false)}>For Providers</Link>
                )}
                {isAuthenticated && user?.userType === 'provider' && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-airbnb-red font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                )}
                <Link to="/help" className="text-gray-700 hover:text-airbnb-red font-medium" onClick={() => setIsMenuOpen(false)}>Help</Link>
                
                {isAuthenticated ? (
                  <div className="pt-2 border-t border-gray-200">
                    <Link to="/profile" className="block py-2 text-gray-700 hover:text-airbnb-red" onClick={() => setIsMenuOpen(false)}>Your Profile</Link>
                    {user?.userType === 'provider' && (
                      <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-airbnb-red" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    )}
                    {user?.userType === 'provider' && (
                      <Link to="/list-property" className="block py-2 text-gray-700 hover:text-airbnb-red" onClick={() => setIsMenuOpen(false)}>List Property</Link>
                    )}
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left block py-2 text-gray-700 hover:text-airbnb-red"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="mt-2 block w-full text-center bg-airbnb-red text-white px-4 py-2 rounded-lg shadow hover:bg-airbnb-red/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>
      )}

      <main className={isAuthPage ? '' : 'pt-16'}>
        {children}
      </main>

      {!isAuthPage && (
        <footer className="bg-gray-900 text-white py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="mb-4 md:mb-0">
                <span className="font-bold text-lg">Rentr</span>
                <span className="block text-gray-400 text-xs">&copy; 2025 All rights reserved.</span>
              </div>
              <div className="flex gap-6 text-gray-400 text-sm">
                <Link to="/about" className="hover:text-white">About</Link>
                <Link to="/support" className="hover:text-white">Support</Link>
                <Link to="/legal" className="hover:text-white">Legal</Link>
                <Link to="/contact" className="hover:text-white">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
