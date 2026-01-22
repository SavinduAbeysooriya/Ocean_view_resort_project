import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import roomsHeader from '../assets/rooms_header.jpg';
import axios from 'axios';
import { 
  Search, Wind, Users, Bed, Calendar, Filter, X, 
  ChevronRight, Star, ArrowRight, Grid, List 
} from 'lucide-react';
import { cn } from "../utils/cn";


const Rooms = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;

  const API_URL = 'http://localhost:8080/api';
  const BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('category');
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [location.search]);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Reset to first page when filters change
  }, [rooms, selectedCategory, searchTerm, checkInDate, checkOutDate, filters]);

  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      {/* Page Header Component */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10 transition-colors duration-300 dark:bg-black/60"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${roomsHeader})` }}
        ></div>
        <div className="relative z-20 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-luxury-gold tracking-[0.4em] uppercase text-xs font-bold mb-4 block">
              Luxury Accommodations
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white drop-shadow-2xl">
              Our Rooms
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Search & Date Filter Bar */}
      <div className="bg-white dark:bg-luxury-charcoal shadow-xl -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
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
              className={cn(
                "flex items-center justify-center space-x-2 py-3 rounded-sm transition-all border-2",
                showFilters 
                  ? "bg-luxury-gold text-white border-luxury-gold" 
                  : "bg-transparent text-luxury-gold border-luxury-gold hover:bg-luxury-gold hover:text-white"
              )}
            >
              <Filter size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">Filters</span>
            </button>

            {/* Reset Button - Outside */}
            <button
              onClick={resetFilters}
              className="flex items-center justify-center space-x-2 py-3 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white rounded-sm transition-all"
            >
              <X size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">Reset</span>
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
                      value={filters.ac === null ? "" : filters.ac.toString()}
                      onChange={(e) => setFilters({...filters, ac: e.target.value === "" ? null : e.target.value === "true"})}
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
                      Price Per Night (LKR)
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Categories */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-xl font-serif text-charcoal dark:text-white mb-6 flex items-center gap-3">
                  <Grid size={20} className="text-luxury-gold" />
                  Categories
                </h3>
                
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                  {/* All Rooms Card */}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`group relative h-32 lg:h-40 rounded-sm overflow-hidden transition-all duration-500 shadow-lg ${
                      selectedCategory === 'all' ? 'ring-2 ring-luxury-gold' : 'hover:scale-105'
                    }`}
                  >
                    <div className="absolute inset-0 bg-luxury-dark/40 group-hover:bg-luxury-dark/20 transition-all"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <Grid className="text-white mb-2" size={28} />
                        <span className="font-bold text-[10px] items-center uppercase tracking-widest text-white">All Rooms</span>
                    </div>
                  </button>

                  {/* Dynamic Categories */}
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`group relative h-32 lg:h-40 rounded-sm overflow-hidden transition-all duration-500 shadow-lg ${
                        selectedCategory === category.id.toString() ? 'ring-2 ring-luxury-gold' : 'hover:scale-105'
                      }`}
                    >
                      {category.categoryImage ? (
                        <img
                          src={`${BASE_URL}${category.categoryImage}`}
                          alt={category.category}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-luxury-dark/20 flex items-center justify-center">
                          <Bed className="text-luxury-gold/50" size={28} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="font-bold text-[10px] uppercase tracking-widest text-white line-clamp-1">
                          {category.category}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Rooms Grid Section */}
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
              <>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-6'}>
                {currentRooms.map((room, index) => (
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
                          <p className="text-3xl font-serif text-luxury-gold">LKR {room.ratePerNight}</p>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-16">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-3 rounded-full border border-black/10 dark:border-white/10 text-luxury-charcoal dark:text-white hover:bg-luxury-gold hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current transition-all"
                  >
                    <ChevronRight size={20} className="rotate-180" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`w-12 h-12 rounded-full font-bold transition-all ${
                        currentPage === i + 1
                          ? 'bg-luxury-gold text-white shadow-lg'
                          : 'border border-black/10 dark:border-white/10 text-luxury-charcoal dark:text-white hover:border-luxury-gold'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-full border border-black/10 dark:border-white/10 text-luxury-charcoal dark:text-white hover:bg-luxury-gold hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
