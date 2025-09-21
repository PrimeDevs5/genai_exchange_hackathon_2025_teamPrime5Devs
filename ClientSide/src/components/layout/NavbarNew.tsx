import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ScaleIcon, 
  MenuIcon, 
  XIcon, 
  UserIcon, 
  LogOutIcon,
  LayoutDashboardIcon
} from 'lucide-react';

interface NavbarProps {
  isAuthenticated?: boolean;
}

export const NavbarNew: React.FC<NavbarProps> = ({ isAuthenticated = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.hash === href;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-legal-200/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                  isScrolled ? 'shadow-primary-500/25' : 'shadow-white/25'
                }`}>
                  <ScaleIcon className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <span className={`text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent ${
                  isScrolled ? '' : 'text-white'
                }`}>
                  LegalClarity
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ y: -2 }}
                className={`text-sm font-semibold transition-colors duration-300 relative group ${
                  isScrolled 
                    ? 'text-legal-700 hover:text-primary-600' 
                    : 'text-white/90 hover:text-white'
                } ${
                  isActive(item.href) ? 'text-primary-600' : ''
                }`}
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  layoutId="navbar-indicator"
                />
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/dashboard"
                    className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      isScrolled
                        ? 'text-legal-700 bg-legal-100 hover:bg-legal-200'
                        : 'text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                    }`}
                  >
                    <LayoutDashboardIcon className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/profile"
                    className={`inline-flex items-center p-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      isScrolled
                        ? 'text-legal-700 hover:bg-legal-100'
                        : 'text-white hover:bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    className={`inline-flex items-center p-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      isScrolled
                        ? 'text-legal-700 hover:bg-legal-100'
                        : 'text-white hover:bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    <LogOutIcon className="w-5 h-5" />
                  </button>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/auth"
                    className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      isScrolled
                        ? 'text-legal-700 hover:text-primary-600 hover:bg-primary-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                    }`}
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/auth"
                    className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled 
                ? 'text-legal-700 hover:bg-legal-100' 
                : 'text-white hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            {isMobileMenuOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-lg border-t border-legal-200/50"
      >
        <div className="container mx-auto px-4 py-6 space-y-4">
          {navItems.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              whileHover={{ x: 5 }}
              className={`block py-3 px-4 text-legal-700 font-semibold rounded-lg transition-colors duration-300 ${
                isActive(item.href) 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'hover:bg-legal-100'
              }`}
            >
              {item.name}
            </motion.a>
          ))}
          
          <div className="pt-4 border-t border-legal-200">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center py-3 px-4 text-legal-700 font-semibold rounded-lg hover:bg-legal-100 transition-colors duration-300"
                >
                  <LayoutDashboardIcon className="w-5 h-5 mr-3" />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center py-3 px-4 text-legal-700 font-semibold rounded-lg hover:bg-legal-100 transition-colors duration-300"
                >
                  <UserIcon className="w-5 h-5 mr-3" />
                  Profile
                </Link>
                <button
                  className="flex items-center w-full py-3 px-4 text-legal-700 font-semibold rounded-lg hover:bg-legal-100 transition-colors duration-300"
                >
                  <LogOutIcon className="w-5 h-5 mr-3" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-center text-legal-700 font-semibold rounded-lg hover:bg-legal-100 transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-center bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};
