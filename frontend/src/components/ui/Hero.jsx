import React, { useRef, useEffect } from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/hero_bg.jpg';


const Hero = () => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video/Image Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Use a placeholder abstract pattern instead of a real image for now, or imagine a stunning ocean view */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 bg-cover bg-center"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      >
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        ></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-20 text-center px-6">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-luxury-gold tracking-[0.6em] font-sans text-sm uppercase mb-6 block drop-shadow-lg"
        >
          Welcome to Infinite Luxury
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-serif text-white mb-8 leading-tight drop-shadow-2xl"
        >
          Where the Sky <br /> 
          <span className="italic">Meets</span> the Ocean
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8"
        >
          <Link 
            to="/rooms" 
            className="px-10 py-5 bg-luxury-gold text-white font-bold uppercase tracking-widest text-xs hover:bg-yellow-600 transition-all rounded-sm shadow-2xl text-center"
          >
            Book Your Stay
          </Link>
          <Link 
            to="/contact" 
            className="px-10 py-5 border border-white/30 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all rounded-sm backdrop-blur-sm text-center"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-luxury-gold to-transparent"></div>
        <span className="text-[10px] text-white/50 uppercase tracking-[0.4em] mt-4 vertical-text">Scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;
