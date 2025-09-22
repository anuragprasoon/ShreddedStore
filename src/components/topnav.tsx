import React, { useState } from 'react';
import { ChevronDown, Menu, X, Search, ShoppingBag } from 'lucide-react';

// Import Urbanist font from Google Fonts
const UrbanistFont = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
);

const DesktopNavbar = () => {
  const [activeLink, setActiveLink] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Top wear', href: '/topwear' },
    { name: 'Bottom wear', href: '/bottomwear' }
  ];

  const secondaryLinks = [
    { name: 'New Arrivals', href: '/collections/new' },
    { name: 'Sale', href: '/collections/sale' },
    { name: 'Premium Collection', href: '/collections/premium' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <UrbanistFont />
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50" style={{ fontFamily: 'Urbanist, sans-serif' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl lg:text-3xl text-black tracking-wide cursor-pointer" style={{ fontWeight: 800, letterSpacing: '0.1em' }}>
                  SHREDDED
                </h1>
                <div className="h-0.5 bg-black w-8 lg:w-12 mt-1"></div>
              </div>
            </div>

            {/* Desktop Center Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-12">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setActiveLink(link.name)}
                    className={`relative px-4 py-2 text-sm font-medium tracking-wider uppercase transition-all duration-300 group ${
                      activeLink === link.name 
                        ? 'text-black' 
                        : 'text-gray-600 hover:text-black'
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {link.name}
                    {/* Active indicator */}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform transition-transform duration-300 ${
                      activeLink === link.name ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </a>
                ))}
              </div>
            </div>

            {/* Desktop Right Section - Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              <button className="text-gray-600 hover:text-black transition-colors duration-200">
                <Search className="h-5 w-5" />
              </button>
              <button className="bg-black text-white px-6 py-2 text-sm font-medium tracking-wider uppercase hover:bg-gray-800 transition-colors duration-200" style={{ fontWeight: 500 }}>
                Shop Now
              </button>
            </div>

            {/* Mobile Right Section */}
            <div className="flex lg:hidden items-center space-x-4">
              <button className="text-gray-600 hover:text-black transition-colors duration-200">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-black transition-colors duration-200">
                <ShoppingBag className="h-5 w-5" />
              </button>
              <button
                onClick={toggleMobileMenu}
                className="text-black hover:text-gray-600 inline-flex items-center justify-center p-2 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-4 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.name);
                  setIsMobileMenuOpen(false);
                }}
                className={`block px-3 py-3 text-base font-medium tracking-wider uppercase transition-colors duration-200 ${
                  activeLink === link.name 
                    ? 'text-black bg-gray-50' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
                style={{ fontWeight: 500 }}
              >
                {link.name}
              </a>
            ))}
            
            {/* Mobile Secondary Links */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {secondaryLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-50 tracking-wider uppercase transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Mobile CTA Button */}
            <div className="pt-4">
              <button 
                className="w-full bg-black text-white px-6 py-3 text-sm font-medium tracking-wider uppercase hover:bg-gray-800 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ fontWeight: 500 }}
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Secondary Navigation Bar - Hidden on mobile */}
        <div className="hidden lg:block bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-center h-12 space-x-8">
              {secondaryLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  className="text-xs font-medium text-gray-600 hover:text-black tracking-wider uppercase transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default DesktopNavbar;