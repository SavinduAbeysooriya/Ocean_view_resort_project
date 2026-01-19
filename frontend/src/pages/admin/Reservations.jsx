import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../../utils/AuthContext';
import { 
  Check, X, Trash2, Mail, CreditCard, Printer, Calendar as CalIcon,
  LogOut, LayoutDashboard, Users, Hotel, Settings, UserCheck, Bell, DollarSign,
  Sun, Moon, Send, Download
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const AdminReservations = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [guestDetails, setGuestDetails] = useState(null);
    const [roomDetails, setRoomDetails] = useState(null);

    const API_URL = 'http://localhost:8080/api/reservations';
    const PAYMENT_API_URL = 'http://localhost:8080/api/payments';
    const INVOICE_API_URL = 'http://localhost:8080/api/invoices';

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

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Raw Reservations Data:", response.data);
            
            const data = response.data.map(res => {
                // Safely parse dates using moment to ensure compatibility with localizer
                const start = moment(res.checkInDate).startOf('day').toDate();
                const end = moment(res.checkOutDate).endOf('day').toDate();
                
                return {
                    id: res.id,
                    title: `${res.reservationNumber} - ${res.status}`,
                    start: start,
                    end: end,
                    allDay: true,
                    resource: res
                };
            });
            
            console.log("Parsed Events:", data);
            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setLoading(false);
        }
    };

    const handleSelectEvent = async (event) => {
        setSelectedReservation(event.resource);
        setPaymentAmount(event.resource.totalCost); 
        await fetchPaymentDetails(event.resource.id);
        await fetchInvoice(event.resource.id);
        // Fetch detailed info for invoice
        if (event.resource.guestId) fetchGuestDetails(event.resource.guestId);
        if (event.resource.roomId) fetchRoomDetails(event.resource.roomId);
        setIsModalOpen(true);
    };

    const fetchGuestDetails = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/guests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGuestDetails(response.data);
        } catch (error) {
            console.error('Error fetching guest:', error);
            setGuestDetails(null);
        }
    };

    const fetchRoomDetails = async (id) => {
        try {
            // Room API might be public or protected, assuming protected
            const token = localStorage.getItem('token'); 
            const response = await axios.get(`http://localhost:8080/api/rooms/${id}`, {
                 headers: { Authorization: `Bearer ${token}` } // Include token just in case
            });
            setRoomDetails(response.data);
        } catch (error) {
            console.error('Error fetching room:', error);
            setRoomDetails(null);
        }
    };

    const fetchPaymentDetails = async (reservationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${PAYMENT_API_URL}/reservation/${reservationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPaymentDetails(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setPaymentDetails([]);
        }
    };

    const fetchInvoice = async (reservationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${INVOICE_API_URL}/reservation/${reservationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInvoice(response.data);
        } catch (error) {
            console.error('Error fetching invoice:', error);
            setInvoice(null);
        }
    };

    const handleStatusUpdate = async (status) => {
        if (!selectedReservation) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/${selectedReservation.id}/status`, 
                { status: status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Reservation ${status} successfully!`);
            fetchReservations();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        }
    };

    const handleDelete = async () => {
        if (!selectedReservation || !window.confirm('Are you sure you want to delete this reservation?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/${selectedReservation.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Reservation deleted successfully!');
            fetchReservations();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error deleting reservation:', error);
            alert('Failed to delete reservation.');
        }
    };

    const handleRecordPayment = async () => {
        if (!selectedReservation) return;

        // Prevent duplicate payments
        const alreadyPaid = paymentDetails.some(p => p.status === 'success');
        if (alreadyPaid) {
            alert("A successful payment has already been recorded for this reservation.");
            return;
        }

        const newPayment = {
            reservationId: selectedReservation.id,
            amount: parseFloat(paymentAmount),
            paymentMethod: paymentMethod, // 'cash' or 'card'
            transactionDate: new Date().toISOString(),
            status: 'success',
            payhereId: `MANUAL-${Date.now()}` // Mock ID for manual entries
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post(PAYMENT_API_URL, newPayment, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Payment recorded successfully!');
            setIsPaymentModalOpen(false);
            fetchPaymentDetails(selectedReservation.id);
        } catch (error) {
            console.error('Error recording payment:', error);
            alert('Failed to record payment.');
        }
    };

    const handleGenerateInvoice = async () => {
        if (!selectedReservation) return;
        const newInvoice = {
            reservationId: selectedReservation.id,
            guestId: selectedReservation.guestId,
            roomId: selectedReservation.roomId,
            issueDate: new Date().toISOString().split('T')[0],
            paymentDeadline: new Date().toISOString().split('T')[0], // Immediate since paid
            subtotal: selectedReservation.totalCost,
            taxAmount: selectedReservation.totalCost * 0.1, 
            status: 'paid', // Generated AFTER payment
            invoiceNumber: `INV-${Date.now()}`
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post(INVOICE_API_URL, newInvoice, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Official Receipt/Invoice generated successfully!');
            fetchInvoice(selectedReservation.id);
        } catch (error) {
            console.error('Error creating invoice:', error);
            alert('Failed to create invoice.');
        }
    };
    
    const handlePrintInvoice = () => {
       window.print();
    };

    const handleSendInvoice = async () => {
        if (!invoice) return;
        try {
            const token = localStorage.getItem('token');
            // Show loading state or toast ideally
            alert('Sending invoice to guest email...');
            await axios.post(`${INVOICE_API_URL}/${invoice.id}/send`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Invoice sent successfully to guest!');
        } catch (error) {
            console.error('Error sending invoice:', error);
            alert('Failed to send invoice. Ensure guest has a valid email account.');
        }
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        let backgroundColor = '#b8860b'; 
        if (event.resource.status === 'confirmed') backgroundColor = '#22c55e';
        if (event.resource.status === 'cancelled') backgroundColor = '#ef4444';
        if (event.resource.status === 'pending') backgroundColor = '#eab308';
        
        return {
            style: {
                backgroundColor,
                borderRadius: '0px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    return (
        <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-500 flex selection:bg-luxury-gold selection:text-white">
            <style>{`
                /* Custom Calendar Overrides for Dark Mode & Styling */
                .rbc-calendar { min-height: 600px; }
                .rbc-header { padding: 10px 0; font-family: serif; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid rgba(255,255,255,0.1); }
                .rbc-month-view { border: 1px solid rgba(0,0,0,0.05); border-radius: 4px; }
                .dark .rbc-month-view { border: 1px solid rgba(255,255,255,0.05); }
                .rbc-day-bg { border-left: 1px solid rgba(0,0,0,0.05); }
                .dark .rbc-day-bg { border-left: 1px solid rgba(255,255,255,0.05); }
                .rbc-off-range-bg { background: rgba(0,0,0,0.02); }
                .dark .rbc-off-range-bg { background: rgba(255,255,255,0.02); }
                .rbc-date-cell { padding: 8px; font-weight: bold; opacity: 0.5; }
                .rbc-event { border-radius: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                
                /* Text Coloring */
                .dark .rbc-toolbar button { color: white; border-color: rgba(255,255,255,0.2); }
                .dark .rbc-toolbar button:hover, .dark .rbc-toolbar button.rbc-active { background: #D4AF37; border-color: #D4AF37; color: white; }
                .dark .rbc-header { color: #D4AF37; }
                .dark .rbc-date-cell { color: white; }
                .dark .rbc-day-slot .rbc-time-slot { border-top: 1px solid rgba(255,255,255,0.05); }
                .dark .rbc-timeslot-group { border-bottom: 1px solid rgba(255,255,255,0.05); }
                .dark .rbc-time-view { border: 1px solid rgba(255,255,255,0.05); }
                .dark .rbc-time-header.rbc-overflowing { border-right: 1px solid rgba(255,255,255,0.05); }
                .dark .rbc-time-header-content { border-left: 1px solid rgba(255,255,255,0.05); }
                .dark .rbc-time-content { border-top: 1px solid rgba(255,255,255,0.05); }
                
                /* Fix height collapse */
                .rbc-row-content { z-index: 2; }

                /* Print Styles */
                @media print {
                    body * { visibility: hidden; }
                    #printable-invoice, #printable-invoice * { visibility: visible; }
                    #printable-invoice { 
                        display: block !important; 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        height: 100%; 
                        background: white; 
                        color: black; 
                        z-index: 9999; 
                        padding: 40px; 
                    }
                    .no-print { display: none !important; }
                }
            `}</style>

            {/* Hidden Printable Invoice Template */}
            <div id="printable-invoice" className="hidden">
                {selectedReservation && (
                    <div className="max-w-3xl mx-auto border border-gray-200 p-12">
                        <div className="text-center mb-12 border-b border-gray-200 pb-8">
                             <div className="w-16 h-16 border-2 border-black mx-auto flex items-center justify-center transform rotate-45 mb-4">
                                <span className="transform -rotate-45 font-serif font-bold text-2xl">O</span>
                            </div>
                            <h1 className="text-3xl font-serif uppercase tracking-widest mb-2">Ocean View Resort</h1>
                            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Official Tax Invoice</p>
                        </div>

                        <div className="flex justify-between mb-12">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Billed To</p>
                                <p className="font-bold text-lg">{guestDetails?.name || 'Guest'}</p>
                                <p className="text-sm text-gray-600">{guestDetails?.address || 'Address on file'}</p>
                                <p className="text-sm text-gray-600">{guestDetails?.contactNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Invoice Details</p>
                                <p className="font-mono text-sm">NO: {invoice?.invoiceNumber || 'PENDING'}</p>
                                <p className="font-mono text-sm">DATE: {new Date().toLocaleDateString()}</p>
                                <p className="font-mono text-sm">STATUS: {invoice?.status?.toUpperCase() || 'DRAFT'}</p>
                            </div>
                        </div>

                        <table className="w-full mb-12">
                            <thead>
                                <tr className="border-b-2 border-black">
                                    <th className="text-left py-3 text-xs uppercase tracking-widest">Description</th>
                                    <th className="text-right py-3 text-xs uppercase tracking-widest">Rate</th>
                                    <th className="text-right py-3 text-xs uppercase tracking-widest">Qty</th>
                                    <th className="text-right py-3 text-xs uppercase tracking-widest">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4">
                                        <p className="font-bold">Room Accommodation</p>
                                        <p className="text-xs text-gray-500">{roomDetails?.roomNumber ? `Room ${roomDetails.roomNumber}` : 'Standard Room'} - {roomDetails?.bedType || 'Acc'} ({new Date(selectedReservation.checkInDate).toLocaleDateString()} to {new Date(selectedReservation.checkOutDate).toLocaleDateString()})</p>
                                    </td>
                                    <td className="text-right py-4 font-mono">${roomDetails?.ratePerNight || (selectedReservation.totalCost / Math.ceil((new Date(selectedReservation.checkOutDate) - new Date(selectedReservation.checkInDate))/(1000 * 60 * 60 * 24))).toFixed(2)}</td>
                                    <td className="text-right py-4 font-mono">{Math.ceil((new Date(selectedReservation.checkOutDate) - new Date(selectedReservation.checkInDate))/(1000 * 60 * 60 * 24))} Nights</td>
                                    <td className="text-right py-4 font-mono">${selectedReservation.totalCost}</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                   <td className="py-4 font-bold text-sm">Service Tax (10%)</td>
                                   <td className="text-right py-4 font-mono">-</td>
                                   <td className="text-right py-4 font-mono">-</td>
                                   <td className="text-right py-4 font-mono">${(selectedReservation.totalCost * 0.10).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="flex justify-end mb-12">
                            <div className="w-1/2">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-xs uppercase tracking-widest">Subtotal</span>
                                    <span className="font-mono">${selectedReservation.totalCost}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-black">
                                    <span className="text-xs uppercase tracking-widest font-bold">Total Due</span>
                                    <span className="font-mono font-bold text-xl">${(selectedReservation.totalCost * 1.10).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between py-2 mt-2">
                                    <span className="text-xs uppercase tracking-widest text-gray-500">Payment ({paymentMethod})</span>
                                    <span className="font-mono text-green-600">-${(selectedReservation.totalCost * 1.10).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center text-xs text-gray-400 uppercase tracking-widest mt-20">
                            <p>Thank you for choosing Ocean View Resort</p>
                            <p>contact@oceanview.com | +94 112 345 678</p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Sidebar */}
            <aside className="w-64 bg-luxury-dark text-white p-8 flex flex-col space-y-10 fixed h-full z-30 shadow-2xl no-print">
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
                        { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
                        { icon: Users, label: 'Guests', path: '#' },
                        { icon: Hotel, label: 'Room Categories', path: '/admin/room-categories' },
                        { icon: Hotel, label: 'Rooms', path: '/admin/rooms' },
                        { icon: CalIcon, label: 'Reservations', path: '/admin/reservations', active: true },
                        { icon: Users, label: 'Staff', path: '/admin/staff' },
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
                            <span>Central Booking System</span>
                        </div>
                        <h1 className="text-5xl font-serif text-luxury-charcoal dark:text-white tracking-tight leading-none mb-4">Reservation Control</h1>
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

                {/* Calendar Container with fixed min-height to prevent collapse */}
                <div className="bg-white dark:bg-luxury-charcoal p-8 rounded-sm shadow-xl h-[70vh] min-h-[600px] border border-black/5 dark:border-white/5 relative z-0">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={eventStyleGetter}
                        className="font-sans text-sm dark:text-white"
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
            </main>

            <AnimatePresence>
                {isModalOpen && selectedReservation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-luxury-charcoal w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row border border-luxury-gold/20"
                        >
                             <div className="w-full md:w-1/3 bg-luxury-dark text-white p-8 border-r border-white/5">
                                <h2 className="text-2xl font-serif mb-6 text-luxury-gold tracking-widest">DETAILS</h2>
                                <div className="space-y-6 text-sm">
                                    <div className="pb-4 border-b border-white/5">
                                        <p className="text-white/40 uppercase text-[10px] tracking-widest font-bold mb-1">Reservation ID</p>
                                        <p className="font-mono text-lg">{selectedReservation.reservationNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 uppercase text-[10px] tracking-widest font-bold mb-1">Duration</p>
                                        <p className="font-serif text-lg">{new Date(selectedReservation.checkInDate).toLocaleDateString()} — {new Date(selectedReservation.checkOutDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 uppercase text-[10px] tracking-widest font-bold mb-1">Financials</p>
                                        <p className="text-2xl font-serif text-luxury-gold">${selectedReservation.totalCost}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 uppercase text-[10px] tracking-widest font-bold mb-2">Current Status</p>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                            selectedReservation.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                            selectedReservation.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                            {selectedReservation.status}
                                        </span>
                                    </div>
                                </div>
                             </div>

                             <div className="flex-1 p-10 bg-luxury-cream/20 dark:bg-white/5">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-luxury-charcoal dark:text-white">Management Console</h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-luxury-charcoal/40 dark:text-white/40 hover:text-red-500 transition-colors"><X size={24}/></button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-12">
                                    <button onClick={() => handleStatusUpdate('confirmed')} className="flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white py-4 rounded-sm transition-all shadow-lg hover:shadow-green-500/20 text-[10px] font-bold uppercase tracking-[0.2em]">
                                        <Check size={16}/> <span>Approve</span>
                                    </button>
                                    <button onClick={() => handleStatusUpdate('cancelled')} className="flex items-center justify-center space-x-3 bg-red-500 hover:bg-red-600 text-white py-4 rounded-sm transition-all shadow-lg hover:shadow-red-500/20 text-[10px] font-bold uppercase tracking-[0.2em]">
                                        <X size={16}/> <span>Reject</span>
                                    </button>
                                    <button className="flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-sm transition-all shadow-lg hover:shadow-blue-500/20 text-[10px] font-bold uppercase tracking-[0.2em]">
                                        <Mail size={16}/> <span>Contact</span>
                                    </button>
                                    <button onClick={handleDelete} className="flex items-center justify-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white py-4 rounded-sm transition-all shadow-lg hover:shadow-gray-500/20 text-[10px] font-bold uppercase tracking-[0.2em]">
                                        <Trash2 size={16}/> <span>Delete</span>
                                    </button>
                                </div>

                                <div className="border-t border-black/10 dark:border-white/10 pt-8">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-luxury-charcoal dark:text-white mb-6 flex items-center">
                                        <CreditCard className="mr-3 text-luxury-gold" size={18}/> Financial Overview
                                    </h3>
                                    
                                    {paymentDetails.length > 0 ? (
                                        <div className="space-y-3 mb-6">
                                            {paymentDetails.map(pay => (
                                                <div key={pay.id} className="bg-white dark:bg-white/5 p-4 rounded-sm border border-black/5 dark:border-white/5 flex justify-between items-center transition-all hover:border-luxury-gold/30">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal dark:text-white">{pay.paymentMethod}</p>
                                                        <p className="text-[10px] text-luxury-charcoal/40 dark:text-white/40">{new Date(pay.transactionDate).toLocaleString()}</p>
                                                    </div>
                                                    <span className="font-mono font-bold text-green-500 text-sm">${pay.amount}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 border border-dashed border-black/10 dark:border-white/10 rounded-sm mb-6 text-center">
                                            <p className="text-[10px] uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">No Paid Entries Found</p>
                                        </div>
                                    )}

                                    <div className="flex space-x-2">
                                         <button 
                                            onClick={() => setIsPaymentModalOpen(true)} 
                                            className="flex-1 bg-green-600 text-white hover:bg-green-700 py-3 rounded-sm transition-all text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center shadow-lg hover:shadow-green-500/20"
                                        >
                                            <DollarSign size={16} className="mr-2"/> Pay
                                        </button>
                                        
                                        {!invoice ? (
                                             <button 
                                                onClick={handleGenerateInvoice} 
                                                disabled={paymentDetails.length === 0}
                                                className={`flex-1 border border-luxury-gold py-3 rounded-sm transition-all text-[10px] font-bold uppercase tracking-[0.2em] ${paymentDetails.length === 0 ? 'opacity-50 cursor-not-allowed text-gray-400 border-gray-400' : 'text-luxury-gold hover:bg-luxury-gold hover:text-white cursor-pointer'}`}
                                             >
                                                Generate
                                            </button>
                                        ) : (
                                            <>
                                                <button onClick={handlePrintInvoice} className="flex-1 bg-luxury-charcoal dark:bg-white text-white dark:text-luxury-charcoal hover:opacity-90 py-3 rounded-sm transition-all text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center shadow-xl">
                                                    <Download size={16} className="mr-2"/> Download
                                                </button>
                                                <button onClick={handleSendInvoice} className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-3 rounded-sm transition-all text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center">
                                                    <Send size={16} className="mr-2"/> Send
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                             </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Payment Modal */}
             <AnimatePresence>
                {isPaymentModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                         <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-white dark:bg-luxury-charcoal w-full max-w-sm rounded-sm shadow-2xl p-8 border-t-4 border-luxury-gold"
                        >
                            <h3 className="text-xl font-serif text-center mb-6 text-luxury-charcoal dark:text-white">Record Payment</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-luxury-charcoal/60 dark:text-white/60">Amount</label>
                                    <input 
                                        type="number" 
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        className="w-full bg-transparent border border-black/10 dark:border-white/10 p-3 rounded-sm focus:border-luxury-gold outline-none text-luxury-charcoal dark:text-white font-mono"
                                        placeholder="0.00"
                                    />
                                </div>
                                 <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-luxury-charcoal/60 dark:text-white/60">Method</label>
                                    <select 
                                        value={paymentMethod} 
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full bg-transparent border border-black/10 dark:border-white/10 p-3 rounded-sm focus:border-luxury-gold outline-none text-luxury-charcoal dark:text-white"
                                    >
                                        <option value="cash" className="text-black">Cash</option>
                                        <option value="card" className="text-black">Card</option>
                                        <option value="transfer" className="text-black">Bank Transfer</option>
                                    </select>
                                </div>
                                <button 
                                    onClick={handleRecordPayment}
                                    className="w-full bg-luxury-gold text-white font-bold uppercase tracking-widest text-[10px] py-4 rounded-sm hover:bg-yellow-600 transition-colors shadow-lg mt-4"
                                >
                                    Confirm Transaction
                                </button>
                                <button 
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className="w-full text-luxury-charcoal/40 dark:text-white/40 font-bold uppercase tracking-widest text-[10px] py-2 hover:text-red-500 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminReservations;
