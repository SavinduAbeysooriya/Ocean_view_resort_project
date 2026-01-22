import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import faqHeader from '../assets/faq_header.jpg';
import { Plus, Minus, HelpCircle, Calendar, CreditCard, Ship, Plane, Coffee } from 'lucide-react';


const FAQItem = ({ question, answer, icon: Icon, isOpen, onClick }) => {
  return (
    <div className="border-b border-black/5 dark:border-white/5 py-6">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between text-left group"
      >
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-luxury-gold/5 dark:bg-luxury-gold/10 rounded-full group-hover:bg-luxury-gold transition-colors">
            <Icon size={20} className="text-luxury-gold group-hover:text-white transition-colors" />
          </div>
          <span className="text-lg md:text-xl font-serif text-luxury-charcoal dark:text-white group-hover:text-luxury-gold transition-colors">
            {question}
          </span>
        </div>
        {isOpen ? (
          <Minus size={20} className="text-luxury-gold" />
        ) : (
          <Plus size={20} className="text-luxury-charcoal/30 dark:text-white/30" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-luxury-charcoal/60 dark:text-white/60 font-sans leading-relaxed pl-14">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What are the standard check-in and check-out times?",
      answer: "Standard check-in time is 2:00 PM and check-out time is 12:00 PM. Early check-in or late check-out is subject to availability and may incur additional charges.",
      icon: Calendar
    },
    {
      question: "Do you offer airport transportation from Colombo?",
      answer: "Yes, we provide luxury private transfers from Bandaranaike International Airport (CMB). The journey typically takes about 2-2.5 hours via the Southern Expressway. Please contact our concierge to arrange your pickup.",
      icon: Plane
    },
    {
      question: "Is breakfast included in the room rate?",
      answer: "Most of our rates include a lavish buffet breakfast featuring both local Sri Lankan delicacies and international favorites. Please check your booking details for confirmation.",
      icon: Coffee
    },
    {
      question: "What is your cancellation policy?",
      answer: "Cancellations made up to 14 days before arrival are free of charge. Cancellations within 14 days or no-shows will be charged for the full stay. Policies may vary for peak season and special promotions.",
      icon: CreditCard
    },
    {
      question: "How far is the resort from the historic Galle Fort?",
      answer: "We are located just 15 minutes away from the Galle Fort. We offer complimentary shuttle service twice a day for our guests who wish to explore the UNESCO World Heritage Site.",
      icon: Ship
    },
    {
      question: "Do you have any pet-friendly rooms?",
      answer: "While we love animals, Ocean View Resort maintains a no-pet policy to ensure the comfort and safety of all our guests and to maintain our high standards of hygiene.",
      icon: HelpCircle
    }
  ];

  return (
    <div className="bg-luxury-cream dark:bg-luxury-dark min-h-screen transition-colors duration-300">
      {/* Page Header Component */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden mb-20">
        <div className="absolute inset-0 bg-black/50 z-10 transition-colors duration-300 dark:bg-black/60"></div>
         <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${faqHeader})` }}
                      ></div>
        <div className="relative z-20 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-luxury-gold tracking-[0.4em] uppercase text-xs font-bold mb-4 block">
              Support Center
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white drop-shadow-2xl">
              FAQ
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif text-luxury-charcoal dark:text-white mb-6"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-luxury-charcoal/50 dark:text-white/50 max-w-xl mx-auto italic"
          >
            Everything you need to know about your stay at Ocean View Resort. If you have any other questions, feel free to contact us.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-luxury-charcoal/20 p-8 md:p-12 rounded-sm shadow-xl backdrop-blur-sm border border-black/5 dark:border-white/5"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              {...faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </motion.div>

        <div className="mt-20 text-center">
            <p className="text-luxury-charcoal/60 dark:text-white/60 mb-6 font-sans">Still have questions?</p>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact', { state: { subject: 'Concierge Inquiry' } })}
                className="px-10 py-4 bg-luxury-gold text-white font-bold uppercase tracking-widest text-xs rounded-sm shadow-lg hover:bg-yellow-600 transition-all"
            >
                Contact Our Concierge
            </motion.button>
            <hr className="my-12 border-t border-black/5 dark:border-white/5" />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
