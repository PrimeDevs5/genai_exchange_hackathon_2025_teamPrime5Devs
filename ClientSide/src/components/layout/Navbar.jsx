import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, SearchIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const {
    currentUser,
    logout
  } = useAuth();
  const isActive = path => {
    return location.pathname === path;
  };
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by protected routes
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  return <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="ml-2 text-xl font-bold text-neutral-900">
                DocQueries
              </span>
            </Link>
          </div>
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={`text-base font-medium ${isActive('/') ? 'text-primary-500' : 'text-neutral-700 hover:text-primary-500'}`}>
              Home
            </Link>
            <Link to="/dashboard" className={`text-base font-medium ${isActive('/dashboard') ? 'text-primary-500' : 'text-neutral-700 hover:text-primary-500'}`}>
              Dashboard
            </Link>
            <a href="#features" className="text-base font-medium text-neutral-700 hover:text-primary-500">
              Features
            </a>
            <a href="#pricing" className="text-base font-medium text-neutral-700 hover:text-primary-500">
              Pricing
            </a>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-neutral-100">
              <SearchIcon className="w-5 h-5 text-neutral-700" />
            </button>
            {currentUser ? <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    {currentUser.photoURL ? <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full" /> : <UserIcon className="w-5 h-5 text-primary-600" />}
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </button>
                {isProfileOpen && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100" onClick={() => setIsProfileOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100" onClick={() => setIsProfileOpen(false)}>
                      Profile Settings
                    </Link>
                    <button onClick={() => {
                handleLogout();
                setIsProfileOpen(false);
              }} className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                      Sign out
                    </button>
                  </div>}
              </div> : <Link to="/auth/login" className="btn btn-primary btn-sm">
                Get Started
              </Link>}
          </div>
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-primary-500 hover:bg-neutral-100">
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && <div className="md:hidden bg-white border-t border-neutral-200 py-2">
          <div className="container mx-auto px-4 space-y-1">
            <Link to="/" className={`block py-2 px-3 rounded-md ${isActive('/') ? 'bg-primary-50 text-primary-500' : 'text-neutral-700 hover:bg-neutral-100'}`} onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/dashboard" className={`block py-2 px-3 rounded-md ${isActive('/dashboard') ? 'bg-primary-50 text-primary-500' : 'text-neutral-700 hover:bg-neutral-100'}`} onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            <a href="/features" className="block py-2 px-3 rounded-md text-neutral-700 hover:bg-neutral-100" onClick={() => setIsMenuOpen(false)}>
              Features
            </a>
            <a href="#pricing" className="block py-2 px-3 rounded-md text-neutral-700 hover:bg-neutral-100" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </a>
            {currentUser ? <>
                <div className="border-t border-neutral-200 my-2"></div>
                <div className="py-2 px-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      {currentUser.photoURL ? <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full" /> : <UserIcon className="w-5 h-5 text-primary-600" />}
                    </div>
                    <span className="ml-3 text-sm font-medium text-neutral-700">
                      {currentUser.displayName || currentUser.email}
                    </span>
                  </div>
                </div>
                <Link to="/profile" className="block py-2 px-3 rounded-md text-neutral-700 hover:bg-neutral-100" onClick={() => setIsMenuOpen(false)}>
                  Profile Settings
                </Link>
                <button onClick={() => {
            handleLogout();
            setIsMenuOpen(false);
          }} className="flex w-full items-center py-2 px-3 rounded-md text-neutral-700 hover:bg-neutral-100">
                  <LogOutIcon className="w-5 h-5 mr-2" />
                  Sign out
                </button>
              </> : <div className="pt-4 pb-2">
                <Link to="/auth/login" className="block w-full btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              </div>}
          </div>
        </div>}
    </header>;
};