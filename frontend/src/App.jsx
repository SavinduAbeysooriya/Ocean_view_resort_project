import React from 'react';
import Layout from './components/layout/Layout';
import Hero from './components/ui/Hero';
import { motion } from 'framer-motion';

function App() {
  return (
    <Layout>
      <Hero />
      
      {/* Sample Content Section to show scrolling impact */}
      <section className="py-24 bg-luxury-dark px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-luxury-gold tracking-[0.3em] uppercase text-xs font-bold mb-4 block">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">Crafting Memories <br /> Since 1992</h2>
            <p className="text-white/60 font-sans leading-loose mb-8 italic">
              "A journey of a thousand miles begins with a single step into serenity. At Ocean View, we believe luxury isn't just about what you see, but how you feel."
            </p>
            <p className="text-white/40 font-sans leading-relaxed mb-10">
              Nestled on the edge of the world, our resort offers an unparalleled escape from the mundane. Every suite is a sanctuary, every meal a masterpiece, and every sunset a divine experience.
            </p>
            <button className="text-luxury-gold uppercase tracking-[0.2em] font-bold text-xs border-b border-luxury-gold pb-2 hover:text-white hover:border-white transition-all">
              Discover More
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4 pt-12">
              <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800" alt="Resort 1" className="w-full h-64 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" />
              <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" alt="Resort 2" className="w-full h-80 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" />
            </div>
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800" alt="Resort 3" className="w-full h-80 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" />
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" alt="Resort 4" className="w-full h-64 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-white/5 mx-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-12 text-center">
          {[
            { label: 'Exquisite Suites', value: '150+' },
            { label: 'World-class Dining', value: '12' },
            { label: 'Private Beaches', value: '03' },
            { label: 'Happy Guests', value: '50k+' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex-1 min-w-[200px]"
            >
              <h3 className="text-4xl font-serif text-luxury-gold mb-2">{stat.value}</h3>
              <p className="text-white/40 uppercase tracking-widest text-[10px]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export default App;
