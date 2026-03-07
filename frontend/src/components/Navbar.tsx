// src/components/Navbar.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle home click - reload page if already on home
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/home') {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled ? "bg-brand-anchor/95 backdrop-blur-md py-3 shadow-2xl" : "bg-brand-anchor py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo - Links to home with reload */}
          <Link to="/home" onClick={handleHomeClick}>
            <Logo withText={true} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/home" 
              onClick={handleHomeClick}
              className={`text-white text-sm font-bold transition-colors ${
                isActive('/home') ? 'text-brand-orange' : 'hover:text-brand-orange'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/tours" 
              className={`text-white text-sm font-bold transition-colors ${
                isActive('/tours') ? 'text-brand-orange' : 'hover:text-brand-orange'
              }`}
            >
              Tours
            </Link>
            <Link 
              to="/blog" 
              className={`text-white text-sm font-bold transition-colors ${
                isActive('/blog') ? 'text-brand-orange' : 'hover:text-brand-orange'
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/about" 
              className={`text-white text-sm font-bold transition-colors ${
                isActive('/about') ? 'text-brand-orange' : 'hover:text-brand-orange'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-white text-sm font-bold transition-colors ${
                isActive('/contact') ? 'text-brand-orange' : 'hover:text-brand-orange'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pt-6 pb-4 space-y-4 animate-fadeIn">
            <Link 
              to="/home" 
              onClick={(e) => {
                setIsOpen(false);
                handleHomeClick(e);
              }}
              className={`block text-white text-sm font-bold transition-colors ${
                isActive('/home') ? 'text-brand-orange' : 'hover:text-brand-orange'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/tours" 
              className={`block text-white text-sm font-bold transition-colors ${
                isActive('/tours') ? 'text-brand-orange' : 'hover:text-brand-orange'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Tours
            </Link>
            <Link 
              to="/blog" 
              className={`block text-white text-sm font-bold transition-colors ${
                isActive('/blog') ? 'text-brand-orange' : 'hover:text-brand-orange'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link 
              to="/about" 
              className={`block text-white text-sm font-bold transition-colors ${
                isActive('/about') ? 'text-brand-orange' : 'hover:text-brand-orange'
              }`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`block text-white text-sm font-bold transition-colors ${
                isActive('/contact') ? 'text-brand-orange' : 'hover:text-brand-orange'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;