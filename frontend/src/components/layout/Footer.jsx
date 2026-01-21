import React from 'react';
import logo from "../../assets/logo.png";
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-white dark:bg-luxury-charcoal pt-20 pb-10 overflow-hidden transition-colors duration-300">
      {/* Decorative Gold Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-luxury-gold to-transparent opacity-30"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Ocean View Logo" className="w-10 h-10 object-contain" />
            <span className="text-luxury-charcoal dark:text-white font-serif font-bold tracking-[0.2em] text-lg uppercase">Ocean View</span>
          </div>
          <p className="text-luxury-charcoal/50 dark:text-white/50 font-sans text-sm leading-relaxed">
            Experience the pinnacle of coastal luxury at Ocean View Resort. Where world-class hospitality meets the tranquil beauty of the deep blue.
          </p>
          <div className="flex space-x-4">
            {[Facebook, Instagram, Twitter].map((Icon, idx) => (
              <motion.a
                key={idx}
                href="#"
                whileHover={{ scale: 1.1, color: '#D4AF37' }}
                className="text-luxury-charcoal/40 dark:text-white/40 border border-black/10 dark:border-white/10 p-2 rounded-full transition-all"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-luxury-charcoal dark:text-white font-serif font-bold text-lg mb-6 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-4">
            {[
              { name: 'Home', href: '/' },
              { name: 'About Us', href: '/about' },
              { name: 'Rooms', href: '/rooms' },
              { name: 'FAQ', href: '/faq' },
              { name: 'Contact', href: '/contact' }
            ].map((item) => (
              <li key={item.name}>
                <a href={item.href} className="text-luxury-charcoal/50 dark:text-white/50 hover:text-luxury-gold transition-colors text-sm font-sans tracking-wide">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-luxury-charcoal dark:text-white font-serif font-bold text-lg mb-6 uppercase tracking-wider">Get in Touch</h4>
          <ul className="space-y-5">
            <li className="flex items-start space-x-4">
              <MapPin size={20} className="text-luxury-gold shrink-0" />
              <span className="text-luxury-charcoal/50 dark:text-white/50 text-sm">123 Serenity Beach, <br />Coastal Paradise, SL 12345</span>
            </li>
            <li className="flex items-center space-x-4">
              <Phone size={20} className="text-luxury-gold shrink-0" />
              <span className="text-luxury-charcoal/50 dark:text-white/50 text-sm">+94 11 234 5678</span>
            </li>
            <li className="flex items-center space-x-4">
              <Mail size={20} className="text-luxury-gold shrink-0" />
              <span className="text-luxury-charcoal/50 dark:text-white/50 text-sm">booking@oceanview.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-luxury-charcoal dark:text-white font-serif font-bold text-lg mb-6 uppercase tracking-wider">Newsletter</h4>
          <p className="text-luxury-charcoal/50 dark:text-white/50 text-sm mb-6 font-sans">Subscribe for exclusive offers and seasonal retreats.</p>
          <div className="relative group">
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-luxury-charcoal dark:text-white text-sm outline-none focus:border-luxury-gold transition-all"
            />
            <button className="absolute right-0 top-0 bottom-0 px-4 bg-luxury-gold text-white uppercase text-xs font-bold tracking-widest hover:bg-yellow-600 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-20 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-[10px] text-luxury-charcoal/30 dark:text-white/30 uppercase tracking-[0.2em] font-sans">
        <p>© 2026 Ocean View Luxury Resort. All Rights Reserved.</p>
        <div className="flex space-x-8">
          <a href="/privacy-policy" className="hover:text-luxury-charcoal dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms-of-service" className="hover:text-luxury-charcoal dark:hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
