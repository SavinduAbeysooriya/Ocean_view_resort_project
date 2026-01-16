import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import { LayoutDashboard, Calendar, ConciergeBell, LogOut } from 'lucide-react';

const StaffDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-300 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-luxury-charcoal text-white p-8 flex flex-col space-y-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border border-luxury-gold flex items-center justify-center transform rotate-45">
            <span className="transform -rotate-45 text-luxury-gold font-serif font-bold">O</span>
          </div>
          <span className="font-serif font-bold tracking-widest text-sm uppercase">Staff Portal</span>
        </div>

        <nav className="flex-1 space-y-4">
          {[
            { icon: LayoutDashboard, label: 'Room Service', active: true },
            { icon: Calendar, label: 'Housekeeping' },
            { icon: ConciergeBell, label: 'Guest Service' }
          ].map((item, idx) => (
            <button key={idx} className={`w-full flex items-center space-x-4 p-3 rounded-sm transition-all ${item.active ? 'bg-luxury-gold text-white' : 'hover:bg-white/5 text-white/60'}`}>
              <item.icon size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={logout} className="flex items-center space-x-4 p-3 text-red-400 hover:bg-red-500/10 rounded-sm transition-all">
          <LogOut size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl font-serif text-luxury-charcoal dark:text-white mb-4">Staff Desk</h1>
        <p className="text-luxury-charcoal/40 dark:text-white/40 mb-8 max-w-md">Operations center for Ocean View Resort. Welcome, member {user?.username}.</p>
        <div className="p-12 border-2 border-dashed border-luxury-gold/20 rounded-sm w-full max-w-2xl">
            <span className="text-luxury-gold tracking-[0.3em] uppercase text-xs font-bold">New Task Queue Currently Empty</span>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
