import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  ConciergeBell,
  LogOut,
  Menu,
  X,
  HelpCircle
} from "lucide-react";
import logo from "../../assets/logo.png";

const StaffSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/staff/dashboard" },
    { icon: Calendar, label: "Schedules", path: "/staff/dashboard" },
    { icon: ConciergeBell, label: "Guest List", path: "/staff/dashboard" },
    { icon: HelpCircle, label: "Help", path: "/staff/help" },
  ];

  const handleTabClick = (item) => {
    if (location.pathname !== item.path) {
        navigate(item.path);
    } else {
        setActiveTab(item.label);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-luxury-dark text-white rounded-sm shadow-xl"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 
          bg-white dark:bg-luxury-dark 
          border-r border-gray-200 dark:border-white/10
          text-luxury-charcoal dark:text-white 
          p-8 flex flex-col space-y-10 z-40 shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Resort Logo" className="w-12 hover:scale-110 transition-transform duration-300" />
          <div>
            <span className="font-serif font-bold tracking-[0.2em] text-base uppercase block text-luxury-charcoal dark:text-white">
              Ocean View
            </span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-luxury-gold/80 font-bold">
              Staff Portal
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleTabClick(item)}
              className={`
                w-full flex items-center space-x-4 p-4 rounded-sm 
                transition-all duration-300 group
                ${
                  activeTab === item.label
                    ? "bg-luxury-gold text-white shadow-lg shadow-luxury-gold/20"
                    : "hover:bg-gray-100 dark:hover:bg-white/5 text-luxury-charcoal/60 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white"
                }
              `}
            >
              <item.icon
                size={18}
                className={`${activeTab === item.label ? "scale-110" : "group-hover:translate-x-1"} transition-all`}
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-gray-200 dark:border-white/5">
          <div className="flex items-center space-x-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal dark:text-white leading-none mb-1">
                {user?.username}
              </p>
              <p className="text-[8px] uppercase tracking-widest text-luxury-gold/60 font-bold">
                Operations
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-4 p-4 text-red-500 dark:text-red-400/60 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/5 rounded-sm transition-all duration-300 group"
          >
            <LogOut
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default StaffSidebar;
