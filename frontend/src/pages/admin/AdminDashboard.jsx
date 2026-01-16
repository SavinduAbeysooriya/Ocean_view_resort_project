import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import { LayoutDashboard, Users, Hotel, Calendar, Settings, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-300 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-luxury-dark text-white p-8 flex flex-col space-y-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border border-luxury-gold flex items-center justify-center transform rotate-45">
            <span className="transform -rotate-45 text-luxury-gold font-serif font-bold">O</span>
          </div>
          <span className="font-serif font-bold tracking-widest text-sm uppercase">Admin Portal</span>
        </div>

        <nav className="flex-1 space-y-4">
          {[
            { icon: LayoutDashboard, label: 'Overview', active: true },
            { icon: Users, label: 'Guests' },
            { icon: Hotel, label: 'Rooms' },
            { icon: Calendar, label: 'Bookings' },
            { icon: Settings, label: 'Settings' }
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
      <main className="flex-1 p-12">
        <header className="flex justify-between items-center mb-12 border-b border-black/5 dark:border-white/5 pb-8">
          <div>
            <h1 className="text-3xl font-serif text-luxury-charcoal dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-luxury-charcoal/40 dark:text-white/40 text-sm">Welcome back, {user?.username}</p>
          </div>
          <div className="flex items-center space-x-4">
            <img src={`https://ui-avatars.com/api/?name=${user?.username}&background=D4AF37&color=fff`} className="w-10 h-10 rounded-full border border-luxury-gold" alt="Avatar" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Bookings', value: '1,284', grow: '+12%' },
            { label: 'Revenue', value: '$84,200', grow: '+5.4%' },
            { label: 'Active Guests', value: '42', grow: 'Stable' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-luxury-charcoal/40 p-8 border border-black/5 dark:border-white/5 rounded-sm shadow-xl">
              <p className="text-[10px] uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 font-bold mb-4">{stat.label}</p>
              <div className="flex justify-between items-end">
                <h3 className="text-3xl font-serif text-luxury-charcoal dark:text-white">{stat.value}</h3>
                <span className="text-xs text-green-500 font-bold">{stat.grow}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
