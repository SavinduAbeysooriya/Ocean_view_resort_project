import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import { 
  Calendar as CalIcon, ConciergeBell, User, Home, Phone, Mail, Clock, 
  TrendingUp, Users, Hotel, DollarSign, Search, ChevronRight, X, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import StaffSidebar from '../../components/staff/StaffSidebar';
import StaffHeader from '../../components/staff/StaffHeader';

const localizer = momentLocalizer(moment);

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview'); // Overview, Schedules, Guest List
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestDetails, setGuestDetails] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  // Analytics & Guest List State
  const [stats, setStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [resResponse, statsResponse, usersResponse] = await Promise.all([
        axios.get(`${API_URL}/reservations`, { headers }),
        axios.get(`${API_URL}/dashboard/stats`, { headers }),
        axios.get(`${API_URL}/users`, { headers })
      ]);
      
      // Parse Calendar Events
      const parsedEvents = resResponse.data.map(res => ({
        id: res.id,
        title: `Room ${res.roomNumber || 'Room'} - ${res.reservationNumber}`,
        start: moment(res.checkInDate).toDate(),
        end: moment(res.checkOutDate).toDate(),
        resource: res,
        allDay: true
      }));

      setEvents(parsedEvents);
      setStats(statsResponse.data);
      
      // Fix: Filter for CUSTOMER role (case insensitive to be safe)
      const customers = usersResponse.data.filter(u => {
        const userRole = u.role?.toUpperCase();
        return userRole === 'CUSTOMER' || userRole === 'ROLE_CUSTOMER';
      });
      setAllUsers(customers);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff data:', error);
      setLoading(false);
    }
  };

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event.resource);
    setIsModalOpen(true);
    setGuestDetails(null);
    setRoomDetails(null);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (event.resource.guestId) {
        const gRes = await axios.get(`${API_URL}/guests/${event.resource.guestId}`, { headers });
        setGuestDetails(gRes.data);
      }
      if (event.resource.roomId) {
        const rRes = await axios.get(`${API_URL}/rooms/${event.resource.roomId}`, { headers });
        setRoomDetails(rRes.data);
      }
    } catch (err) {
      console.error("Error fetching details:", err);
    }
  };

  const eventStyleGetter = (event) => {
    const status = event.resource.status?.toLowerCase();
    let backgroundColor = '#D4AF37'; 
    if (status === 'confirmed') backgroundColor = '#10B981';
    if (status === 'cancelled') backgroundColor = '#EF4444';
    if (status === 'checked_in') backgroundColor = '#3B82F6';

    return {
      style: { backgroundColor, borderRadius: '2px', opacity: 0.8, color: 'white', border: 'none', display: 'block', fontSize: '11px', fontWeight: 'bold', padding: '2px 5px' }
    };
  };

  const getTabDescription = () => {
    switch(activeTab) {
      case 'Overview': return "Real-time resort overview and analytics.";
      case 'Schedules': return "Manage room turnover and guest check-ins.";
      case 'Guest List': return "Registered resort clientele directory.";
      default: return "Staff portal operations.";
    }
  };

  return (
    <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-500 flex selection:bg-luxury-gold selection:text-white">
      <StaffSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-12 min-h-screen pt-20 lg:pt-12">
        <StaffHeader 
          subtitle="Staff Operations"
          title={activeTab}
          description={getTabDescription()}
        />

        {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : (
            <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* --- OVERVIEW TAB --- */}
                {activeTab === 'Overview' && (
                    <div className="space-y-10">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                            {[
                                { label: 'Total Revenue', value: stats ? `$${stats.totalRevenue.toLocaleString()}` : '...', icon: DollarSign, color: 'text-green-500' },
                                { label: 'Active Bookings', value: stats ? stats.totalBookings : '...', icon: CalIcon, color: 'text-luxury-gold' },
                                { label: 'Total Guests', value: allUsers?.length || 0, icon: Users, color: 'text-blue-500' },
                                { label: 'Total Rooms', value: stats ? stats.totalRooms : '...', icon: Hotel, color: 'text-purple-500' },
                            ].map((stat, idx) => (
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

                        {/* Middle Row: Analytics Grid Mapping Admin Style */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white dark:bg-luxury-charcoal/20 p-8 rounded-sm shadow-xl border border-black/5 dark:border-white/5">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-serif text-luxury-charcoal dark:text-white">Revenue Overview</h3>
                                    <TrendingUp className="text-luxury-gold" size={20} />
                                </div>
                                <div className="h-64 flex items-end justify-between space-x-2">
                                    {Object.entries(stats?.revenueByMonth || {}).map(([month, val], i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center group">
                                            <div className="w-full bg-luxury-gold/10 group-hover:bg-luxury-gold/30 transition-all relative rounded-t-sm" style={{ height: `${(val / (stats.totalRevenue || 1)) * 100}%`, minHeight: '10%' }}>
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-luxury-charcoal text-white text-[8px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">${val}</div>
                                            </div>
                                            <span className="text-[10px] mt-4 font-bold text-gray-400 uppercase tracking-widest">{month}</span>
                                        </div>
                                    ))}
                                    {Object.keys(stats?.revenueByMonth || {}).length === 0 && (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">No financial data available.</div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="bg-luxury-dark text-white p-10 rounded-sm shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                                <h2 className="text-2xl font-serif mb-8 relative z-10 tracking-widest leading-none">Ops Intelligence</h2>
                                <div className="space-y-6 relative z-10 font-sans">
                                    {[
                                        { label: 'Room Cleanup Service', value: 'High Priority', color: 'bg-green-500' },
                                        { label: 'Kitchen Readiness', value: 'Operational', color: 'bg-luxury-gold' },
                                        { label: 'Concierge Capacity', value: 'Optimal', color: 'bg-blue-500' }
                                    ].map((item, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-3">
                                                <span className="text-white/60">{item.label}</span>
                                                <span className="text-white">{item.value}</span>
                                            </div>
                                            <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className={`h-full ${item.color}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
                                    <button className="flex items-center space-x-2 text-luxury-gold hover:text-white transition-colors text-[10px] uppercase font-bold tracking-widest">
                                        <span>View System Logs</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SCHEDULES TAB --- */}
                {activeTab === 'Schedules' && (
                    <div className="bg-white dark:bg-luxury-charcoal/20 border border-black/5 dark:border-white/5 rounded-sm p-8 shadow-xl h-[70vh] min-h-[600px] relative z-0">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%' }}
                            onSelectEvent={handleSelectEvent}
                            eventPropGetter={eventStyleGetter}
                            date={currentDate}
                            view={currentView}
                            onNavigate={date => setCurrentDate(date)}
                            onView={view => setCurrentView(view)}
                            className="staff-calendar dark:text-white"
                            messages={{
                              next: "Next",
                              previous: "Back",
                              today: "Current",
                              month: "Month View",
                              week: "Week View",
                              day: "Day View"
                            }}
                        />
                    </div>
                )}

                {/* --- GUEST LIST TAB --- */}
                {activeTab === 'Guest List' && (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-luxury-charcoal/20 p-6 rounded-sm border border-black/5 dark:border-white/5 shadow-xl">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gold" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Executive Guest Search..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-luxury-dark/5 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none pl-14 pr-6 py-3 text-sm text-luxury-charcoal dark:text-white focus:border-luxury-gold transition-all"
                                />
                            </div>
                            <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-charcoal/40 dark:text-white/40">
                                <Users size={16} />
                                <span>{allUsers.length} Registered Resort Guests</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-luxury-charcoal/20 rounded-sm shadow-2xl overflow-hidden border border-black/5 dark:border-white/5">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-sans">
                                    <thead>
                                        <tr className="bg-luxury-dark/5 dark:bg-white/5 text-[10px] uppercase tracking-[0.3em] text-luxury-charcoal/40 dark:text-white/40 border-b border-black/5 dark:border-white/5">
                                            <th className="p-8">Identification</th>
                                            <th className="p-8">System ID</th>
                                            <th className="p-8">Email Credential</th>
                                            <th className="p-8">Member Since</th>
                                            <th className="p-8 text-right">Account Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                                        {allUsers.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((u, i) => (
                                            <tr key={i} className="group hover:bg-luxury-gold/5 dark:hover:bg-luxury-gold/5 transition-all duration-300">
                                                <td className="p-8">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-luxury-dark/5 dark:bg-white/5 flex items-center justify-center text-luxury-gold font-bold rounded-sm border border-black/5 dark:border-white/10 group-hover:border-luxury-gold transition-colors">
                                                            {u.username[0].toUpperCase()}
                                                        </div>
                                                        <span className="font-serif font-bold text-lg text-luxury-charcoal dark:text-white">{u.username}</span>
                                                    </div>
                                                </td>
                                                <td className="p-8 text-[11px] font-mono text-luxury-charcoal/40 dark:text-white/40 uppercase tracking-widest">G-{u.id.substring(u.id.length - 8)}</td>
                                                <td className="p-8">
                                                    <div className="flex items-center space-x-3 text-sm text-luxury-charcoal/60 dark:text-white/60">
                                                        <Mail size={14} className="text-luxury-gold" />
                                                        <span>{u.email}</span>
                                                    </div>
                                                </td>
                                                <td className="p-8 text-[11px] uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">{u.createdAt ? moment(u.createdAt).format('LL') : 'Legacy Member'}</td>
                                                <td className="p-8 text-right">
                                                    <span className="px-4 py-1.5 bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">Active</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {allUsers.length === 0 && (
                                <div className="p-32 text-center">
                                    <Users className="mx-auto text-luxury-gold/10 mb-6" size={80} />
                                    <p className="text-luxury-charcoal/40 dark:text-white/40 font-serif italic text-xl">The guest list is currently empty.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        )}
      </main>

      {/* Reservation Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-luxury-charcoal w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row border border-luxury-gold/20"
            >
                <div className="md:w-1/3 bg-luxury-dark relative min-h-[250px] md:min-h-full">
                    <img 
                      src={roomDetails?.image1 ? `http://localhost:8080${roomDetails.image1}` : "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800"} 
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                      alt="Room"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white p-4">
                        <span className="px-3 py-1 bg-luxury-gold text-white text-[10px] uppercase font-bold tracking-widest rounded-full mb-4 inline-block">
                            {selectedEvent.status || 'Active'}
                        </span>
                        <h2 className="text-4xl font-serif mb-2 leading-none">Room {roomDetails?.roomNumber || '...'}</h2>
                        <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.2em]">{roomDetails?.categoryName || 'Luxury Suite'}</p>
                    </div>
                </div>
                <div className="flex-1 p-8 md:p-14 relative">
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-luxury-charcoal/20 dark:text-white/20 hover:text-red-500 transition-colors"><X size={32} /></button>
                    
                    <div className="mb-14">
                        <p className="text-[10px] text-luxury-gold uppercase tracking-[0.4em] font-bold mb-2">Reservation ID</p>
                        <h3 className="text-2xl font-mono font-bold text-luxury-charcoal dark:text-white tracking-widest">{selectedEvent.reservationNumber}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <div className="flex items-center space-x-3 text-luxury-gold mb-6 pb-2 border-b border-luxury-gold/10"><User size={20} /><h4 className="text-[10px] uppercase font-bold tracking-[0.3em]">Guest Identity</h4></div>
                            <div className="space-y-6">
                                <div><p className="text-2xl font-serif text-charcoal dark:text-white">{guestDetails?.name || 'Contacting...'}</p><p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Verified Member</p></div>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-white/60"><Phone size={16} className="text-luxury-gold" /><span>{guestDetails?.contactNumber}</span></div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-white/60"><Mail size={16} className="text-luxury-gold" /><span className="truncate">{guestDetails?.email}</span></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center space-x-3 text-luxury-gold mb-6 pb-2 border-b border-luxury-gold/10"><Home size={20} /><h4 className="text-[10px] uppercase font-bold tracking-[0.3em]">Operational Task</h4></div>
                            <div className="bg-luxury-cream dark:bg-white/5 p-6 border-l-2 border-luxury-gold mb-6">
                                <p className="text-[10px] uppercase font-bold text-luxury-gold mb-2">Service Note</p>
                                <p className="text-xs italic leading-relaxed text-luxury-charcoal/70 dark:text-white/70">{roomDetails?.amenities || 'Executive room preparation required.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .rbc-calendar { font-family: 'Playfair Display', serif !important; }
        .rbc-header { padding: 20px !important; text-transform: uppercase !important; font-size: 10px !important; letter-spacing: 0.2em !important; font-weight: 800 !important; color: #D4AF37 !important; border-bottom: 2px solid #D4AF3710 !important; }
        .rbc-toolbar-label { font-size: 1.8rem !important; font-weight: 800 !important; tracking-tight; }
        .rbc-toolbar button { border-radius: 0 !important; border: 1px solid #D4AF3720 !important; text-transform: uppercase !important; font-size: 10px !important; font-weight: 800 !important; letter-spacing: 0.1em !important; padding: 12px 24px !important; color: #D4AF37 !important; background: transparent !important; }
        .rbc-toolbar button:hover, .rbc-toolbar button.rbc-active { background: #D4AF37 !important; color: white !important; box-shadow: 0 10px 20px -5px #D4AF3740 !important; }
        .rbc-event { border-radius: 1px !important; }
        .dark .rbc-header { border-color: #D4AF3730 !important; }
        .dark .rbc-off-range-bg { background: rgba(255,255,255,0.02) !important; }
        .dark .rbc-day-bg, .dark .rbc-month-row, .dark .rbc-month-view, .dark .rbc-time-view { border-color: rgba(255,255,255,0.05) !important; }
      `}} />
    </div>
  );
};

export default StaffDashboard;
