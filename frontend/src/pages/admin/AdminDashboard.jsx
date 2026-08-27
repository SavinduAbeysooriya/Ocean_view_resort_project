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
import { API_URL as BASE_API_URL } from '../../config/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chart Data State
  const [revenueData, setRevenueData] = useState([]);
  const [bookingStatusData, setBookingStatusData] = useState([]);

  const API_URL = `${BASE_API_URL}/dashboard/stats`;

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
    { label: 'Total Revenue', value: stats ? `LKR ${stats.totalRevenue.toLocaleString()}` : '...', icon: DollarSign, color: 'text-green-500' },
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
                            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `LKR ${value}`} />
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



      </main>
    </div>
  );
};

export default AdminDashboard;
