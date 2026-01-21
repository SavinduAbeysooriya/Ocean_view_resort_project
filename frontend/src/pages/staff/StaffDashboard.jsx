import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import { 
  Calendar as CalIcon, ConciergeBell, User, Home, Phone, Mail, Clock, 
  TrendingUp, Users, Hotel, DollarSign, Search, ChevronRight, X, AlertCircle, 
  Info, Check, Trash2, Mail as MailIcon, CreditCard
} from 'lucide-react';
import logo from '../../assets/logo.png';
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
                                { label: 'Total Revenue', value: stats ? `LKR ${stats.totalRevenue.toLocaleString()}` : '...', icon: DollarSign, color: 'text-green-500' },
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
                                    placeholder="Guest Search..." 
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
                                            <th className="p-8">Name</th>
                                            <th className="p-8">System ID</th>
                                            <th className="p-8">Email </th>
                                            <th className="p-8">Member Since</th>
                                            
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-luxury-charcoal w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row border border-luxury-gold/20"
            >
                {/* Left Summary Sidebar - View Only */}
                <div className="w-full md:w-72 bg-luxury-dark text-white p-6 flex flex-col border-r border-white/5 shadow-2xl shrink-0">
                    <div className="mb-8 text-center">
                        <img src={logo} alt="Resort Logo" className="w-16 mx-auto mb-4"/>
                        <h2 className="text-lg font-serif text-luxury-gold tracking-[0.2em] uppercase">Reservation</h2>
                        <p className="text-[8px] text-white/40 uppercase tracking-[0.3em] mt-1 italic">Read-Only Mode</p>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                            <p className="text-white/40 uppercase text-[8px] tracking-widest font-bold mb-1">Confirmation</p>
                            <p className="font-mono text-base text-luxury-gold tracking-tighter">{selectedEvent.reservationNumber}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white/5 p-2 rounded-sm border border-white/10 text-center">
                                <p className="text-white/40 uppercase text-[8px] tracking-widest font-bold mb-1">Booking</p>
                                <span className={`text-[9px] font-bold uppercase ${
                                    selectedEvent.status === 'confirmed' ? 'text-green-400' : 
                                    selectedEvent.status === 'cancelled' ? 'text-red-400' : 'text-yellow-400'
                                }`}>
                                    {selectedEvent.status}
                                </span>
                            </div>
                            <div className="bg-white/5 p-2 rounded-sm border border-white/10 text-center">
                                <p className="text-white/40 uppercase text-[8px] tracking-widest font-bold mb-1">Payment</p>
                                <span className={`text-[9px] font-bold uppercase ${
                                    selectedEvent.paymentStatus === 'paid' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {selectedEvent.paymentStatus}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-3">
                            <div className="flex items-center space-x-3">
                                <CalIcon size={12} className="text-luxury-gold"/>
                                <p className="text-xs font-serif">{moment(selectedEvent.checkInDate).format('MMM DD')} - {moment(selectedEvent.checkOutDate).format('MMM DD, YYYY')}</p>
                            </div>
                            <div className="flex items-center space-x-3">

                                <p className="text-lg font-serif text-luxury-gold">LKR {selectedEvent.totalCost}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="flex items-center space-x-2 opacity-30">
                            <AlertCircle size={10} />
                            <p className="text-[8px] uppercase font-bold tracking-widest leading-none">Administrative control restricted</p>
                        </div>
                    </div>
                </div>

                {/* Right Detailed Area */}
                <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-luxury-charcoal">
                    <div className="px-8 py-4 flex justify-between items-center bg-luxury-cream/10 dark:bg-black/10 border-b border-black/5 dark:border-white/5">
                        <h3 className="text-base font-serif tracking-widest uppercase text-luxury-charcoal dark:text-white">Dossier Details</h3>
                        <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all text-luxury-charcoal/30 dark:text-white/20"><X size={18}/></button>
                    </div>

                    <div className="flex-1 overflow-hidden p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Guest Details */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2 text-luxury-gold">
                                    <Users size={14}/>
                                    <h4 className="text-[9px] font-bold uppercase tracking-[0.2em]">Guest Profile</h4>
                                </div>
                                {guestDetails ? (
                                    <div className="bg-luxury-cream/20 dark:bg-black/20 p-4 rounded-sm border border-black/5 dark:border-white/5 text-[11px]">
                                        <p className="font-serif text-base text-luxury-charcoal dark:text-white mb-2">{guestDetails.name}</p>
                                        <div className="space-y-1 text-black/60 dark:text-white/60">
                                            <p><span className="text-[8px] uppercase tracking-tighter opacity-50 mr-2">Contact:</span> {guestDetails.contactNumber}</p>
                                            <p><span className="text-[8px] uppercase tracking-tighter opacity-50 mr-2">NIC:</span> {guestDetails.nicNumber || 'N/A'}</p>
                                            <p className="truncate"><span className="text-[8px] uppercase tracking-tighter opacity-50 mr-2">Address:</span> {guestDetails.address || 'N/A'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-24 bg-black/5 animate-pulse rounded-sm"></div>
                                )}
                            </div>

                            {/* Suite Details */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2 text-luxury-gold">
                                    <Hotel size={14}/>
                                    <h4 className="text-[9px] font-bold uppercase tracking-[0.2em]">Suite Allocation</h4>
                                </div>
                                {roomDetails ? (
                                    <div className="bg-luxury-cream/20 dark:bg-black/20 p-4 rounded-sm border border-black/5 dark:border-white/5 text-[11px]">
                                        <p className="font-serif text-2xl text-luxury-gold mb-1">#{roomDetails.roomNumber}</p>
                                        <div className="space-y-1 text-black/60 dark:text-white/60">
                                            <p className="font-bold uppercase text-[9px]">{roomDetails.bedType}</p>
                                            <div className="flex justify-between">
                                                <span>{roomDetails.ac ? 'AC' : 'Non-AC'}</span>
                                                <span className="opacity-50">LKR {roomDetails.ratePerNight}/Night</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-24 bg-black/5 animate-pulse rounded-sm"></div>
                                )}
                            </div>
                        </div>

                        {/* System Info / Metadata Section */}
                        <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                            <div className="flex items-center space-x-2 text-luxury-gold">
                                <Info size={14}/>
                                <h4 className="text-[9px] font-bold uppercase tracking-[0.2em]">Intelligence & Records</h4>
                            </div>
                            <div className="p-3 bg-luxury-cream/10 dark:bg-white/5 rounded-sm border border-black/5 dark:border-white/5">
                                <div className="space-y-1.5 text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="opacity-40 uppercase text-[8px]">Created At</span>
                                        <span className="text-luxury-charcoal dark:text-white font-mono">{moment(selectedEvent.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-40 uppercase text-[8px]">Last System Update</span>
                                        <span className="text-luxury-charcoal dark:text-white font-mono">{moment(selectedEvent.updatedAt).format('YYYY-MM-DD HH:mm')}</span>
                                    </div>
                                    <div className="pt-2 mt-1 border-t border-black/5 dark:border-white/5">
                                        <p className="text-[8px] uppercase tracking-tighter opacity-40 mb-1">Operational Notes</p>
                                        <p className="text-luxury-charcoal/80 dark:text-white/80 italic leading-relaxed text-[10px]">{selectedEvent.notes || "Standard Booking - No specific preparation instructions logged."}</p>
                                    </div>
                                </div>
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
