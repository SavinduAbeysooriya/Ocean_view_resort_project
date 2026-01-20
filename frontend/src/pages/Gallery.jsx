import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Maximize2, Camera, Compass } from 'lucide-react';

const Gallery = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const API_URL = 'http://localhost:8080/api';
    const BASE_URL = 'http://localhost:8080';

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${API_URL}/rooms`);
            setRooms(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching rooms for gallery:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-luxury-cream dark:bg-luxury-dark">
                <div className="w-12 h-12 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-500 py-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center space-x-3 text-xs uppercase tracking-[0.4em] text-luxury-gold mb-4">
                        <span className="w-12 h-[1px] bg-luxury-gold/30"></span>
                        <span>The Visual Experience</span>
                        <span className="w-12 h-[1px] bg-luxury-gold/30"></span>
                    </div>
                    <h1 className="text-5xl font-serif text-charcoal dark:text-white mb-4">Our Resort Gallery</h1>
                    <p className="text-gray-500 dark:text-white/40 max-w-2xl mx-auto font-light">
                        Explore our world-class accommodations through our visual catalog. Each room is a masterpiece of design and comfort.
                    </p>
                </motion.div>

                {/* Gallery Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {rooms.map((room, index) => {
                        const images = [room.image1, room.image2, room.image3].filter(img => img);
                        
                        return images.map((image, imgIndex) => (
                            <motion.div
                                key={`${room.id}-${imgIndex}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="relative group overflow-hidden bg-white dark:bg-luxury-charcoal rounded-sm cursor-pointer shadow-lg hover:shadow-2xl transition-all"
                                onClick={() => navigate(`/rooms/${room.id}`)}
                            >
                                <img 
                                    src={`${BASE_URL}${image}`} 
                                    alt={`Room ${room.roomNumber}`}
                                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                                />
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <Maximize2 className="text-luxury-gold" size={32} />
                                    </div>
                                    <h3 className="text-white font-serif text-xl mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                        Room {room.roomNumber}
                                    </h3>
                                    <button 
                                        className="px-6 py-2 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100"
                                    >
                                        View Room
                                    </button>
                                </div>

                                {/* Label Bottom-Left (Always visible) */}
                                <div className="absolute bottom-4 left-4 z-10 group-hover:opacity-0 transition-opacity">
                                    <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-sm border-l-2 border-luxury-gold">
                                        <p className="text-white text-[10px] uppercase font-bold tracking-widest">Room {room.roomNumber}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ));
                    })}
                </div>

                {rooms.length === 0 && !loading && (
                    <div className="text-center py-24">
                        <Camera className="mx-auto text-luxury-gold/20 mb-6" size={64} />
                        <p className="text-luxury-charcoal/60 dark:text-white/60 text-xl font-serif">No images captured yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
