import React from 'react';
import Hero from '../components/ui/Hero';
import { motion } from 'framer-motion';
import { Hotel, Utensils, Umbrella, Users } from 'lucide-react';

const Home = () => {
    return (
        <>
            <Hero />
            
            {/* Our Story Section */}
            <section className="py-24 bg-luxury-cream dark:bg-luxury-dark px-6 transition-colors duration-300">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-luxury-gold tracking-[0.3em] uppercase text-xs font-bold mb-4 block">Our Story</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-luxury-charcoal dark:text-white mb-8 leading-tight">Crafting Memories <br /> Since 1992</h2>
                        <p className="text-luxury-charcoal/60 dark:text-white/60 font-sans leading-loose mb-8 italic">
                            "A journey of a thousand miles begins with a single step into serenity. At Ocean View, we believe luxury isn't just about what you see, but how you feel."
                        </p>
                        <p className="text-luxury-charcoal/40 dark:text-white/40 font-sans leading-relaxed mb-10">
                            Nestled on the edge of the world, our resort offers an unparalleled escape from the mundane. Every suite is a sanctuary, every meal a masterpiece, and every sunset a divine experience.
                        </p>
                        <button className="text-luxury-gold uppercase tracking-[0.2em] font-bold text-xs border-b border-luxury-gold pb-2 hover:text-luxury-charcoal dark:hover:text-white hover:border-luxury-charcoal dark:hover:border-white transition-all">
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
            <section className="py-24 border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-luxury-charcoal/20 backdrop-blur-sm transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
                        {[
                            { label: 'Exquisite Suites', value: '150+', icon: Hotel },
                            { label: 'World-class Dining', value: '12', icon: Utensils },
                            { label: 'Private Beaches', value: '03', icon: Umbrella },
                            { label: 'Happy Guests', value: '50k+', icon: Users },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.8 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="mb-6 p-4 rounded-full bg-luxury-gold/5 dark:bg-luxury-gold/10 group-hover:bg-luxury-gold group-hover:text-white transition-all duration-500">
                                    <stat.icon size={28} className="text-luxury-gold group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="text-4xl md:text-5xl font-serif text-luxury-charcoal dark:text-white mb-3 tracking-tight">
                                    {stat.value}
                                </h3>
                                <p className="text-luxury-charcoal/40 dark:text-white/40 uppercase tracking-[0.25em] text-[10px] md:text-xs font-bold font-sans">
                                    {stat.label}
                                </p>
                                <div className="mt-6 w-8 h-[1px] bg-luxury-gold/30 group-hover:w-16 transition-all duration-500"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
