import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User as UserIcon, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../utils/AuthContext";

import ThemeToggle from "../ui/ThemeToggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Rooms", href: "/rooms" },
  { name: "Gallery", href: "/gallery" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user || !user.roles) return null;
    if (user.roles.includes('ROLE_ADMIN')) return { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard };
    if (user.roles.includes('ROLE_STAFF')) return { name: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard };
    if (user.roles.includes('ROLE_CUSTOMER')) return { name: 'Profile', href: '/profile', icon: UserIcon };
    return null;
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-luxury-cream/90 dark:bg-luxury-dark/90 backdrop-blur-md shadow-2xl py-3 border-b border-black/5 dark:border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <img src={logo} alt="Ocean View Logo" className="w-12 h-12 object-contain" />
            <div className="flex flex-col">
              <span className="text-luxury-charcoal dark:text-white font-serif font-bold tracking-widest text-lg leading-tight uppercase">
                Ocean View
              </span>
              <span className="text-luxury-gold text-[10px] tracking-[0.3em] font-sans uppercase">
                Luxury Resort
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link, idx) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={link.href}
                className="text-luxury-charcoal/80 dark:text-white/80 hover:text-luxury-gold dark:hover:text-luxury-gold font-sans text-sm tracking-widest uppercase transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Auth Buttons + Theme Toggle */}
        <div className="hidden lg:flex items-center space-x-4">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center space-x-4">
              {(() => {
                const dashLink = getDashboardLink();
                if (!dashLink) return null;
                return (
                  <Link to={dashLink.href}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 py-2 text-luxury-gold hover:text-yellow-600 transition-colors text-sm font-sans tracking-widest uppercase"
                    >
                      {dashLink.icon && React.createElement(dashLink.icon, { size: 18 })}
                      <span>{dashLink.name}</span>
                    </motion.button>
                  </Link>
                );
              })()}
              
              <div className="flex items-center space-x-3 pl-4 border-l border-black/10 dark:border-white/10">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.username}&background=D4AF37&color=fff`} 
                  className="w-8 h-8 rounded-full border border-luxury-gold" 
                  alt="Avatar" 
                />
                <button 
                  onClick={logout}
                  className="text-luxury-charcoal/60 dark:text-white/60 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 text-luxury-charcoal/90 dark:text-white/90 hover:text-luxury-charcoal dark:hover:text-white transition-colors text-sm font-sans tracking-widest uppercase"
                >
                  <LogIn size={18} className="text-luxury-gold" />
                  <span>Login</span>
                </motion.button>
              </Link>

              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-luxury-gold hover:bg-yellow-600 text-white font-sans font-bold text-xs tracking-[0.2em] uppercase rounded-sm transition-all shadow-lg overflow-hidden relative group"
                >
                  <span className="relative z-10 text-white">Sign Up</span>
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 opacity-20"></div>
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-luxury-charcoal dark:text-white hover:text-luxury-gold transition-colors"
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
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-luxury-cream/95 dark:bg-luxury-dark/95 backdrop-blur-xl border-t border-black/5 dark:border-white/10 mt-4 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-luxury-charcoal/80 dark:text-white/80 hover:text-luxury-gold font-sans text-lg tracking-widest uppercase transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="flex flex-col pt-6 space-y-4 border-t border-black/5 dark:border-white/5">
                {user ? (
                  <>
                    <div className="flex items-center space-x-4 p-2">
                       <img 
                        src={`https://ui-avatars.com/api/?name=${user.username}&background=D4AF37&color=fff`} 
                        className="w-10 h-10 rounded-full border border-luxury-gold" 
                        alt="Avatar" 
                      />
                      <span className="text-luxury-charcoal dark:text-white font-bold">{user.username}</span>
                    </div>
                    {(() => {
                      const dashLink = getDashboardLink();
                      if (!dashLink) return null;
                      return (
                        <Link 
                          to={dashLink.href}
                          className="w-full py-4 bg-luxury-gold/10 text-luxury-gold text-center font-bold uppercase tracking-widest text-sm rounded-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {dashLink.name}
                        </Link>
                      );
                    })()}
                    <button 
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="w-full py-4 bg-red-500/10 text-red-500 font-bold uppercase tracking-widest text-sm rounded-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      className="flex items-center space-x-4 text-luxury-charcoal/80 dark:text-white/80 hover:text-luxury-charcoal dark:hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn size={20} className="text-luxury-gold" />
                      <span className="uppercase tracking-widest text-sm font-sans">Login</span>
                    </Link>
                    <Link 
                      to="/register"
                      className="w-full py-4 bg-luxury-gold text-white text-center font-bold uppercase tracking-widest text-sm rounded-sm shadow-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
