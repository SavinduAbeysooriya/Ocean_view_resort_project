import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark pt-32 pb-20 selection:bg-luxury-gold selection:text-white">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center space-x-3 text-[10px] uppercase font-bold tracking-[0.3em] text-luxury-gold mb-4">
                        <span className="w-8 h-[1px] bg-luxury-gold/30"></span>
                        <span>Legal Information</span>
                        <span className="w-8 h-[1px] bg-luxury-gold/30"></span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif text-luxury-charcoal dark:text-white mb-6">Privacy Policy</h1>
                    <p className="text-luxury-charcoal/40 dark:text-white/40 italic font-sans">Last updated: January 21, 2026</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="prose prose-luxury dark:prose-invert max-w-none space-y-12"
                >
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white border-b border-luxury-gold/20 pb-2">1. Introduction</h2>
                        <p className="text-luxury-charcoal/70 dark:text-white/70 leading-relaxed font-sans">
                            At Ocean View Resort, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our resort or use our website.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white border-b border-luxury-gold/20 pb-2">2. Information Collection</h2>
                        <p className="text-luxury-charcoal/70 dark:text-white/70 leading-relaxed font-sans">
                            We collect personal information that you provide to us, including but not limited to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-luxury-charcoal/70 dark:text-white/70 font-sans">
                            <li>Name, email address, and contact details.</li>
                            <li>Payment and billing information.</li>
                            <li>Booking history and preferences.</li>
                            <li>Correspondence with our staff.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white border-b border-luxury-gold/20 pb-2">3. Use of Information</h2>
                        <p className="text-luxury-charcoal/70 dark:text-white/70 leading-relaxed font-sans">
                            The information we collect is used to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-luxury-charcoal/70 dark:text-white/70 font-sans">
                            <li>Process your reservations and provide resort services.</li>
                            <li>Send booking confirmations and updates.</li>
                            <li>Improve our guest experiences and website functionality.</li>
                            <li>Comply with legal obligations.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white border-b border-luxury-gold/20 pb-2">4. Data Security</h2>
                        <p className="text-luxury-charcoal/70 dark:text-white/70 leading-relaxed font-sans">
                            We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. Your peace of mind is our top priority.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white border-b border-luxury-gold/20 pb-2">5. Contact Us</h2>
                        <p className="text-luxury-charcoal/70 dark:text-white/70 leading-relaxed font-sans">
                            If you have any questions regarding this Privacy Policy, please contact our legal department at privacy@oceanviewresort.com.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
