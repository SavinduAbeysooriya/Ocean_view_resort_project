import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import { 
  LayoutDashboard, Users, Hotel, Calendar, Settings, LogOut, 
  Moon, Sun, TrendingUp, DollarSign, UserCheck, Bell, Search,
  ArrowUpRight, Clock
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  const stats = [
    { label: 'Total Revenue', value: '$128,430', change: '+12.5%', icon: DollarSign, color: 'text-green-500' },
    { label: 'Total Bookings', value: '842', change: '+18.2%', icon: Calendar, color: 'text-luxury-gold' },
    { label: 'Active Guests', value: '42', change: '+5.4%', icon: UserCheck, color: 'text-blue-500' },
    { label: 'Growth rate', value: '24.8%', change: '+2.1%', icon: TrendingUp, color: 'text-purple-500' },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'New Booking', room: 'Royal Suite', time: '2 mins ago', status: 'Pending' },
    { user: 'Sarah Wilson', action: 'Checked In', room: 'Deluxe Ocean View', time: '15 mins ago', status: 'Active' },
    { user: 'Robert Fox', action: 'Payment Received', room: 'Villa Azure', time: '1 hour ago', status: 'Completed' },
    { user: 'Esther Howard', action: 'Canceled', room: 'Standard Room', time: '3 hours ago', status: 'Canceled' },
  ];

  return (
    <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-500 flex selection:bg-luxury-gold selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-luxury-dark text-white p-8 flex flex-col space-y-10 fixed h-full z-30 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 border-2 border-luxury-gold flex items-center justify-center transform rotate-45 group cursor-pointer hover:rotate-[225deg] transition-all duration-700">
            <span className="transform -rotate-45 text-luxury-gold font-serif font-bold text-xl group-hover:rotate-[-225deg] transition-all duration-700">O</span>
          </div>
          <div>
            <span className="font-serif font-bold tracking-[0.2em] text-sm uppercase block">Ocean View</span>
            <span className="text-[8px] uppercase tracking-[0.4em] text-luxury-gold/60 font-bold">Admin Authority</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard', active: true },
            { icon: Users, label: 'Guests', path: '#' },
            { icon: Hotel, label: 'Room Categories', path: '/admin/room-categories' },
            { icon: Hotel, label: 'Rooms', path: '/admin/rooms' },
            { icon: Calendar, label: 'Bookings', path: '#' },
            { icon: Settings, label: 'Settings', path: '#' }
          ].map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={`w-full flex items-center space-x-4 p-4 rounded-sm transition-all duration-300 group ${item.active ? 'bg-luxury-gold text-white shadow-lg shadow-luxury-gold/20' : 'hover:bg-white/5 text-white/40 hover:text-white'}`}
            >
              <item.icon size={18} className={`${item.active ? 'scale-110' : 'group-hover:translate-x-1'} transition-all`} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-4">
          <button onClick={logout} className="w-full flex items-center space-x-4 p-4 text-red-400/60 hover:text-red-400 hover:bg-red-400/5 rounded-sm transition-all duration-300 group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12 min-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b border-black/5 dark:border-white/5 pb-10 gap-8">
          <div>
            <div className="flex items-center space-x-3 text-[10px] uppercase font-bold tracking-[0.3em] text-luxury-gold mb-4">
              <span className="w-8 h-[1px] bg-luxury-gold/30"></span>
              <span>Central Intelligence</span>
            </div>
            <h1 className="text-5xl font-serif text-luxury-charcoal dark:text-white tracking-tight leading-none mb-4">Executive Dashboard</h1>
            <p className="text-luxury-charcoal/40 dark:text-white/40 text-sm font-medium italic">Synchronized at: {new Date().toLocaleTimeString()}</p>
          </div>
          
          <div className="flex items-center space-x-6 bg-white/50 dark:bg-luxury-charcoal/30 p-2 rounded-full border border-black/5 dark:border-white/5 backdrop-blur-xl">
            <button 
              onClick={toggleDarkMode}
              className="p-3 bg-white dark:bg-luxury-charcoal rounded-full shadow-lg text-luxury-gold hover:scale-110 transition-all duration-300"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-8 w-[1px] bg-black/10 dark:bg-white/10 mx-2"></div>
            <div className="flex items-center space-x-4 pr-6">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal dark:text-white leading-none mb-1">{user?.username}</p>
                <p className="text-[8px] uppercase tracking-widest text-luxury-gold font-bold">Administrator</p>
              </div>
              <div className="relative">
                <img src={`https://ui-avatars.com/api/?name=${user?.username}&background=D4AF37&color=fff`} className="w-12 h-12 rounded-full border-2 border-luxury-gold p-0.5 shadow-xl" alt="Avatar" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-luxury-dark"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Statistical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-luxury-charcoal/20 p-8 border border-black/5 dark:border-white/5 rounded-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-150 group-hover:opacity-20 transition-all duration-700">
                <stat.icon size={80} />
              </div>
              <div className="flex justify-between items-start relative z-10">
                <div className={`p-3 rounded-sm bg-luxury-dark/5 dark:bg-white/5 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div className="flex items-center space-x-1 text-green-500 font-bold text-[10px]">
                  <ArrowUpRight size={12} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="mt-8 relative z-10">
                <h3 className="text-4xl font-serif text-luxury-charcoal dark:text-white mb-2 tracking-tight">{stat.value}</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-charcoal/40 dark:text-white/40">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white dark:bg-luxury-charcoal/20 border border-black/5 dark:border-white/5 rounded-sm overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-luxury-dark/5 dark:bg-white/5">
              <div className="flex items-center space-x-3">
                <Clock className="text-luxury-gold" size={20} />
                <h2 className="text-xl font-serif text-luxury-charcoal dark:text-white uppercase tracking-widest">Recent Activity</h2>
              </div>
              <button className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold hover:text-luxury-gold/70 transition-colors">View All Archive</button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-luxury-dark/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5">
                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/40 dark:text-white/40">Authority / Guest</th>
                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/40 dark:text-white/40">Classification</th>
                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/40 dark:text-white/40">Timestamp</th>
                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/40 dark:text-white/40 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {recentActivities.map((activity, idx) => (
                    <motion.tr 
                      key={idx}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="group hover:bg-luxury-gold/5 transition-colors duration-300"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center text-[10px] font-bold text-luxury-gold">
                            {activity.user.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-luxury-charcoal dark:text-white">{activity.user}</p>
                            <p className="text-[10px] text-luxury-charcoal/40 dark:text-white/40 italic">{activity.room}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-medium text-luxury-charcoal/60 dark:text-white/60">{activity.action}</span>
                      </td>
                      <td className="px-8 py-6 text-xs text-luxury-charcoal/40 dark:text-white/40">{activity.time}</td>
                      <td className="px-8 py-6 text-right">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                          activity.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                          activity.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                          activity.status === 'Canceled' ? 'bg-red-500/10 text-red-400' :
                          'bg-luxury-gold/10 text-luxury-gold'
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / System Health */}
          <div className="space-y-12">
            <div className="bg-luxury-dark text-white p-10 rounded-sm shadow-2xl relative overflow-hidden group">
              <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <h2 className="text-2xl font-serif mb-8 relative z-10 tracking-widest">System Health</h2>
              <div className="space-y-6 relative z-10">
                {[
                  { label: 'Server Latency', value: '24ms', color: 'bg-green-500' },
                  { label: 'Database Sync', value: '100%', color: 'bg-luxury-gold' },
                  { label: 'Storage Usage', value: '12.4GB', color: 'bg-blue-500' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-3">
                      <span className="text-white/60">{item.label}</span>
                      <span className="text-white">{item.value}</span>
                    </div>
                    <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100' }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-luxury-charcoal/20 p-8 border border-black/5 dark:border-white/5 shadow-2xl rounded-sm">
              <h2 className="text-lg font-serif mb-6 uppercase tracking-[0.2em] text-luxury-gold">Operations Core</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Create Room', icon: Hotel },
                  { icon: UserCheck, label: 'Audit Guests' },
                  { icon: Bell, label: 'Broadcast' },
                  { icon: DollarSign, label: 'Financials' }
                ].map((action, idx) => (
                  <button key={idx} className="flex flex-col items-center justify-center p-6 bg-luxury-dark/5 dark:bg-white/5 rounded-sm hover:bg-luxury-gold/10 hover:text-luxury-gold transition-all duration-300 group">
                    <action.icon size={20} className="mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] uppercase font-bold tracking-widest">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
