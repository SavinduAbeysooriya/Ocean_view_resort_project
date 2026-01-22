import React from 'react';
import { motion } from 'framer-motion';
import headerImage from '../assets/faq_header.jpg';
import { 
  Search, Calendar, CreditCard, User, 
  ChevronRight, MapPin, Coffee, ShieldCheck 
} from 'lucide-react';

const Help = () => {
    return (
        <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-500">
            {/* Page Header Component */}
            <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden mb-20">
                <div className="absolute inset-0 bg-black/50 z-10 transition-colors duration-300 dark:bg-black/60"></div>
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${headerImage})` }}
                ></div>
                <div className="relative z-20 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-luxury-gold tracking-[0.4em] uppercase text-xs font-bold mb-4 block">
                            Customer Support
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif text-white drop-shadow-2xl">
                            Help Center
                        </h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 mb-20">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <p className="text-luxury-charcoal/70 dark:text-white/70 font-serif text-xl">How can we assist you today?</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    
                    {/* Booking Workflow */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-luxury-charcoal/20 p-8 rounded-sm shadow-xl border border-black/5 dark:border-white/5"
                    >
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 rounded-full bg-luxury-gold/10 text-luxury-gold">
                                <Calendar size={24} />
                            </div>
                            <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white">Making a Reservation</h2>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm">
                                <ChevronRight size={16} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span>Navigate to the <strong>Rooms</strong> page to browse our available suites.</span>
                            </li>
                            <li className="flex items-start space-x-3 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm">
                                <ChevronRight size={16} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span>Use the filters to select your check-in/out dates, guest count, and preferred amenities.</span>
                            </li>
                            <li className="flex items-start space-x-3 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm">
                                <ChevronRight size={16} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span>Click <strong>Book Now</strong> on your desired room to proceed to checkout.</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Payment & Invoicing */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-luxury-charcoal/20 p-8 rounded-sm shadow-xl border border-black/5 dark:border-white/5"
                    >
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 rounded-full bg-luxury-gold/10 text-luxury-gold">
                                <CreditCard size={24} />
                            </div>
                            <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white">Payments & Billing</h2>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm">
                                <ChevronRight size={16} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span>Securely pay for your reservation using our integrated payment gateway.</span>
                            </li>
                            <li className="flex items-start space-x-3 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm">
                                <ChevronRight size={16} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span>Access your <strong>Invoices</strong> directly from your Profile dashboard.</span>
                            </li>
                            <li className="flex items-start space-x-3 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm">
                                <ChevronRight size={16} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span>All transactions are encrypted and processed securely.</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Account Management */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-luxury-charcoal/20 p-8 rounded-sm shadow-xl border border-black/5 dark:border-white/5"
                    >
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 rounded-full bg-luxury-gold/10 text-luxury-gold">
                                <User size={24} />
                            </div>
                            <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white">Account Management</h2>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm">
                                <ChevronRight size={16} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span>Update your personal details and contact information in the <strong>Profile</strong> section.</span>
                            </li>
                            <li className="flex items-start space-x-3 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm">
                                <ChevronRight size={16} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span>View your complete booking history and upcoming stays.</span>
                            </li>
                        </ul>
                    </motion.div>

                     {/* Resort Policies */}
                     <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-luxury-charcoal/20 p-8 rounded-sm shadow-xl border border-black/5 dark:border-white/5"
                    >
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 rounded-full bg-luxury-gold/10 text-luxury-gold">
                                <ShieldCheck size={24} />
                            </div>
                            <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white">Resort Policies</h2>
                        </div>
                         <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm">
                                <ChevronRight size={16} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span>Check-in time is usually from 14:00, and Check-out applies until 12:00.</span>
                            </li>
                            <li className="flex items-start space-x-3 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm">
                                <ChevronRight size={16} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span>Please review our cancellation policy before confirming your booking.</span>
                            </li>
                        </ul>
                    </motion.div>

                </div>

                {/* Contact CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 p-8 md:p-12 text-center bg-luxury-gold/5 dark:bg-white/5 rounded-sm border border-luxury-gold/20"
                >
                    <h3 className="text-3xl font-serif text-luxury-charcoal dark:text-white mb-4">Still have questions?</h3>
                    <p className="text-luxury-charcoal/70 dark:text-white/70 mb-8 max-w-2xl mx-auto">
                        Our dedicated concierge team is available 24/7 to assist you with any inquiries or special requests.
                    </p>
                    <a 
                        href="/contact" 
                        className="inline-block px-8 py-3 bg-luxury-gold text-white uppercase tracking-widest text-xs font-bold hover:bg-black transition-colors duration-300"
                    >
                        Contact Concierge
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default Help;
