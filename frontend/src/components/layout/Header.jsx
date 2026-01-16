import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogIn } from 'lucide-react';
import { cn } from '../../utils/cn';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Rooms', href: '#' },
  { name: 'Gallery', href: '#' },
  { name: 'FAQ', href: '#' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-luxury-dark/90 backdrop-blur-md shadow-2xl py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 border-2 border-luxury-gold flex items-center justify-center transform rotate-45">
            <span className="transform -rotate-45 text-luxury-gold font-serif font-bold text-xl">O</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-serif font-bold tracking-widest text-lg leading-tight uppercase">Ocean View</span>
            <span className="text-luxury-gold text-[10px] tracking-[0.3em] font-sans uppercase">Luxury Resort</span>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link, idx) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-white/80 hover:text-luxury-gold font-sans text-sm tracking-widest uppercase transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-300 group-hover:w-full"></span>
            </motion.a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 text-white/90 hover:text-white transition-colors text-sm font-sans tracking-widest uppercase"
          >
            <LogIn size={18} className="text-luxury-gold" />
            <span>Login</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 bg-luxury-gold hover:bg-yellow-600 text-luxury-dark font-sans font-bold text-xs tracking-[0.2em] uppercase rounded-sm transition-all shadow-lg overflow-hidden relative group"
          >
            <span className="relative z-10 text-white">Sign Up</span>
            <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 opacity-20"></div>
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center space-x-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-luxury-gold transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-luxury-dark/95 backdrop-blur-xl border-t border-white/10 mt-4 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/80 hover:text-luxury-gold font-sans text-lg tracking-widest uppercase transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col pt-6 space-y-4 border-t border-white/5">
                <button className="flex items-center space-x-4 text-white/80 hover:text-white transition-colors">
                  <LogIn size={20} className="text-luxury-gold" />
                  <span className="uppercase tracking-widest text-sm font-sans">Login</span>
                </button>
                <button className="w-full py-4 bg-luxury-gold text-white font-bold uppercase tracking-widest text-sm rounded-sm">
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
