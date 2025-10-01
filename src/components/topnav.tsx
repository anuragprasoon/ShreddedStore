'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X, Search, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const DesktopNavbar = () => {
  const [activeLink, setActiveLink] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart = [] } = useCart();
  const { wishlist = [] } = useWishlist();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Top wear', href: '/topwear' },
    { name: 'Bottom wear', href: '/bottomwear' }
  ];

  const secondaryLinks = [
    { name: 'New Arrivals', href: '/collections/new' },
    { name: 'Sale', href: '/collections/sale' },
    { name: 'Premium Collection', href: '/collections/premium' },
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (<>
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 font-urbanist">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/">
                  <h1 className="text-2xl lg:text-3xl text-black tracking-wide cursor-pointer font-extrabold tracking-widest">
                    SHREDDED
                  </h1>
                  <div className="h-0.5 bg-black w-8 lg:w-12 mt-1"></div>
                </Link>
              </div>
            </div>

            {/* Desktop Center Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-12">
                {navLinks.map((link) => (
                  <Link
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
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Right Section - Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              <button 
                className="text-gray-600 hover:text-black transition-colors duration-200"
                aria-label="Search"
                title="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/auth" 
                className="flex items-center gap-2 text-black border border-black px-6 py-2 text-sm font-medium tracking-wider uppercase hover:bg-black hover:text-white transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/wishlist" 
                className="text-gray-600 hover:text-black transition-colors duration-200 relative"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 bg-black text-white text-xs rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link
                href="/cart" 
                className="flex items-center gap-2 bg-black text-white px-6 py-2 text-sm font-medium tracking-wider uppercase hover:bg-gray-800 transition-colors duration-200"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Cart {cart.length > 0 && `(${cart.length})`}</span>
              </Link>
            </div>

            {/* Mobile Right Section */}
            <div className="flex lg:hidden items-center space-x-4">
              <button 
                className="text-gray-600 hover:text-black transition-colors duration-200"
                aria-label="Search"
                title="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/auth" 
                className="text-gray-600 hover:text-black transition-colors duration-200"
              >
                <span className="text-sm font-medium">Login</span>
              </Link>
              <Link
                href="/cart" 
                className="relative text-gray-600 hover:text-black transition-colors duration-200"
              >
                <ShoppingBag className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="text-black hover:text-gray-600 inline-flex items-center justify-center p-2 transition-colors duration-200"
                aria-label="Toggle menu"
                title="Toggle menu"
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