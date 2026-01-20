import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { 
  DollarSign, UserCheck, Hotel, Calendar
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chart Data State
  const [revenueData, setRevenueData] = useState([]);
  const [bookingStatusData, setBookingStatusData] = useState([]);

  const API_URL = 'http://localhost:8080/api/dashboard/stats';

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data;
      setStats(data);

      // Process Revenue Data for Chart (Map to Array)
      const revArray = Object.keys(data.revenueByMonth || {}).map(key => ({
        name: key,
        amount: data.revenueByMonth[key]
      }));
      setRevenueData(revArray);

      // Process Booking Status Data
      const statusArray = Object.keys(data.bookingsByStatus || {}).map(key => ({
        name: key,
        value: data.bookingsByStatus[key]
      }));
      setBookingStatusData(statusArray);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const statCards = [
    { label: 'Total Revenue', value: stats ? `$${stats.totalRevenue.toLocaleString()}` : '...', icon: DollarSign, color: 'text-green-500' },
    { label: 'Total Bookings', value: stats ? stats.totalBookings : '...', icon: Calendar, color: 'text-luxury-gold' },
    { label: 'Total Users', value: stats ? stats.totalUsers : '...', icon: UserCheck, color: 'text-blue-500' },
    { label: 'Total Rooms', value: stats ? stats.totalRooms : '...', icon: Hotel, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-500 flex selection:bg-luxury-gold selection:text-white">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-12 min-h-screen pt-20 lg:pt-12">
        <AdminHeader 
          subtitle="Central Intelligence"
          title="Executive Dashboard"
          description="Real-time resort overview and analytics."
        />

        {/* Statistical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statCards.map((stat, idx) => (
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
              </div>
              <div className="mt-8 relative z-10">
                <h3 className="text-4xl font-serif text-luxury-charcoal dark:text-white mb-2 tracking-tight">{stat.value}</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-charcoal/40 dark:text-white/40">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-luxury-charcoal/20 border border-black/5 dark:border-white/5 rounded-sm p-8 shadow-xl">
                <h3 className="text-xl font-serif text-luxury-charcoal dark:text-white mb-6">Revenue Overview</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: darkMode ? '#1a1a1a' : '#fff', border: 'none', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: darkMode ? '#fff' : '#000' }}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Booking Status Chart */}
            <div className="bg-white dark:bg-luxury-charcoal/20 border border-black/5 dark:border-white/5 rounded-sm p-8 shadow-xl">
                 <h3 className="text-xl font-serif text-luxury-charcoal dark:text-white mb-6">Reservation Status</h3>
                 <div className="h-80 w-full flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={bookingStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {bookingStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: darkMode ? '#1a1a1a' : '#fff', border: 'none', borderRadius: '4px' }}
                            />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
            </div>
        </div>

        {/* Quick Actions / System Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                   { label: 'Create Room', icon: Hotel, path: '/admin/rooms' },
                   { icon: UserCheck, label: 'Manage Users', path: '/admin/users' },
                   { icon: Calendar, label: 'View Bookings', path: '/admin/reservations' },
                   { icon: DollarSign, label: 'Financials', path: '#' }
                 ].map((action, idx) => (
                   <button 
                        key={idx} 
                        onClick={() => action.path !== '#' && navigate(action.path)}
                        className="flex flex-col items-center justify-center p-6 bg-luxury-dark/5 dark:bg-white/5 rounded-sm hover:bg-luxury-gold/10 hover:text-luxury-gold transition-all duration-300 group"
                    >
                     <action.icon size={20} className="mb-3 group-hover:scale-110 transition-transform" />
                     <span className="text-[8px] uppercase font-bold tracking-widest">{action.label}</span>
                   </button>
                 ))}
               </div>
             </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
