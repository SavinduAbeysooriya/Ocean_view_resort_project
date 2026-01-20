import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { Moon, Sun } from 'lucide-react';

const AdminHeader = ({ 
  subtitle = "Central Intelligence", 
  title = "Administration", 
  description = "Manage your resort operations",
  actions = null 
}) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  // Sync dark mode with localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 lg:mb-16 border-b border-black/5 dark:border-white/5 pb-6 lg:pb-10 gap-6 lg:gap-8">
      <div>
        <div className="flex items-center space-x-3 text-[10px] uppercase font-bold tracking-[0.3em] text-luxury-gold mb-4">
          <span className="w-8 h-[1px] bg-luxury-gold/30"></span>
          <span>{subtitle}</span>
        </div>
        <h1 className="text-5xl font-serif text-luxury-charcoal dark:text-white tracking-tight leading-none mb-4">
          {title}
        </h1>
        <p className="text-luxury-charcoal/40 dark:text-white/40 text-sm font-medium italic">
          {description}
        </p>
      </div>
      
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Optional Actions Slot */}
        {actions && <div className="flex items-center space-x-4">{actions}</div>}
        
        {/* Dark Mode Toggle and User Info */}
        <div className="flex items-center space-x-6 bg-white/50 dark:bg-luxury-charcoal/30 p-2 rounded-full border border-black/5 dark:border-white/5 backdrop-blur-xl">
          <button 
            onClick={toggleDarkMode}
            className="p-3 bg-white dark:bg-luxury-charcoal rounded-full shadow-lg text-luxury-gold hover:scale-110 transition-all duration-300"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="h-8 w-[1px] bg-black/10 dark:bg-white/10 mx-2"></div>
          <div className="flex items-center space-x-4 pr-6">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal dark:text-white leading-none mb-1">
                {user?.username}
              </p>
              <p className="text-[8px] uppercase tracking-widest text-luxury-gold font-bold">
                Administrator
              </p>
            </div>
            <div className="relative">
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.username}&background=D4AF37&color=fff`} 
                className="w-12 h-12 rounded-full border-2 border-luxury-gold p-0.5 shadow-xl" 
                alt="Admin Avatar" 
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-luxury-dark"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
