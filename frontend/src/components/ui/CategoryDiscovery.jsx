import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Bed, ArrowRight } from 'lucide-react';
import { BASE_URL, API_URL } from '../../config/api';

const CategoryDiscovery = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Carousel State
    const [currentIndex, setCurrentIndex] = useState(0);
    // Determine how many items to show based on logic or responsiveness
    // For this design, let's show one big active card and previews, or 3 cards. 
    // Let's go with a 3-card sliding view. 
    // However, for simplicity and elegance, a single-view highlight with neighbors or a 3-grid carousel is good.
    // Let's do a 3-column view for desktop, 1 for mobile.
    
    const [itemsPerPage, setItemsPerPage] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setItemsPerPage(1);
            else if (window.innerWidth < 1024) setItemsPerPage(2);
            else setItemsPerPage(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/room-categories`);
                setCategories(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => 
            prev + 1 >= categories.length - (itemsPerPage - 1) ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => 
            prev === 0 ? Math.max(0, categories.length - itemsPerPage) : prev - 1
        );
    };
    
    // Auto scroll
    useEffect(() => {
        if (!loading && categories.length > itemsPerPage) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => {
                     // If we are at the end (where no more groups of 'itemsPerPage' fit perfectly or we want cyclic), 
                     // let's just cycle simply.
                     if (prev >= categories.length - itemsPerPage) return 0;
                     return prev + 1;
                });
            }, 6000); // 6 seconds
            return () => clearInterval(interval);
        }
    }, [loading, categories.length, itemsPerPage]);


    if (loading) return null; // Or a skeleton
    if (categories.length === 0) return null;

    return (
        <section className="py-24 bg-white dark:bg-luxury-charcoal relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-luxury-gold/5 rounded-full -ml-32 -mt-32 blur-3xl"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                   <div>
                        <span className="text-luxury-gold tracking-[0.3em] uppercase text-xs font-bold mb-4 block">
                            Curated Collections
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-charcoal dark:text-white leading-tight">
                            Discover by Category
                        </h2>
                   </div>
                   <div className="flex space-x-3 mt-6 md:mt-0">
                       <button 
                           onClick={prevSlide}
                           className="p-3 border border-black/10 dark:border-white/10 hover:bg-luxury-gold hover:text-white hover:border-luxury-gold text-charcoal dark:text-white rounded-full transition-all"
                       >
                           <ChevronLeft size={20} />
                       </button>
                       <button 
                           onClick={nextSlide}
                           className="p-3 border border-black/10 dark:border-white/10 hover:bg-luxury-gold hover:text-white hover:border-luxury-gold text-charcoal dark:text-white rounded-full transition-all"
                       >
                           <ChevronRight size={20} />
                       </button>
                   </div>
                </div>

                <div className="overflow-hidden">
                    <motion.div 
                        className="flex gap-8"
                        initial={false}
                        animate={{ x: `-${currentIndex * (100 / itemsPerPage)}%`, gap: '2rem' }} // Simple percentage based sliding requires width calculation or fixed widths
                        // A more robust way for n-items carousel is setting width logic. 
                        // Let's use standard flex sizing.
                    >
                         {/* We will translate the container. x value needs to be calculated in pixels or % properly. 
                             If we have 3 items per page, 100% width shows 3 items. 
                             Moving 1 item means moving 100/3 %.
                         */}
                    </motion.div>
                    
                    {/* Let's redo the wrapper logic to be simpler for CSS grid/flex or framer motion 
                        We want to shift by (cardWidth + gap) * currentIndex.
                    */}
                    <div className="relative w-full overflow-hidden">
                         <motion.div 
                            className="flex"
                            animate={{ x: `-${currentIndex * (100 / itemsPerPage)}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                         >
                            {categories.map((category) => (
                                <motion.div 
                                    key={category.id}
                                    className={`flex-shrink-0 px-2`}
                                    style={{ width: `${100 / itemsPerPage}%` }}
                                >
                                    <div 
                                        onClick={() => navigate(`/rooms?category=${category.id}`)}
                                        className="group cursor-pointer relative h-[450px] rounded-sm overflow-hidden shadow-xl"
                                    >
                                        {/* Image */}
                                        <div className="absolute inset-0">
                                            {category.categoryImage ? (
                                                <img 
                                                    src={`${BASE_URL}${category.categoryImage}`} 
                                                    alt={category.category} 
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                                    <Bed size={48} className="text-luxury-gold/50" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <h3 className="text-2xl font-serif text-white mb-2">{category.category}</h3>
                                            <p className="text-white/70 text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                {category.description || "Experience luxury in our carefully designed suites."}
                                            </p>
                                            
                                            <div className="flex items-center text-luxury-gold font-bold uppercase tracking-widest text-xs group/btn">
                                                <span className="mr-2">Explore Rooms</span>
                                                <ArrowRight size={16} className="transform group-hover/btn:translate-x-2 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                         </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryDiscovery;
