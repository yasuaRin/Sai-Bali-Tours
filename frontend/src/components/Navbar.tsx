// src/components/Navbar.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { getCategories } from "../services/tourService";

interface Category {
  id: number;
  name: string;
  slug: string;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isToursOpen, setIsToursOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Fetch categories from DB — zero hardcoding
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(err => console.error('Failed to load categories:', err));
  }, []);

  const isActive = (path: string) => location.pathname === path;

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

          {/* Logo */}
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

            {/* Tours Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsToursOpen(true)}
              onMouseLeave={() => setIsToursOpen(false)}
            >
              <Link
                to="/tour/category/all"
                className={`text-white text-sm font-bold transition-colors inline-flex items-center gap-1 ${
                  location.pathname.startsWith('/tour') ? 'text-brand-orange' : 'hover:text-brand-orange'
                }`}
              >
                Tours
                <ChevronDown size={14} className={`transition-transform duration-200 ${isToursOpen ? 'rotate-180' : ''}`} />
              </Link>

              <div className={`absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-200 z-50 ${
                isToursOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`}>
                <div className="py-2">
                  {categories.map((cat, i) => (
                    <React.Fragment key={cat.slug}>
                      <Link
                        to={`/tour/category/${cat.slug}`}
                        className={`block px-5 py-2.5 text-sm font-bold transition-colors hover:bg-orange-50 hover:text-brand-orange ${
                          location.pathname === `/tour/category/${cat.slug}`
                            ? 'text-brand-orange bg-orange-50'
                            : i === 0 ? 'text-brand-orange' : 'text-gray-700'
                        }`}
                      >
                        {cat.name}
                      </Link>
                      {i === 0 && <div className="h-px bg-gray-100 my-1 mx-4" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

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

          {/* Mobile Button */}
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
              onClick={(e) => { setIsOpen(false); handleHomeClick(e); }}
              className={`block text-white text-sm font-bold transition-colors ${
                isActive('/home') ? 'text-brand-orange' : 'hover:text-brand-orange'
              }`}
            >
              Home
            </Link>

            <div className="space-y-2">
              <Link
                to="/tour/category/all"
                className={`block text-white text-sm font-bold transition-colors ${
                  location.pathname.startsWith('/tour') ? 'text-brand-orange' : 'hover:text-brand-orange'
                }`}
                onClick={() => setIsOpen(false)}
              >
                All Tours
              </Link>
              <div className="pl-4 space-y-2 border-l-2 border-brand-orange/30">
                {categories.map(cat => (
                  <Link
                    key={cat.slug}
                    to={`/tour/category/${cat.slug}`}
                    className={`block text-xs font-medium transition-colors ${
                      location.pathname === `/tour/category/${cat.slug}`
                        ? 'text-brand-orange'
                        : 'text-white/80 hover:text-brand-orange'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

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