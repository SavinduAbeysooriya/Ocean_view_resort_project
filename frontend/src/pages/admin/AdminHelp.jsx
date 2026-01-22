import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { 
  BookOpen, Users, Calendar, Settings, 
  ChevronRight, Database, Shield, LayoutDashboard 
} from 'lucide-react';

const AdminHelp = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-500 flex selection:bg-luxury-gold selection:text-white">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-12 min-h-screen pt-20 lg:pt-12">
        <AdminHeader 
          subtitle="System Documentation"
          title="Admin Guide"
          description="Comprehensive manual for administrative operations."
        />

        <div className="max-w-5xl">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
            >
                {/* Dashboard Overview */}
                <section className="bg-white dark:bg-luxury-charcoal/20 p-8 rounded-sm shadow-xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 rounded-full bg-luxury-gold/10 text-luxury-gold">
                            <LayoutDashboard size={24} />
                        </div>
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white">Dashboard Intelligence</h2>
                    </div>
                    <div className="space-y-4 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm leading-relaxed">
                        <p>
                            The <strong>Executive Dashboard</strong> provides a real-time overview of the resort's performance. 
                            It aggregates data from all modules to present key metrics such as Total Revenue, Active Bookings, and Occupancy Rates.
                        </p>
                        <ul className="pl-4 space-y-2">
                            <li className="flex items-start space-x-2">
                                <ChevronRight size={14} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span><strong>Revenue Charts:</strong> Visualize income trends over time.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <ChevronRight size={14} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span><strong>Booking Status:</strong> Quick breakdown of confirmed vs. pending reservations.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Room Management */}
                <section className="bg-white dark:bg-luxury-charcoal/20 p-8 rounded-sm shadow-xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 rounded-full bg-luxury-gold/10 text-luxury-gold">
                            <Database size={24} />
                        </div>
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white">Room & Inventory Management</h2>
                    </div>
                     <div className="space-y-4 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm leading-relaxed">
                        <p>
                           Manage the physical inventory of the resort through the <strong>Rooms</strong> and <strong>Categories</strong> sections.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="bg-luxury-dark/5 dark:bg-white/5 p-4 rounded-sm">
                                <h3 className="font-serif font-bold text-luxury-gold mb-2">Room Categories</h3>
                                <p className="text-xs">Define types of suites (e.g., Deluxe, Ocean View) with base amenities and pricing tiers.</p>
                            </div>
                            <div className="bg-luxury-dark/5 dark:bg-white/5 p-4 rounded-sm">
                                <h3 className="font-serif font-bold text-luxury-gold mb-2">Individual Rooms</h3>
                                <p className="text-xs">Manage specific room numbers, assign them to categories, and track their operational status (Clean, Dirty, Maintenance).</p>
                            </div>
                        </div>
                    </div>
                </section>

                 {/* Reservation Control */}
                 <section className="bg-white dark:bg-luxury-charcoal/20 p-8 rounded-sm shadow-xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 rounded-full bg-luxury-gold/10 text-luxury-gold">
                            <Calendar size={24} />
                        </div>
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white">Reservation Control</h2>
                    </div>
                    <div className="space-y-4 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm leading-relaxed">
                        <p>
                            The Central Reservation System allows for complete oversight of guest bookings.
                        </p>
                        <ul className="pl-4 space-y-2">
                            <li className="flex items-start space-x-2">
                                <ChevronRight size={14} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span><strong>View Details:</strong> Access comprehensive guest information and payment status.</span>
                            </li>
                             <li className="flex items-start space-x-2">
                                <ChevronRight size={14} className="mt-1 text-luxury-gold flex-shrink-0" />
                                <span><strong>Status Updates:</strong> Manually Check-In, Check-Out, or Cancel reservations as needed.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                 {/* User Administration */}
                 <section className="bg-white dark:bg-luxury-charcoal/20 p-8 rounded-sm shadow-xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 rounded-full bg-luxury-gold/10 text-luxury-gold">
                            <Users size={24} />
                        </div>
                        <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white">User Administration</h2>
                    </div>
                    <div className="space-y-4 text-luxury-charcoal/70 dark:text-white/70 font-sans text-sm leading-relaxed">
                        <p>
                            Manage system access for both Staff and Guests. Ensure that roles are correctly assigned to maintain system security.
                        </p>
                        <div className="flex items-center space-x-2 text-red-400 mt-2">
                            <Shield size={14} />
                            <span className="text-xs uppercase font-bold tracking-widest">Security Warning</span>
                        </div>
                        <p className="text-xs italic">
                            Only grant Admin privileges to authorized senior management. Regularly audit staff accounts.
                        </p>
                    </div>
                </section>

            </motion.div>
        </div>

      </main>
    </div>
  );
};

export default AdminHelp;
