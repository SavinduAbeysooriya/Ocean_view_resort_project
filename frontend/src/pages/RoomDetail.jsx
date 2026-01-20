import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Wind, Users, Bed, Calendar, ArrowLeft, Check, 
  MapPin, Shield, Coffee, Wifi, Tv, Info, AlertCircle
} from 'lucide-react';
import { useAuth } from '../utils/AuthContext';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  
  // Booking form states
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState('');
  const [availability, setAvailability] = useState({ checked: false, available: false, loading: false });
  const [error, setError] = useState('');
  
  const API_URL = 'http://localhost:8080/api';
  const BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    fetchRoomData();
    
    // Predetermine dates if coming from search
    if (searchParams.get('checkIn')) setCheckInDate(searchParams.get('checkIn'));
    if (searchParams.get('checkOut')) setCheckOutDate(searchParams.get('checkOut'));
  }, [id]);

  const fetchRoomData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const roomRes = await axios.get(`${API_URL}/rooms/${id}`, { headers });
      setRoom(roomRes.data);
      
      // Fetch category details separately to not block if it fails
      if (roomRes.data && roomRes.data.roomCategoryId) {
        try {
          const categoryRes = await axios.get(`${API_URL}/room-categories/${roomRes.data.roomCategoryId}`, { headers });
          setCategory(categoryRes.data);
        } catch (catError) {
          console.warn('Error fetching room category:', catError);
          // Don't set global error if only category fails
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching room detail:', error);
      if (error.response?.status === 404) {
        setError('Room not found.');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        setError('You do not have permission to view this room.');
      } else {
        setError('Could not load room details. Please check your connection.');
      }
      setLoading(false);
    }
  };

  const handleCheckAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      setError('Please select both check-in and check-out dates.');
      return;
    }

    setAvailability({ ...availability, loading: true });
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.post(`${API_URL}/reservations/check-availability`, {
        roomId: id,
        checkInDate,
        checkOutDate
      }, { headers });
      setAvailability({ checked: true, available: response.data.available, loading: false });
      if (!response.data.available) {
        setError('Room is not available for the selected dates.');
      } else {
        setError('');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailability({ checked: true, available: false, loading: false });
      setError('Failed to check availability. Please try again.');
    }
  };

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate || !room) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * room.ratePerNight;
  };

  const handleBookNow = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/rooms/${id}` } });
      return;
    }

    if (!availability.available) {
      handleCheckAvailability();
      return;
    }

    try {
      setLoading(true);
      
      // Get auth token
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // 1. Get or create guest profile
      let guestId = '';
      try {
        const guestRes = await axios.get(`${API_URL}/guests/me`, { headers });
        if (guestRes.data && guestRes.data.id) {
          guestId = guestRes.data.id;
        } else {
          // Create a basic guest profile if it doesn't exist
          const newGuestRes = await axios.post(`${API_URL}/guests/me`, {
            name: user.username,
            userId: user.id
          }, { headers });
          guestId = newGuestRes.data.id;
        }
      } catch (err) {
        console.error('Error fetching/creating guest:', err);
        throw new Error('Failed to identify guest profile.');
      }

      // 2. Create reservation
      const reservationData = {
        guestId: guestId,
        roomId: id,
        checkInDate,
        checkOutDate,
        totalNights: Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)),
        totalCost: calculateTotal(),
        notes,
        status: 'pending',
        paymentStatus: 'unpaid'
      };

      await axios.post(`${API_URL}/reservations`, reservationData, { headers });
      navigate('/profile', { state: { message: 'Reservation created successfully! Please proceed with payment.' } });
    } catch (error) {
      console.error('Error creating reservation:', error);
      setError(error.message || 'Failed to create reservation. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-luxury-cream dark:bg-luxury-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-gold"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-luxury-cream dark:bg-luxury-dark text-luxury-charcoal dark:text-white p-6">
        <AlertCircle size={48} className="text-luxury-gold mb-4" />
        <h2 className="text-2xl font-serif">Room Not Found</h2>
        <button onClick={() => navigate('/rooms')} className="mt-4 text-luxury-gold hover:underline">
          Back to Rooms
        </button>
      </div>
    );
  }

  const images = [room.image1, room.image2, room.image3].filter(img => img);
  const amenities = room.amenities ? room.amenities.split(',').map(a => a.trim()) : [];

  return (
    <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-500 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate('/rooms')}
          className="flex items-center space-x-2 text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-gold transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Rooms</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Image Gallery and Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Gallery */}
            <section>
              <div className="relative h-[500px] mb-4 group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={`${BASE_URL}${images[activeImage]}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover rounded-sm shadow-2xl"
                    alt={room.roomNumber}
                  />
                </AnimatePresence>
                
                {images.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 p-2 bg-black/20 backdrop-blur-md rounded-full">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          activeImage === idx ? 'bg-luxury-gold w-8' : 'bg-white/50 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-24 rounded-sm overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-luxury-gold shadow-lg shadow-luxury-gold/20' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={`${BASE_URL}${img}`} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            </section>

            {/* Room Info */}
            <section className="bg-white dark:bg-luxury-charcoal p-10 rounded-sm shadow-xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center space-x-3 text-xs uppercase tracking-[0.2em] text-luxury-gold mb-2">
                    <span>{category?.category || 'Luxury Room'}</span>
                    <span className="w-8 h-[1px] bg-luxury-gold/30"></span>
                    <span>Room {room.roomNumber}</span>
                  </div>
                  <h1 className="text-5xl font-serif text-luxury-charcoal dark:text-white">
                    {category?.category} Suite
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-serif text-luxury-gold">${room.ratePerNight}</p>
                  <p className="text-sm text-luxury-charcoal/60 dark:text-white/60">per night</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-black/5 dark:border-white/5 mb-8">
                <div className="flex flex-col items-center text-center">
                  <Users className="text-luxury-gold mb-2" size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 mb-1">Capacity</span>
                  <span className="text-sm text-luxury-charcoal dark:text-white">{room.capacity} Guests</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Bed className="text-luxury-gold mb-2" size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 mb-1">Bed Type</span>
                  <span className="text-sm text-luxury-charcoal dark:text-white">{room.bedType || 'Standard'}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Wind className="text-luxury-gold mb-2" size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 mb-1">Air Conditioning</span>
                  <span className="text-sm text-luxury-charcoal dark:text-white">{room.ac ? 'Available' : 'No'}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Info className="text-luxury-gold mb-2" size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 mb-1">Category</span>
                  <span className="text-sm text-luxury-charcoal dark:text-white">{category?.category}</span>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-serif mb-4 text-luxury-charcoal dark:text-white">Description</h3>
                <p className="text-luxury-charcoal/70 dark:text-white/70 leading-relaxed">
                  {category?.description}
                  <br /><br />
                  {room.notes || "Experience the ultimate in luxury and comfort in our meticulously designed rooms. Each space is crafted to provide a serene sanctuary with breathtaking views and premium amenities."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-serif mb-4 text-luxury-charcoal dark:text-white">Room Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                  {amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-luxury-charcoal/70 dark:text-white/70">
                      <div className="w-6 h-6 rounded-full bg-luxury-gold/10 flex items-center justify-center">
                        <Check size={14} className="text-luxury-gold" />
                      </div>
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                  {amenities.length === 0 && (
                    <>
                      <div className="flex items-center space-x-3 text-luxury-charcoal/70 dark:text-white/70">
                        <Wifi size={18} className="text-luxury-gold" />
                        <span className="text-sm">High-speed WiFi</span>
                      </div>
                      <div className="flex items-center space-x-3 text-luxury-charcoal/70 dark:text-white/70">
                        <Tv size={18} className="text-luxury-gold" />
                        <span className="text-sm">Smart TV</span>
                      </div>
                      <div className="flex items-center space-x-3 text-luxury-charcoal/70 dark:text-white/70">
                        <Coffee size={18} className="text-luxury-gold" />
                        <span className="text-sm">Coffee Maker</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-luxury-charcoal p-8 rounded-sm shadow-xl sticky top-24 border border-black/5 dark:border-white/5">
              <h3 className="text-2xl font-serif mb-6 text-luxury-charcoal dark:text-white border-b border-black/5 dark:border-white/5 pb-4">
                Book Your Stay
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 mb-2">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={18} />
                    <input
                      type="date"
                      value={checkInDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setCheckInDate(e.target.value);
                        setAvailability({ ...availability, checked: false });
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-black/10 dark:border-white/10 rounded-sm bg-transparent text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 mb-2">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={18} />
                    <input
                      type="date"
                      value={checkOutDate}
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setCheckOutDate(e.target.value);
                        setAvailability({ ...availability, checked: false });
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-black/10 dark:border-white/10 rounded-sm bg-transparent text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 mb-2">
                    Guests (Capacity: {room.capacity})
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={18} />
                    <input
                      type="number"
                      min="1"
                      max={room.capacity}
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-black/10 dark:border-white/10 rounded-sm bg-transparent text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requirements..."
                    className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-sm bg-transparent text-luxury-charcoal dark:text-white focus:border-luxury-gold outline-none resize-none"
                  ></textarea>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-500 bg-red-500/10 p-4 rounded-sm">
                    <AlertCircle size={18} />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {availability.checked && availability.available && (
                  <div className="flex items-center space-x-2 text-green-500 bg-green-500/10 p-4 rounded-sm">
                    <Check size={18} />
                    <span className="text-sm">Room is available for selected dates!</span>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-luxury-charcoal/60 dark:text-white/60">Rate per night</span>
                    <span className="font-serif text-luxury-charcoal dark:text-white">${room.ratePerNight}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-serif">
                    <span className="text-luxury-charcoal dark:text-white">Total Amount</span>
                    <span className="text-luxury-gold">${calculateTotal()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {!availability.available && (
                    <button
                      onClick={handleCheckAvailability}
                      disabled={availability.loading}
                      className="w-full py-4 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white font-bold uppercase tracking-widest transition-all rounded-sm flex items-center justify-center space-x-2"
                    >
                      {availability.loading ? (
                        <div className="w-5 h-5 border-2 border-t-transparent border-luxury-gold rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Calendar size={18} />
                          <span>Check Availability</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={handleBookNow}
                    disabled={!availability.available || loading}
                    className={`w-full py-4 font-bold uppercase tracking-widest transition-all rounded-sm shadow-lg ${
                      availability.available 
                        ? 'bg-luxury-gold text-white hover:bg-luxury-gold/90 shadow-luxury-gold/20' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-white/10 dark:text-white/30'
                    }`}
                  >
                    {!user ? 'Login to Book' : 'Book Now'}
                  </button>
                </div>

                <div className="flex items-center justify-center space-x-4 text-xs text-luxury-charcoal/40 dark:text-white/40 pt-4">
                  <div className="flex items-center space-x-1">
                    <Shield size={12} />
                    <span>Secure Booking</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin size={12} />
                    <span>Best Price Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
