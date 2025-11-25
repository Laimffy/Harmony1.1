
import React, { useState } from 'react';
import type { AppView, User } from '../types';

interface HeaderProps {
    currentView: AppView;
    setCurrentView: (view: AppView) => void;
    user?: User | null;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems: { view: AppView; label: string }[] = [
    { view: 'home', label: 'Home' },
    { view: 'services', label: 'Services' },
    { view: 'about', label: 'About Us' },
    { view: 'contact', label: 'Contact Us' },
    { view: 'profile', label: 'Profile' },
  ];

  const NavLink: React.FC<{ view: AppView; label: string }> = ({ view, label }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMenuOpen(false);
      }}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        currentView === view
          ? 'bg-purple-700 text-white'
          : 'text-purple-900 hover:bg-purple-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 bg-purple-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-purple-800">Harmony</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map(item => <NavLink key={item.view} {...item} />)}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-purple-200 inline-flex items-center justify-center p-2 rounded-md text-purple-800 hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-100 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => <NavLink key={item.view} {...item} />)}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
