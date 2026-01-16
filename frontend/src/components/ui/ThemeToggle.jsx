import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../utils/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2 rounded-full bg-white/5 border border-white/10 dark:border-white/10 hover:bg-white/10 transition-all focus:outline-none"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="text-luxury-gold" size={20} />
      ) : (
        <Moon className="text-luxury-gold" size={20} />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
