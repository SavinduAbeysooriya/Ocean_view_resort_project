import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, Wind, Users, Bed, Calendar, Filter, X, 
  ChevronRight, Star, ArrowRight, Grid, List 
} from 'lucide-react';

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [filters, setFilters] = useState({
    ac: null,
    minCapacity: '',
    maxCapacity: '',
    bedType: '',
    minPrice: '',
    maxPrice: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const API_URL = 'http://localhost:8080/api';
  const BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rooms, selectedCategory, searchTerm, checkInDate, checkOutDate, filters]);

  const fetchData = async () => {
    try {
      console.log('Fetching rooms and categories...');
      
      // Get token if user is logged in (optional for public viewing)
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const [roomsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/rooms`, { headers }),
        axios.get(`${API_URL}/room-categories`, { headers })
      ]);
      
      console.log('Rooms fetched:', roomsRes.data.length);
      console.log('Categories fetched:', categoriesRes.data.length);
      
      // Only show available rooms
      const availableRooms = roomsRes.data.filter(room => room.status === 'available');
      console.log('Available rooms:', availableRooms.length);
      
      setRooms(availableRooms);
      setCategories(categoriesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 403) {
        alert('Authentication required. The rooms endpoint needs to be made public or you need to log in.');
      } else {
        alert(`Error loading rooms: ${error.message}. Please check if the backend is running.`);
      }
      setLoading(false);
    }
  };

  const checkAvailability = async (roomId) => {
    if (!checkInDate || !checkOutDate) return true;
    
    try {
      const response = await axios.post(`${API_URL}/reservations/check-availability`, {
        roomId,
        checkInDate,
        checkOutDate
      });
      return response.data.available;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  const applyFilters = async () => {
    let filtered = [...rooms];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(room => room.roomCategoryId === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(room => 
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.amenities?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date availability filter
    if (checkInDate && checkOutDate) {
      const availabilityChecks = await Promise.all(
        filtered.map(room => checkAvailability(room.id))
      );
      filtered = filtered.filter((_, index) => availabilityChecks[index]);
    }

    // AC filter
    if (filters.ac !== null) {
      filtered = filtered.filter(room => room.ac === filters.ac);
    }

    // Capacity filter
    if (filters.minCapacity) {
      filtered = filtered.filter(room => room.capacity >= parseInt(filters.minCapacity));
    }
    if (filters.maxCapacity) {
      filtered = filtered.filter(room => room.capacity <= parseInt(filters.maxCapacity));
    }

    // Bed type filter
    if (filters.bedType) {
      filtered = filtered.filter(room => 
        room.bedType?.toLowerCase().includes(filters.bedType.toLowerCase())
      );
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(room => room.ratePerNight >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(room => room.ratePerNight <= parseFloat(filters.maxPrice));
    }

    setFilteredRooms(filtered);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.category : 'Unknown';
  };

  const getCategoryImage = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.categoryImage ? `${BASE_URL}${category.categoryImage}` : null;
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setCheckInDate('');
    setCheckOutDate('');
    setFilters({
      ac: null,
      minCapacity: '',
      maxCapacity: '',
      bedType: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  return (
    <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-500">
      {/* Header */}
      <div className="bg-luxury-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 text-xs uppercase tracking-[0.3em] text-luxury-gold mb-4">
              <span className="w-12 h-[1px] bg-luxury-gold/30"></span>
              <span>Luxury Accommodations</span>
              <span className="w-12 h-[1px] bg-luxury-gold/30"></span>
            </div>
            <h1 className="text-6xl font-serif mb-6">Our Rooms & Suites</h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Discover your perfect sanctuary overlooking the ocean
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search & Date Filter Bar */}
      <div className="bg-white dark:bg-luxury-charcoal shadow-xl -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={20} />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-black/10 dark:border-white/10 rounded-sm focus:border-luxury-gold outline-none bg-transparent text-luxury-charcoal dark:text-white"
              />
            </div>

            {/* Check-in Date */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={20} />
              <input
                type="date"
                value={checkInDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-black/10 dark:border-white/10 rounded-sm focus:border-luxury-gold outline-none bg-transparent text-luxury-charcoal dark:text-white"
              />
            </div>

            {/* Check-out Date */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={20} />
              <input
                type="date"
                value={checkOutDate}
                min={checkInDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-black/10 dark:border-white/10 rounded-sm focus:border-luxury-gold outline-none bg-transparent text-luxury-charcoal dark:text-white"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 bg-luxury-gold hover:bg-luxury-gold/90 text-white py-3 rounded-sm transition-all"
            >
              <Filter size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-4 border-t border-black/10 dark:border-white/10">
                  {/* AC Filter */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 mb-2">
                      Air Conditioning
                    </label>
                    <select
                      value={filters.ac === null ? '' : filters.ac.toString()}
                      onChange={(e) => setFilters({...filters, ac: e.target.value === '' ? null : e.target.value === 'true'})}
                      className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-sm bg-transparent text-luxury-charcoal dark:text-white"
                    >
                      <option value="">Any</option>
                      <option value="true">With AC</option>
                      <option value="false">Without AC</option>
                    </select>
                  </div>

                  {/* Capacity */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 mb-2">
                      Capacity
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minCapacity}
                        onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
                        className="w-1/2 px-4 py-2 border border-black/10 dark:border-white/10 rounded-sm bg-transparent text-luxury-charcoal dark:text-white"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxCapacity}
                        onChange={(e) => setFilters({...filters, maxCapacity: e.target.value})}
                        className="w-1/2 px-4 py-2 border border-black/10 dark:border-white/10 rounded-sm bg-transparent text-luxury-charcoal dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 mb-2">
                      Price Per Night ($)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                        className="w-1/2 px-4 py-2 border border-black/10 dark:border-white/10 rounded-sm bg-transparent text-luxury-charcoal dark:text-white"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                        className="w-1/2 px-4 py-2 border border-black/10 dark:border-white/10 rounded-sm bg-transparent text-luxury-charcoal dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Bed Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60 mb-2">
                      Bed Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., King, Queen..."
                      value={filters.bedType}
                      onChange={(e) => setFilters({...filters, bedType: e.target.value})}
                      className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-sm bg-transparent text-luxury-charcoal dark:text-white"
                    />
                  </div>

                  {/* Reset Button */}
                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      className="w-full px-4 py-2 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white rounded-sm transition-all"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-luxury-charcoal p-6 rounded-sm shadow-xl sticky top-6">
              <h3 className="text-xl font-serif mb-6 text-luxury-charcoal dark:text-white">Categories</h3>
              
              <div className="space-y-3">
                {/* All Rooms */}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-4 rounded-sm transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-luxury-gold text-white'
                      : 'hover:bg-luxury-gold/10 text-luxury-charcoal dark:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm uppercase tracking-widest">All Rooms</span>
                    <ChevronRight size={16} />
                  </div>
                </button>

                {/* Category with Images */}
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id.toString())}
                    className={`w-full text-left rounded-sm overflow-hidden transition-all ${
                      selectedCategory === category.id.toString()
                        ? 'ring-2 ring-luxury-gold'
                        : 'hover:ring-2 hover:ring-luxury-gold/50'
                    }`}
                  >
                    <div className="relative h-32">
                      {category.categoryImage ? (
                        <img
                          src={`${BASE_URL}${category.categoryImage}`}
                          alt={category.category}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-luxury-dark/10 flex items-center justify-center">
                          <Bed className="text-luxury-gold" size={32} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="font-bold text-xs uppercase tracking-widest text-white">
                          {category.category}
                        </p>
                        <p className="text-xs text-white/60 line-clamp-1">{category.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-serif text-luxury-charcoal dark:text-white">
                  {filteredRooms.length} {filteredRooms.length === 1 ? 'Room' : 'Rooms'} Available
                </h2>
                {checkInDate && checkOutDate && (
                  <p className="text-sm text-luxury-charcoal/60 dark:text-white/60 mt-1">
                    {calculateNights()} night{calculateNights() !== 1 ? 's' : ''} • {checkInDate} to {checkOutDate}
                  </p>
                )}
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-luxury-gold text-white' : 'bg-luxury-dark/10 text-luxury-charcoal dark:text-white'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-luxury-gold text-white' : 'bg-luxury-dark/10 text-luxury-charcoal dark:text-white'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-gold"></div>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-20">
                <Bed className="mx-auto text-luxury-gold/20 mb-6" size={64} />
                {rooms.length === 0 ? (
                  <>
                    <p className="text-luxury-charcoal/60 dark:text-white/60 text-xl mb-2">
                      No rooms available yet
                    </p>
                    <p className="text-luxury-charcoal/40 dark:text-white/40 text-sm">
                      Please add rooms via the Admin Panel to display them here.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-luxury-charcoal/60 dark:text-white/60 text-lg">
                      No rooms found matching your criteria
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-4 px-6 py-2 bg-luxury-gold text-white rounded-sm hover:bg-luxury-gold/90 transition-all"
                    >
                      Reset Filters
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-6'}>
                {filteredRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-luxury-charcoal rounded-sm overflow-hidden shadow-xl hover:shadow-2xl transition-all group"
                  >
                    {/* Room Image */}
                    <div className="relative h-64 overflow-hidden">
                      {room.image1 ? (
                        <img
                          src={`${BASE_URL}${room.image1}`}
                          alt={`Room ${room.roomNumber}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : getCategoryImage(room.roomCategoryId) ? (
                        <img
                          src={getCategoryImage(room.roomCategoryId)}
                          alt={getCategoryName(room.roomCategoryId)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-luxury-dark/10 flex items-center justify-center">
                          <Bed className="text-luxury-gold" size={48} />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-luxury-gold text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                        {getCategoryName(room.roomCategoryId)}
                      </div>
                    </div>

                    {/* Room Info */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-serif text-luxury-charcoal dark:text-white mb-1">
                            Room {room.roomNumber}
                          </h3>
                          <p className="text-sm text-luxury-gold uppercase tracking-widest font-bold">
                            {room.bedType || 'Standard Bed'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-serif text-luxury-gold">${room.ratePerNight}</p>
                          <p className="text-xs text-luxury-charcoal/60 dark:text-white/60">per night</p>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-black/10 dark:border-white/10">
                        <div className="flex items-center space-x-2 text-luxury-charcoal/60 dark:text-white/60">
                          <Users size={16} />
                          <span className="text-xs">{room.capacity} Guests</span>
                        </div>
                        <div className="flex items-center space-x-2 text-luxury-charcoal/60 dark:text-white/60">
                          <Bed size={16} />
                          <span className="text-xs">{room.bedType || 'Bed'}</span>
                        </div>
                        {room.ac && (
                          <div className="flex items-center space-x-2 text-luxury-charcoal/60 dark:text-white/60">
                            <Wind size={16} />
                            <span className="text-xs">AC</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/rooms/${room.id}`)}
                          className="flex-1 py-3 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white rounded-sm transition-all flex items-center justify-center space-x-2"
                        >
                          <span className="text-xs font-bold uppercase tracking-widest">View Details</span>
                          <ArrowRight size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/rooms/${room.id}?book=true`)}
                          className="flex-1 py-3 bg-luxury-gold text-white hover:bg-luxury-gold/90 rounded-sm transition-all flex items-center justify-center space-x-2"
                        >
                          <span className="text-xs font-bold uppercase tracking-widest">Book Now</span>
                          <Calendar size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
