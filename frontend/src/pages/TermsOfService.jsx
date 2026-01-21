import React from 'react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
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
                        <span>Legal Terms</span>
                        <span className="w-8 h-[1px] bg-luxury-gold/30"></span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif text-luxury-charcoal dark:text-white mb-6">Terms of Service</h1>
                    <p className="text-luxury-charcoal/40 dark:text-white/40 italic font-sans">Last updated: January 21, 2026</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="prose prose-luxury dark:prose-invert max-w-none space-y-12"
                >
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white border-b border-luxury-gold/20 pb-2">1. Agreement to Terms</h2>
                        <p className="text-luxury-charcoal/70 dark:text-white/70 leading-relaxed font-sans">
                            By accessing or using the services of Ocean View Resort, you agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white border-b border-luxury-gold/20 pb-2">2. Reservations and Billing</h2>
                        <p className="text-luxury-charcoal/70 dark:text-white/70 leading-relaxed font-sans">
                            All reservations are subject to availability and confirmation. Payment must be made in full as per the billing cycle specified during booking. We reserve the right to cancel bookings if payment is not received.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white border-b border-luxury-gold/20 pb-2">3. Guest Conduct</h2>
                        <p className="text-luxury-charcoal/70 dark:text-white/70 leading-relaxed font-sans">
                            Guests are expected to behave in a respectful manner towards other guests and resort staff. Any illegal activity or violation of resort rules may result in immediate eviction without refund.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white border-b border-luxury-gold/20 pb-2">4. Limitation of Liability</h2>
                        <p className="text-luxury-charcoal/70 dark:text-white/70 leading-relaxed font-sans">
                            Ocean View Resort shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our facilities or website.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white border-b border-luxury-gold/20 pb-2">5. Governing Law</h2>
                        <p className="text-luxury-charcoal/70 dark:text-white/70 leading-relaxed font-sans">
                            These terms are governed by the laws of Sri Lanka. Any disputes shall be resolved in the appropriate courts of the jurisdiction.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white border-b border-luxury-gold/20 pb-2">6. Modifications</h2>
                        <p className="text-luxury-charcoal/70 dark:text-white/70 leading-relaxed font-sans">
                            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfService;
