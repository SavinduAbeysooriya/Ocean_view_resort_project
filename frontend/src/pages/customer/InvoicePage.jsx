import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Printer, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../utils/AuthContext';

const InvoicePage = () => {
    const { reservationId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [invoice, setInvoice] = useState(null);
    const [reservation, setReservation] = useState(null);
    const [guest, setGuest] = useState(null);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [reservationId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // 1. Fetch Invoice
            const invoiceRes = await axios.get(`http://localhost:8080/api/invoices/reservation/${reservationId}`);
            setInvoice(invoiceRes.data);

            // 2. Fetch Reservation
            const resRes = await axios.get(`http://localhost:8080/api/reservations/${reservationId}`, { headers });
            setReservation(resRes.data);

            // 3. Fetch Guest (linked to reservation)
            if (resRes.data.guestId) {
                const guestRes = await axios.get(`http://localhost:8080/api/guests/${resRes.data.guestId}`, { headers });
                setGuest(guestRes.data);
            }

            // 4. Fetch Room
            if (resRes.data.roomId) {
                const roomRes = await axios.get(`http://localhost:8080/api/rooms/${resRes.data.roomId}`);
                setRoom(roomRes.data);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error fetching invoice data:", err);
            setError("Failed to load invoice details. Please try again later.");
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-luxury-cream dark:bg-luxury-dark">
                <div className="w-12 h-12 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !invoice || !reservation) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-luxury-cream dark:bg-luxury-dark p-6 text-center">
                <div className="text-red-500 mb-4 text-6xl">!</div>
                <h1 className="text-2xl font-serif text-charcoal dark:text-white mb-2">Invoice Not Found</h1>
                <p className="text-gray-500 mb-6">{error || "The requested invoice could not be located."}</p>
                <button 
                    onClick={() => navigate('/profile')}
                    className="px-8 py-3 bg-luxury-gold text-white uppercase tracking-widest text-sm font-bold rounded-sm"
                >
                    Back to Profile
                </button>
            </div>
        );
    }

    const nights = Math.ceil((new Date(reservation.checkOutDate) - new Date(reservation.checkInDate)) / (1000 * 60 * 60 * 24));

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-luxury-dark py-20 px-4 flex flex-col items-center">
            {/* Action Bar (Hidden when printing) */}
            <div className="max-w-4xl w-full mb-8 flex items-center justify-between no-print">
                <button 
                    onClick={() => navigate('/profile')}
                    className="flex items-center space-x-2 text-luxury-charcoal dark:text-white/60 hover:text-luxury-gold transition-colors text-sm uppercase tracking-widest font-bold"
                >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
                <div className="flex space-x-4">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-luxury-charcoal border border-black/10 dark:border-white/10 text-luxury-charcoal dark:text-white font-bold uppercase tracking-widest text-xs hover:shadow-lg transition-all"
                    >
                        <Printer size={18} />
                        <span>Print Invoice</span>
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="flex items-center space-x-2 px-6 py-3 bg-luxury-gold text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-yellow-600 transition-all"
                    >
                        <Download size={18} />
                        <span>Download PDF</span>
                    </button>
                </div>
            </div>

            {/* A4 Invoice Sheet */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                id="printable-invoice"
                className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] p-[20mm] shadow-2xl relative overflow-hidden"
            >
                {/* Watermark/Luxury Frame */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 rounded-full -mr-32 -mt-32"></div>
                
                {/* Header */}
                <div className="flex justify-between items-start mb-16 relative z-10">
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 border-2 border-black flex items-center justify-center transform rotate-45">
                                <span className="transform -rotate-45 font-serif font-bold text-2xl">O</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl font-serif font-bold uppercase tracking-widest leading-none">Ocean View</h1>
                                <span className="text-[10px] tracking-[0.4em] uppercase text-gray-500">Luxury Resort</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>Galle Road, Balapitiya</p>
                            <p>Sri Lanka, 80550</p>
                            <p>+94 112 345 678</p>
                            <p>contact@oceanviewresort.com</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-serif uppercase tracking-[0.2em] text-gray-200 mb-4 leading-none">Invoice</h2>
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Invoice Number</p>
                            <p className="font-mono text-lg">{invoice.invoiceNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-12 mb-16">
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold mb-4 border-b border-gray-100 pb-2">Guest Details</h3>
                        <p className="font-bold text-lg mb-1">{guest?.name || user?.username}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>{guest?.address}</p>
                            <p>{guest?.contactNumber}</p>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold mb-4 border-b border-gray-100 pb-2 text-right">Payment Info</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400">Date Issued</p>
                                <p className="text-sm font-medium">{new Date(invoice.issueDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400">Payment Status</p>
                                <div className="flex items-center justify-end space-x-1 text-green-600 font-bold uppercase text-xs tracking-widest">
                                    <CheckCircle2 size={14} />
                                    <span>{invoice.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <table className="w-full mb-12">
                    <thead>
                        <tr className="border-b-2 border-black text-[10px] uppercase tracking-[0.2em] text-gray-500">
                            <th className="text-left py-4">Item Description</th>
                            <th className="text-right py-4">Rate</th>
                            <th className="text-center py-4">Stay</th>
                            <th className="text-right py-4">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="py-6">
                                <p className="font-bold mb-1">Luxury Stay: {room?.roomNumber ? `Room ${room.roomNumber}` : 'Booking Ref'}</p>
                                <p className="text-xs text-gray-400 italic">
                                    {room?.categoryName || 'Accommodation'} • {room?.bedType || 'Suite'} • 
                                    Check-in: {new Date(reservation.checkInDate).toLocaleDateString()} to {new Date(reservation.checkOutDate).toLocaleDateString()}
                                </p>
                            </td>
                            <td className="py-6 text-right font-mono text-sm">
                                {invoice.currency} {(invoice.amount / (nights || 1)).toFixed(2)}
                            </td>
                            <td className="py-6 text-center text-sm font-medium">
                                {nights} Night{nights > 1 ? 's' : ''}
                            </td>
                            <td className="py-6 text-right font-mono font-bold">
                                {invoice.currency} {invoice.amount.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Summary */}
                <div className="flex justify-end mb-24">
                    <div className="w-full max-w-[250px] space-y-3">
                        <div className="flex justify-between text-sm py-2">
                            <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                            <span className="font-mono">{invoice.currency} {invoice.subtotal?.toFixed(2) || invoice.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm py-2">
                            <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Taxes (SC 10%)</span>
                            <span className="font-mono">{invoice.currency} {invoice.taxAmount?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-t-2 border-black">
                            <span className="uppercase tracking-[0.2em] font-bold">Total Amount</span>
                            <span className="text-2xl font-serif font-bold text-luxury-gold">{invoice.currency} {invoice.amount.toFixed(2)}</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-sm border-l-4 border-green-500 flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount Paid</span>
                            <span className="font-mono font-bold text-green-600">-{invoice.currency} {invoice.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 pt-12 text-center relative z-10">
                    <h4 className="font-serif italic text-lg text-gray-400 mb-4">Thank you for staying with us</h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <p className="text-[8px] font-bold uppercase tracking-widest text-gray-300">Front Desk</p>
                            <p className="text-[10px] font-medium">+94 112 345 678</p>
                        </div>
                        <div className="space-y-1 border-x border-gray-100">
                            <p className="text-[8px] font-bold uppercase tracking-widest text-gray-300">Official Website</p>
                            <p className="text-[10px] font-medium">www.oceanviewresort.com</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-bold uppercase tracking-widest text-gray-300">Email Support</p>
                            <p className="text-[10px] font-medium">reservations@oceanview.com</p>
                        </div>
                    </div>
                    <div className="mt-12 text-[8px] uppercase tracking-[0.5em] text-gray-300">
                        Official Tax Document • Non-Transferable
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-luxury-gold"></div>
                <div className="absolute top-0 left-0 w-1 h-full bg-luxury-gold/20"></div>
            </motion.div>

            {/* Print Styling */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body { background: white !important; padding: 0 !important; margin: 0 !important; }
                    .no-print { display: none !important; }
                    #printable-invoice { 
                        box-shadow: none !important; 
                        max-width: none !important; 
                        width: 100% !important;
                        height: auto !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    @page { margin: 15mm; }
                }
            `}} />
        </div>
    );
};

export default InvoicePage;
