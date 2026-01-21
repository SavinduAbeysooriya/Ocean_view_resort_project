import React, { useState, useEffect } from 'react';
import Hero from '../components/ui/Hero';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotel, Utensils, Umbrella, Users, ArrowRight, Star, Quote, ChevronLeft, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const navigate = useNavigate();
    const [latestRooms, setLatestRooms] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    const BASE_URL = 'http://localhost:8080';
    const API_URL = 'http://localhost:8080/api';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/rooms`);
                const allRooms = response.data.filter(r => r.status === 'available');
                
                // Get latest 6 rooms
                setLatestRooms(allRooms.slice(-6).reverse());

                // Collect gallery images from rooms
                const images = [];
                allRooms.forEach(room => {
                    if (room.image1) images.push({ url: `${BASE_URL}${room.image1}`, title: `Room ${room.roomNumber}` });
                    if (room.image2) images.push({ url: `${BASE_URL}${room.image2}`, title: `Room ${room.roomNumber}` });
                });
                setGalleryImages(images.slice(0, 10)); // Top 10 for carousel
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching home data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Carousel logic
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

    useEffect(() => {
        if (galleryImages.length > 0) {
            const timer = setInterval(nextSlide, 5000);
            return () => clearInterval(timer);
        }
    }, [galleryImages]);

    return (
        <div className="bg-luxury-cream dark:bg-luxury-dark transition-colors duration-500 font-sans">
            <Hero />
            
            {/* Our Story Section */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-luxury-gold tracking-[0.3em] uppercase text-xs font-bold mb-4 block">Our Story</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-luxury-charcoal dark:text-white mb-8 leading-tight">Crafting Memories <br /> Since 1992</h2>
                        <p className="text-luxury-charcoal/60 dark:text-white/60 leading-loose mb-8 italic">
                            "A journey of a thousand miles begins with a single step into serenity. At Ocean View, we believe luxury isn't just about what you see, but how you feel."
                        </p>
                        <p className="text-luxury-charcoal/40 dark:text-white/40 leading-relaxed mb-10">
                            Nestled on the edge of the world, our resort offers an unparalleled escape from the mundane. Every suite is a sanctuary, every meal a masterpiece, and every sunset a divine experience.
                        </p>
                        <button 
                            onClick={() => navigate('/about')}
                            className="text-luxury-gold uppercase tracking-[0.2em] font-bold text-xs border-b border-luxury-gold pb-2 hover:text-luxury-charcoal dark:hover:text-white hover:border-luxury-charcoal dark:hover:border-white transition-all"
                        >
                            Discover More
                        </button>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className="space-y-4 pt-12">
                            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800" alt="Resort 1" className="w-full h-64 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" />
                            <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" alt="Resort 2" className="w-full h-80 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" />
                        </div>
                        <div className="space-y-4">
                            <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800" alt="Resort 3" className="w-full h-80 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" />
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" alt="Resort 4" className="w-full h-64 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Latest Rooms Section */}
            <section className="py-24 bg-white/50 dark:bg-luxury-charcoal/10 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                        <div>
                            <span className="text-luxury-gold tracking-[0.3em] uppercase text-xs font-bold mb-4 block">New Arrivals</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-luxury-charcoal dark:text-white leading-tight">Latest Suites & Rooms</h2>
                        </div>
                        <button 
                            onClick={() => navigate('/rooms')}
                            className="mt-6 md:mt-0 flex items-center space-x-2 text-luxury-gold hover:text-charcoal dark:hover:text-white transition-colors uppercase tracking-widest text-xs font-bold border border-luxury-gold/30 px-6 py-3"
                        >
                            <span>Explore All Rooms</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-96 bg-gray-200 dark:bg-white/5 animate-pulse rounded-sm"></div>
                            ))
                        ) : (
                            latestRooms.map((room, idx) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group bg-white dark:bg-luxury-charcoal rounded-sm overflow-hidden shadow-xl hover:shadow-2xl transition-all"
                                >
                                    <div className="relative h-72 overflow-hidden">
                                        <img 
                                            src={room.image1 ? `${BASE_URL}${room.image1}` : "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800"} 
                                            alt={room.roomNumber}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                        <div className="absolute top-4 right-4 bg-luxury-gold text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                            {room.bedType || 'Luxury'}
                                        </div>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-serif text-charcoal dark:text-white">Room {room.roomNumber}</h3>
                                            <div className="text-right">
                                                <p className="text-xl font-serif text-luxury-gold">LKR {room.ratePerNight}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Per Night</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/rooms/${room.id}`)}
                                            className="w-full py-3 bg-luxury-gold/5 text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all text-xs font-bold uppercase tracking-widest border border-luxury-gold/20"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Gallery Carousel Section */}
            <section className="py-24 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                    <span className="text-luxury-gold tracking-[0.3em] uppercase text-xs font-bold mb-4 block">Visual Journey</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-luxury-charcoal dark:text-white">Resort Gallery</h2>
                </div>

                <div className="relative h-[600px] w-full">
                    <AnimatePresence mode='wait'>
                        {galleryImages.length > 0 && (
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="absolute inset-0"
                            >
                                <img 
                                    src={galleryImages[currentSlide].url} 
                                    alt={galleryImages[currentSlide].title}
                                    className="w-full h-full object-cover brightness-75"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-luxury-dark/80"></div>
                                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-white">
                                    <p className="text-[10px] uppercase tracking-[0.5em] font-bold mb-2 text-luxury-gold">Featured View</p>
                                    <h3 className="text-3xl font-serif">{galleryImages[currentSlide].title}</h3>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Controls */}
                    <button onClick={prevSlide} className="absolute left-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md hover:bg-luxury-gold text-white transition-all rounded-full z-10">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextSlide} className="absolute right-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md hover:bg-luxury-gold text-white transition-all rounded-full z-10">
                        <ChevronRight size={24} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                        {galleryImages.map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => setCurrentSlide(i)}
                                className={`w-2 h-2 rounded-full transition-all ${currentSlide === i ? 'bg-luxury-gold w-8' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Google Review Widget Placeholder (Free Widget Pattern) */}
            <section className="py-24 bg-luxury-cream/50 dark:bg-black/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-4">
                            {[...Array(5)].map((_, i) => <Star key={i} fill="#D4AF37" className="text-luxury-gold" size={24} />)}
                        </div>
                        <h2 className="text-3xl font-serif text-charcoal dark:text-white mb-4">Guest Experiences</h2>
                        <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Verified Google Reviews</p>
                    </div>

                    {/* Free Review Widget (Embedded via typical free provider structure) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "John Smith", date: "2 days ago", text: "Truly a paradise on earth. The service at Ocean View Resort is unparalleled. Can't wait to return!" },
                            { name: "Sarah Johnson", date: "1 week ago", text: "The views from the luxury suites are breathtaking. Every detail was perfectly executed. Truly 5 stars!" },
                            { name: "Robert Wilson", date: "2 weeks ago", text: "The best vacation our family has ever had. The private beach is pristine and the food is world-class." }
                        ].map((review, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-luxury-charcoal p-8 rounded-sm shadow-xl border-t-2 border-luxury-gold"
                            >
                                <Quote className="text-luxury-gold/20 mb-6" size={40} />
                                <p className="text-gray-600 dark:text-white/60 mb-8 italic leading-relaxed">"{review.text}"</p>
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-luxury-gold/10 flex items-center justify-center rounded-full text-luxury-gold font-bold">
                                        {review.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-charcoal dark:text-white">{review.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{review.date}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="mt-12 text-center">
                        <a 
                            href="https://www.google.com/search?q=ocean+view+resort+reviews" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white dark:bg-luxury-charcoal px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-luxury-gold border border-luxury-gold/20 shadow-lg inline-flex items-center space-x-2 hover:bg-luxury-gold hover:text-white transition-all"
                        >
                            <span>View All Google Reviews</span>
                            <Star size={12} fill="currentColor" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Small Contact Us Section */}
            <section className="py-20 bg-luxury-dark text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxury-gold/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <span className="text-luxury-gold tracking-[0.3em] uppercase text-xs font-bold mb-4 block">Concierge Service</span>
                        <h2 className="text-4xl font-serif mb-6">Planning your dream stay? We are here to help.</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                            <div className="flex items-center space-x-4">
                                <Phone className="text-luxury-gold" size={20} />
                                <span className="text-sm opacity-60">+94 112 345 678</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <MapPin className="text-luxury-gold" size={20} />
                                <span className="text-sm opacity-60">Galle Road, Balapitiya</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <button 
                            onClick={() => navigate('/contact')}
                            className="bg-luxury-gold text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-yellow-600 transition-all shadow-xl"
                        >
                            Contact Us Now
                        </button>
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                        >
                            Back to Top
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
