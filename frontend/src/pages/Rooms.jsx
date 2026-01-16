import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bed, Users, Maximize, Wind, Coffee, Wifi, ArrowRight, Star } from 'lucide-react';

const roomCategories = [
  {
    id: 1,
    name: "Deluxe Ocean Suite",
    type: "Suite",
    price: 450,
    rating: 4.9,
    reviews: 124,
    size: "65m²",
    guests: "2 Adults",
    image: "https://images.unsplash.com/photo-1591088398332-8a77d4972844?auto=format&fit=crop&q=80&w=1200",
    description: "Experience the ultimate in coastal living. Our Deluxe Ocean Suite offers panoramic views of the turquoise waters with a private balcony and a custom-designed king bed.",
    amenities: ["Private Balcony", "Mini Bar", "24/7 Service", "Espresso Machine"]
  },
  {
    id: 2,
    name: "Royal Villa with Pool",
    type: "Villa",
    price: 1200,
    rating: 5.0,
    reviews: 86,
    size: "240m²",
    guests: "4 Adults",
    image: "https://images.unsplash.com/photo-1544124499-58dd62ce851c?auto=format&fit=crop&q=80&w=1200",
    description: "Indulge in unparalleled privacy. The Royal Villa features its own infinity pool, a sprawling sun deck, and two master bedrooms with glass-bottom bathrooms.",
    amenities: ["Infinity Pool", "Personal Butler", "Full Kitchen", "Private Gym"]
  },
  {
    id: 3,
    name: "Azure Family Room",
    type: "Family",
    price: 650,
    rating: 4.8,
    reviews: 156,
    size: "95m²",
    guests: "2 Adults, 2 Children",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200",
    description: "Modern elegance for the whole family. Interconnecting rooms designed to provide space and comfort, featuring a children's play area and high-end entertainment systems.",
    amenities: ["Entertainment Hub", "Twin Queen Beds", "Kid's Menu", "Twice Daily Housekeeping"]
  },
  {
    id: 4,
    name: "Sunset Penthouse",
    type: "Suite",
    price: 850,
    rating: 4.9,
    reviews: 42,
    size: "120m²",
    guests: "2 Adults",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9759678?auto=format&fit=crop&q=80&w=1200",
    description: "Watch the horizon catch fire from your private rooftop terrace. The Sunset Penthouse is our most romantic offering, featuring a circular bed and an outdoor jacuzzi.",
    amenities: ["Rooftop Terrace", "Jacuzzi", "Wine Cellar", "Priority Spa Booking"]
  },
  {
    id: 5,
    name: "Garden Sanctuary",
    type: "Villa",
    price: 380,
    rating: 4.7,
    reviews: 210,
    size: "55m²",
    guests: "2 Adults",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
    description: "A tranquil escape nestled within our lush tropical gardens. Perfect for those seeking peace and quiet, featuring an outdoor rain shower and meditation deck.",
    amenities: ["Tropical Garden", "Outdoor Shower", "Organic Toiletries", "Yoga Mat"]
  },
  {
    id: 6,
    name: "Presidential Sky Suite",
    type: "Suite",
    price: 2500,
    rating: 5.0,
    reviews: 12,
    size: "350m²",
    guests: "6 Adults",
    image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&q=80&w=1200",
    description: "The crown jewel of Ocean View. Occupying the entire top floor, this suite offers 360-degree views, a private theater, and a dining room for twelve.",
    amenities: ["Private Elevator", "Helipad Access", "Chef on Call", "Security Guard"]
  }
];

const filterOptions = ["All Rooms", "Suite", "Villa", "Family"];

const Rooms = () => {
  const [activeFilter, setActiveFilter] = useState("All Rooms");

  const filteredRooms = activeFilter === "All Rooms" 
    ? roomCategories 
    : roomCategories.filter(room => room.type === activeFilter);

  return (
    <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-300">
      {/* Header Banner */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10 transition-colors duration-300 dark:bg-black/60"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000')" }}
        ></div>
        <div className="relative z-20 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-luxury-gold tracking-[0.4em] uppercase text-xs font-bold mb-4 block"
          >
            Prestigious Living
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6"
          >
            Rooms & Suites
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 max-w-xl mx-auto font-sans tracking-wide leading-relaxed"
          >
            Discover our collection of world-class accommodations, where každý detail is meticulously crafted for your ultimate comfort and serenity.
          </motion.p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-12 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveFilter(option)}
              className={cn(
                "relative text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 pb-2",
                activeFilter === option 
                  ? "text-luxury-gold" 
                  : "text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white"
              )}
            >
              {option}
              {activeFilter === option && (
                <motion.div 
                  layoutId="filterUnderline"
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-luxury-gold"
                />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredRooms.map((room) => (
              <motion.div
                layout
                key={room.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="group flex flex-col bg-white dark:bg-luxury-charcoal/30 border border-black/5 dark:border-white/5 overflow-hidden rounded-sm shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-luxury-dark/80 backdrop-blur-md px-3 py-1 rounded-sm flex items-center space-x-1 border border-white/10">
                    <Star size={14} className="text-luxury-gold fill-luxury-gold" />
                    <span className="text-white text-xs font-bold">{room.rating}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-luxury-gold text-xs uppercase tracking-widest font-bold">{room.type}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-serif text-luxury-charcoal dark:text-white group-hover:text-luxury-gold transition-colors duration-300">
                      {room.name}
                    </h3>
                  </div>
                  
                  <p className="text-luxury-charcoal/50 dark:text-white/50 text-sm font-sans mb-8 flex-1 line-clamp-3">
                    {room.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center space-x-3 text-luxury-charcoal/60 dark:text-white/60">
                      <Maximize size={18} className="text-luxury-gold" />
                      <span className="text-xs uppercase tracking-wider">{room.size}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-luxury-charcoal/60 dark:text-white/60">
                      <Users size={18} className="text-luxury-gold" />
                      <span className="text-xs uppercase tracking-wider">{room.guests}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                    <div>
                      <span className="text-luxury-gold font-serif text-2xl font-bold">${room.price}</span>
                      <span className="text-luxury-charcoal/40 dark:text-white/40 text-[10px] uppercase ml-2 tracking-widest">/ Night</span>
                    </div>
                    <button className="flex items-center space-x-2 text-luxury-charcoal dark:text-white hover:text-luxury-gold transition-colors group/btn">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Details</span>
                      <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  <button className="mt-8 w-full py-4 bg-luxury-dark dark:bg-white text-white dark:text-luxury-dark font-bold uppercase tracking-[0.2em] text-xs hover:bg-luxury-gold dark:hover:bg-luxury-gold dark:hover:text-white transition-all shadow-lg rounded-sm">
                    Book This Room
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Extra Services Branding */}
      <section className="py-24 bg-white/50 dark:bg-luxury-charcoal/20 border-y border-black/5 dark:border-white/5 transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-12">
          {[
            { icon: Wifi, label: 'Free High-speed Wifi' },
            { icon: Coffee, label: 'Fresh Breakfast' },
            { icon: Wind, label: 'Central Air Conditioning' },
            { icon: Bed, label: 'Memory Foam Bedding' },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center space-x-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default"
            >
              <item.icon size={24} className="text-luxury-gold" />
              <span className="text-luxury-charcoal dark:text-white font-sans text-xs uppercase tracking-widest font-bold">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Helper function to merge classes if not imported
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default Rooms;
