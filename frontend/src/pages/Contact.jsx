import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import { cn } from '../utils/cn';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post('http://localhost:8080/api/contact', formData);
            setStatus({ type: 'success', message: 'Your message has been sent successfully!' });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error.response?.data || 'Failed to send message. Please try again later.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-300">
            {/* Page Header Component */}
            <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10 transition-colors duration-300 dark:bg-black/60"></div>
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=2000')" }}
                ></div>
                <div className="relative z-20 text-center px-6">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-luxury-gold tracking-[0.4em] uppercase text-xs font-bold mb-4 block"
                    >
                        Connected Hospitality
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif text-white drop-shadow-2xl"
                    >
                        Contact Us
                    </motion.h1>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    {/* Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-12"
                    >
                        <div>
                            <h2 className="text-3xl font-serif text-luxury-charcoal dark:text-white mb-6">Reach Our Sanctuary</h2>
                            <p className="text-luxury-charcoal/60 dark:text-white/60 mb-8 max-w-md leading-relaxed">
                                Our dedicated concierge team is available 24/7 to assist with your enquiries, special requests, and reservations.
                            </p>
                        </div>

                        <div className="space-y-10">
                            {[
                                { icon: MapPin, title: 'Our Address', content: '123 Serenity Beach, Coastal Paradise, SL 12345' },
                                { icon: Phone, title: 'Reservations', content: '+94 11 234 5678' },
                                { icon: Mail, title: 'Email Enquiries', content: 'contact@oceanviewresort.com' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start space-x-6 group">
                                    <div className="p-4 rounded-full bg-luxury-gold/5 dark:bg-luxury-gold/10 group-hover:bg-luxury-gold transition-all duration-500">
                                        <item.icon size={24} className="text-luxury-gold group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-luxury-charcoal dark:text-white font-serif font-bold tracking-wide mb-1">{item.title}</h4>
                                        <p className="text-luxury-charcoal/60 dark:text-white/60 font-sans">{item.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-white dark:bg-luxury-charcoal/40 p-10 lg:p-12 rounded-sm shadow-2xl backdrop-blur-sm border border-black/5 dark:border-white/5"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 font-bold">Your Name</label>
                                    <input 
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold transition-all"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 font-bold">Email Address</label>
                                    <input 
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold transition-all"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 font-bold">Subject</label>
                                <input 
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold transition-all"
                                    placeholder="e.g. Booking Enquiry"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 font-bold">Your Message</label>
                                <textarea 
                                    name="message"
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold transition-all resize-none overflow-hidden"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>

                            {status.message && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className={cn(
                                        "p-4 rounded-sm text-sm font-sans flex items-center space-x-2",
                                        status.type === 'success' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                    )}
                                >
                                    <span>{status.message}</span>
                                </motion.div>
                            )}

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-luxury-gold text-white font-bold uppercase tracking-[0.25em] text-xs rounded-sm hover:bg-yellow-600 transition-all flex items-center justify-center space-x-3 shadow-xl"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        <Send size={16} />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Map Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative w-full h-[500px] rounded-sm overflow-hidden shadow-2xl border border-black/5 dark:border-white/5"
                >
                    <iframe 
                        title="Resort Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58289456743!2d79.8001243!3d6.9218386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0, filter: 'grayscale(0.5) contrast(1.2) invert(0.05)' }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        className="dark:opacity-80 transition-opacity duration-500"
                    ></iframe>
                    
                    {/* Floating Map Label */}
                    <div className="absolute top-8 left-8 bg-white/90 dark:bg-luxury-dark/90 backdrop-blur-md p-6 border border-black/5 dark:border-white/5 shadow-2xl z-20 max-w-[200px]">
                        <h4 className="text-luxury-gold font-serif font-bold text-lg mb-2">Visit Us</h4>
                        <p className="text-luxury-charcoal/60 dark:text-white/60 text-xs font-sans leading-relaxed">
                            123 Serenity Beach, <br />
                            Coastal Paradise, <br />
                            Colombo, Sri Lanka
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
