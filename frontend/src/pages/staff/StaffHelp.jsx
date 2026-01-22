import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StaffSidebar from '../../components/staff/StaffSidebar';
import StaffHeader from '../../components/staff/StaffHeader';
import { 
  Calendar, CheckCircle, XCircle, Search, 
  ChevronRight, Info, Coffee 
} from 'lucide-react';

const StaffHelp = () => {
    const [activeTab, setActiveTab] = useState('Help'); 

    return (
        <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-500 flex selection:bg-luxury-gold selection:text-white">
            <StaffSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-6 lg:p-12 min-h-screen pt-20 lg:pt-12">
                <StaffHeader 
                    subtitle="Operational Manual"
                    title="Staff Guidelines"
                    description="Standard Operating Procedures for Reservation Management."
                />

                <div className="max-w-5xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-10"
                    >
                        
                        {/* Intro */}
                         <div className="bg-luxury-gold/10 dark:bg-white/5 p-6 rounded-sm border border-luxury-gold/20 flex items-start space-x-4">
                            <Info className="text-luxury-gold mt-1" size={24} />
                            <div>
                                <h3 className="font-serif font-bold text-luxury-charcoal dark:text-white text-lg mb-2">Welcome to the Team</h3>
                                <p className="text-luxury-charcoal/80 dark:text-white/80 text-sm leading-relaxed">
                                    This guide is designed to help new staff members navigate the Reservation System efficiently. 
                                    Please read through the procedures below to ensure seamless guest experiences.
                                </p>
                            </div>
                        </div>

                        {/* Calendar Operations */}
                        <section className="bg-white dark:bg-luxury-charcoal/20 p-8 rounded-sm shadow-xl border border-black/5 dark:border-white/5">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="p-3 rounded-full bg-luxury-gold/10 text-luxury-gold">
                                    <Calendar size={24} />
                                </div>
                                <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white">Using the Calendar</h2>
                            </div>
                            <div className="space-y-6">
                                <p className="text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm">
                                    The <strong>Schedules</strong> tab displays a visual timeline of all bookings. Use this to quickly identify room availability and upcoming turnovers.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border-l-2 border-green-500 pl-4 py-2">
                                        <h4 className="font-bold text-green-500 text-xs uppercase tracking-widest mb-1">Confirmed</h4>
                                        <p className="text-xs text-luxury-charcoal/60 dark:text-white/60">Green events indicate fully paid and confirmed bookings. These focus on preparation.</p>
                                    </div>
                                    <div className="border-l-2 border-yellow-500 pl-4 py-2">
                                        <h4 className="font-bold text-yellow-500 text-xs uppercase tracking-widest mb-1">Pending</h4>
                                        <p className="text-xs text-luxury-charcoal/60 dark:text-white/60">Yellow events require attention. Usually awaiting payment confirmation.</p>
                                    </div>
                                    <div className="border-l-2 border-blue-500 pl-4 py-2">
                                        <h4 className="font-bold text-blue-500 text-xs uppercase tracking-widest mb-1">Checked In</h4>
                                        <p className="text-xs text-luxury-charcoal/60 dark:text-white/60">Blue events represent guests currently in-house. Monitor for service requests.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                         {/* Guest Processing */}
                         <section className="bg-white dark:bg-luxury-charcoal/20 p-8 rounded-sm shadow-xl border border-black/5 dark:border-white/5">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="p-3 rounded-full bg-luxury-gold/10 text-luxury-gold">
                                    <CheckCircle size={24} />
                                </div>
                                <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white">Check-In & Check-Out Procedures</h2>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-serif text-lg text-luxury-gold mb-3">1. Verification</h3>
                                    <p className="text-luxury-charcoal/70 dark:text-white/70 text-sm mb-4">
                                        Always verify the guest's identity using the <strong>Guest List</strong> search function. 
                                        Ensure their NIC/Passport matches the booking details.
                                    </p>
                                </div>
                                
                                <div>
                                    <h3 className="font-serif text-lg text-luxury-gold mb-3">2. Processing</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start space-x-3 text-luxury-charcoal/70 dark:text-white/70 text-sm">
                                            <ChevronRight size={16} className="mt-0.5 text-luxury-gold flex-shrink-0" />
                                            <span>Locate the reservation on the specific date.</span>
                                        </li>
                                        <li className="flex items-start space-x-3 text-luxury-charcoal/70 dark:text-white/70 text-sm">
                                            <ChevronRight size={16} className="mt-0.5 text-luxury-gold flex-shrink-0" />
                                            <span>Click the event to view the <strong>Dossier Details</strong> modal.</span>
                                        </li>
                                        <li className="flex items-start space-x-3 text-luxury-charcoal/70 dark:text-white/70 text-sm">
                                            <ChevronRight size={16} className="mt-0.5 text-luxury-gold flex-shrink-0" />
                                            <span>Confirm payment status is 'PAID' before handing over keys.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Troubleshooting */}
                        <section className="bg-white dark:bg-luxury-charcoal/20 p-8 rounded-sm shadow-xl border border-black/5 dark:border-white/5">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="p-3 rounded-full bg-luxury-gold/10 text-luxury-gold">
                                    <Coffee size={24} />
                                </div>
                                <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white">Assistance</h2>
                            </div>
                            <p className="text-luxury-charcoal/70 dark:text-white/70 text-sm mb-4">
                                If you encounter technical issues or discrepancies in the reservation data:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-luxury-charcoal/70 dark:text-white/70 text-sm">
                                <li>Do not attempt to modify database records manually.</li>
                                <li>Contact the <strong>System Administrator</strong> immediately.</li>
                                <li>Log the incident in the physical front-desk logbook for backup.</li>
                            </ul>
                        </section>

                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default StaffHelp;
