import React from 'react';
import { motion } from 'framer-motion';
import { History, Award, Heart, ShieldCheck, Waves, Palmtree } from 'lucide-react';
import aboutHeader from '../assets/about_header.jpg';
import aboutBanner from '../assets/about_banner.jpg';

const About = () => {
  const stats = [
    { label: 'Years of Excellence', value: '30+', icon: History },
    { label: 'Awards Won', value: '15', icon: Award },
    { label: 'Happy Families', value: '25k+', icon: Heart },
    { label: 'Service Guarantee', value: '100%', icon: ShieldCheck },
  ];

  const values = [
    {
      title: "Sustainability",
      description: "We are committed to preserving the natural beauty of Galle through eco-friendly practices and community support.",
      icon: Palmtree
    },
    {
      title: "Luxury Excellence",
      description: "Every detail is curated to provide an unmatched experience of comfort and sophistication.",
      icon: Waves
    }
  ];

  return ( <div>
    {/* Page Header Component */}
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden mb-20">
          <div className="absolute inset-0 bg-black/50 z-10 transition-colors duration-300 dark:bg-black/60"></div>
           <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${aboutHeader})` }}
                        ></div>
          <div className="relative z-20 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-luxury-gold tracking-[0.4em] uppercase text-xs font-bold mb-4 block">
                our journey
              </span>
              <h1 className="text-5xl md:text-7xl font-serif text-white drop-shadow-2xl">
                About us
              </h1>
            </motion.div>
          </div>
        </section>

  <div className="bg-luxury-cream dark:bg-luxury-dark min-h-screen pt-24 pb-20 transition-colors duraton-300">
      {/* Our Mission */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-luxury-gold tracking-[0.3em] uppercase text-[10px] font-bold mb-4 block">Our Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-serif text-luxury-charcoal dark:text-white mb-8 leading-tight">
              Where the Waves Meet <br /> Timeless Elegance
            </h2>
            <p className="text-luxury-charcoal/70 dark:text-white/70 font-sans leading-loose mb-6">
              Founded in 1995, Ocean View Resort began as a small family-owned villa with a simple goal: to share the breathtaking beauty of Galle's coastline with the world. Over the decades, we have evolved into a premier luxury destination while maintaining the warmth and personal touch that defines our heritage.
            </p>
            <p className="text-luxury-charcoal/70 dark:text-white/70 font-sans leading-loose">
              Our commitment goes beyond providing a place to stay. We aim to create a sanctuary where guests can reconnect with themselves and nature. From our colonial-inspired architecture to our world-class dining, every element of Ocean View is designed to tell a story of harmony and sophistication.
            </p>
          </motion.div>

          {/* This would be where you use the generated image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
                <img 
                    src={aboutBanner} 
                    alt="Legacy" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
            </div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 border-8 border-luxury-gold/20 -z-10 hidden md:block"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-luxury-charcoal dark:bg-black text-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <stat.icon className="mx-auto text-luxury-gold mb-4" size={32} />
              <h3 className="text-4xl font-serif mb-2">{stat.value}</h3>
              <p className="text-white/50 text-xs uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-white/50 dark:bg-luxury-charcoal/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-luxury-gold tracking-[0.3em] uppercase text-[10px] font-bold mb-4 block">Our Values</span>
            <h2 className="text-4xl font-serif text-luxury-charcoal dark:text-white">What Defines Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-10 border border-black/5 dark:border-white/5 rounded-sm hover:border-luxury-gold transition-colors group bg-white dark:bg-luxury-dark"
              >
                <div className="w-14 h-14 bg-luxury-gold/10 flex items-center justify-center rounded-full mb-6 group-hover:bg-luxury-gold group-hover:text-white transition-all">
                  <v.icon size={24} className="text-luxury-gold group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-serif mb-4 text-luxury-charcoal dark:text-white">{v.title}</h3>
                <p className="text-luxury-charcoal/60 dark:text-white/60 leading-relaxed italic">
                  "{v.description}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>    </div>
  );
};

export default About;
