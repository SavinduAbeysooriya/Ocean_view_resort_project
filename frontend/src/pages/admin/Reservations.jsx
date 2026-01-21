import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../../utils/AuthContext';
import logo from '../../assets/logo.png';
import { 
  Check, X, Trash2, Mail, CreditCard, Printer, Calendar as CalIcon,
  LogOut, LayoutDashboard, Users, Hotel, Settings, UserCheck, Bell, DollarSign,
  Send, Download, Info
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
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
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [guestDetails, setGuestDetails] = useState(null);
    const [roomDetails, setRoomDetails] = useState(null);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');

    const API_URL = 'http://localhost:8080/api/reservations';
    const PAYMENT_API_URL = 'http://localhost:8080/api/payments';
    const INVOICE_API_URL = 'http://localhost:8080/api/invoices';

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
            issueDate: new Date().toISOString(),
            dueDate: new Date().toISOString(),
            subtotal: selectedReservation.totalCost,
            taxAmount: selectedReservation.totalCost * 0.1,
            amount: selectedReservation.totalCost * 1.1,
            status: 'paid',
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
                             <img src={logo} alt="Resort Logo" className="w-20 mx-auto mb-4"/>
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
                                    <td className="text-right py-4 font-mono">LKR {roomDetails?.ratePerNight || (selectedReservation.totalCost / Math.ceil((new Date(selectedReservation.checkOutDate) - new Date(selectedReservation.checkInDate))/(1000 * 60 * 60 * 24))).toFixed(2)}</td>
                                    <td className="text-right py-4 font-mono">{Math.ceil((new Date(selectedReservation.checkOutDate) - new Date(selectedReservation.checkInDate))/(1000 * 60 * 60 * 24))} Nights</td>
                                    <td className="text-right py-4 font-mono">LKR {selectedReservation.totalCost}</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                   <td className="py-4 font-bold text-sm">Service Tax (10%)</td>
                                   <td className="text-right py-4 font-mono">-</td>
                                   <td className="text-right py-4 font-mono">-</td>
                                   <td className="text-right py-4 font-mono">LKR {(selectedReservation.totalCost * 0.10).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="flex justify-end mb-12">
                            <div className="w-1/2">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-xs uppercase tracking-widest">Subtotal</span>
                                    <span className="font-mono">LKR {selectedReservation.totalCost}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-black">
                                    <span className="text-xs uppercase tracking-widest font-bold">Total Due</span>
                                    <span className="font-mono font-bold text-xl">LKR {(selectedReservation.totalCost * 1.10).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between py-2 mt-2">
                                    <span className="text-xs uppercase tracking-widest text-gray-500">Payment ({paymentMethod})</span>
                                    <span className="font-mono text-green-600">-LKR {(selectedReservation.totalCost * 1.10).toFixed(2)}</span>
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
          <AdminSidebar activePage="dashboard" />

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12 min-h-screen">
                <AdminHeader 
                    subtitle="Central Booking System"
                    title="Reservation Control"
                    description={`Synchronized at: ${new Date().toLocaleTimeString()}`}
                />

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
                        date={date}
                        view={view}
                        onNavigate={(newDate) => setDate(newDate)}
                        onView={(newView) => setView(newView)}
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
                            className="bg-white dark:bg-luxury-charcoal w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row border border-luxury-gold/20"
                        >
                             {/* Left Navigation/Summary Sidebar */}
                             <div className="w-full md:w-72 bg-luxury-dark text-white p-6 flex flex-col border-r border-white/5 shadow-2xl shrink-0">
                                <div className="mb-8 text-center">
                                    <img src={logo} alt="Resort Logo" className="w-20 mx-auto mb-4 hover:scale-105 transition-transform duration-300"/>
                                    <h2 className="text-lg font-serif text-luxury-gold tracking-[0.2em] uppercase">Reservation</h2>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="bg-white/5 p-3 rounded-sm border border-white/10">
                                        <p className="text-white/40 uppercase text-[8px] tracking-widest font-bold mb-1">Confirmation</p>
                                        <p className="font-mono text-base text-luxury-gold tracking-tighter">{selectedReservation.reservationNumber}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-white/5 p-2 rounded-sm border border-white/10 text-center">
                                            <p className="text-white/40 uppercase text-[8px] tracking-widest font-bold mb-1">Booking</p>
                                            <span className={`text-[9px] font-bold uppercase ${
                                                selectedReservation.status === 'confirmed' ? 'text-green-400' : 
                                                selectedReservation.status === 'cancelled' ? 'text-red-400' : 'text-yellow-400'
                                            }`}>
                                                {selectedReservation.status}
                                            </span>
                                        </div>
                                        <div className="bg-white/5 p-2 rounded-sm border border-white/10 text-center">
                                            <p className="text-white/40 uppercase text-[8px] tracking-widest font-bold mb-1">Payment</p>
                                            <span className={`text-[9px] font-bold uppercase ${
                                                selectedReservation.paymentStatus === 'paid' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {selectedReservation.paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <CalIcon size={12} className="text-luxury-gold"/>
                                            <p className="text-xs font-serif">{moment(selectedReservation.checkInDate).format('MMM DD')} - {moment(selectedReservation.checkOutDate).format('MMM DD, YYYY')}</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                           
                                            <p className="text-lg font-serif text-luxury-gold">LKR {selectedReservation.totalCost}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">Terminal Actions</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedReservation.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleStatusUpdate('confirmed')} className="flex items-center justify-center space-x-2 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white py-2 rounded-sm transition-all border border-green-600/30 text-[9px] font-bold uppercase">
                                                    <Check size={12}/> <span>Approve</span>
                                                </button>
                                                <button onClick={() => handleStatusUpdate('cancelled')} className="flex items-center justify-center space-x-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-2 rounded-sm transition-all border border-red-600/30 text-[9px] font-bold uppercase">
                                                    <X size={12}/> <span>Reject</span>
                                                </button>
                                            </>
                                        )}
                                        <button onClick={handleDelete} className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-red-600 text-white/60 hover:text-white py-2 rounded-sm transition-all border border-white/10 text-[9px] font-bold uppercase">
                                            <Trash2 size={12}/> <span>Delete</span>
                                        </button>
                                     
                                    </div>
                                </div>
                             </div>

                             {/* Right Detailed Content Area */}
                             <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-luxury-charcoal">
                                <div className="px-8 py-4 flex justify-between items-center bg-luxury-cream/10 dark:bg-black/10 border-b border-black/5 dark:border-white/5">
                                    <h3 className="text-base font-serif tracking-widest uppercase text-luxury-charcoal dark:text-white">Dossier Details</h3>
                                    <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all text-luxury-charcoal/30 dark:text-white/20"><X size={18}/></button>
                                </div>

                                <div className="flex-1 overflow-hidden p-6 space-y-6">
                                    {/* Group: Primary Entities in one row */}
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Guest Card */}
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

                                        {/* Suite Card */}
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

                                    {/* Group: Transactions */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
                                            <div className="flex items-center space-x-2 text-luxury-gold">
                                                <CreditCard size={14}/>
                                                <h4 className="text-[9px] font-bold uppercase tracking-[0.2em]">Financial Ledger</h4>
                                            </div>
                                            <div className="flex space-x-2">
                                                {selectedReservation.paymentStatus !== 'paid' && (
                                                    <button onClick={() => setIsPaymentModalOpen(true)} className="bg-luxury-gold hover:bg-luxury-gold/90 text-white text-[8px] font-bold uppercase px-3 py-1.5 rounded-sm transition-all transform hover:-translate-y-0.5">
                                                        Record Payment
                                                    </button>
                                                )}
                                                {!invoice ? (
                                                    <button 
                                                        onClick={handleGenerateInvoice} 
                                                        disabled={selectedReservation.paymentStatus !== 'paid' && paymentDetails.length === 0}
                                                        className={`border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white text-[8px] font-bold uppercase px-3 py-1.5 rounded-sm transition-all ${ (selectedReservation.paymentStatus !== 'paid' && paymentDetails.length === 0) ? 'opacity-30' : ''}`}
                                                    >
                                                        Generate Invoice
                                                    </button>
                                                ) : (
                                                    <div className="flex space-x-1">
                                                        <button onClick={handlePrintInvoice} className="bg-luxury-charcoal dark:bg-white text-white dark:text-luxury-charcoal text-[8px] font-bold uppercase px-3 py-1.5 rounded-sm transition-all">
                                                            Receipt
                                                        </button>
                                                        <button onClick={handleSendInvoice} className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-[8px] font-bold uppercase px-3 py-1.5 rounded-sm transition-all">
                                                            Mail Invoice to Guest
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                            {paymentDetails.length > 0 ? (
                                                <div className="space-y-2">
                                                    {paymentDetails.map(pay => (
                                                        <div key={pay.id} className="bg-white dark:bg-black/10 p-2.5 rounded-sm border border-black/5 dark:border-white/5 flex justify-between items-center">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"><Check size={10}/></div>
                                                                <div>
                                                                    <p className="text-[9px] font-bold uppercase">{pay.paymentMethod}</p>
                                                                    <p className="text-[8px] opacity-40 font-mono">{moment(pay.transactionDate).format('YYYY-MM-DD HH:mm')}</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-[11px] font-bold text-green-500 font-mono">LKR {pay.amount.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-luxury-cream/10 dark:bg-white/5 rounded-sm border border-black/5 dark:border-white/5">
                                                     <div className="flex items-center space-x-2 text-luxury-gold mb-2">
                                                         <Info size={12}/>
                                                         <h4 className="text-[8px] font-bold uppercase tracking-widest">System Intelligence</h4>
                                                     </div>
                                                     <div className="space-y-1.5 text-[10px]">
                                                         <div className="flex justify-between">
                                                             <span className="opacity-40 uppercase text-[8px]">Created At</span>
                                                             <span className="text-luxury-charcoal dark:text-white font-mono">{moment(selectedReservation.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                                                         </div>
                                                         <div className="flex justify-between">
                                                             <span className="opacity-40 uppercase text-[8px]">Last Update</span>
                                                             <span className="text-luxury-charcoal dark:text-white font-mono">{moment(selectedReservation.updatedAt).format('YYYY-MM-DD HH:mm')}</span>
                                                         </div>
                                                         <div className="pt-2 mt-1 border-t border-black/5 dark:border-white/5">
                                                             <p className="text-[8px] uppercase tracking-tighter opacity-40 mb-1">Dossier Notes</p>
                                                             <p className="text-luxury-charcoal/80 dark:text-white/80 italic leading-relaxed text-[10px]">{selectedReservation.notes || "Standard Booking - No specific preferences noted."}</p>
                                                         </div>
                                                     </div>
                                                 </div>
                                            )}
                                        </div>
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
