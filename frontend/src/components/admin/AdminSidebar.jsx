import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import {
  LayoutDashboard,
  Hotel,
  Calendar,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Overview",
      path: "/admin/dashboard",
    },
    {
      icon: Hotel,
      label: "Room Types",
      path: "/admin/room-categories",
    },
    { icon: Hotel, label: "Rooms", path: "/admin/rooms" },
    {
      icon: Calendar,
      label: "Reservations",
      path: "/admin/reservations",
    },
    { icon: Shield, label: "Users", path: "/admin/users" },
  ];

  const handleNavigation = (path) => {
    if (path !== "#") {
      navigate(path);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-luxury-dark text-white rounded-sm shadow-xl"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
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
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 border-2 border-luxury-gold flex items-center justify-center transform rotate-45 group cursor-pointer hover:rotate-[225deg] transition-all duration-700">
            <span className="transform -rotate-45 text-luxury-gold font-serif font-bold text-2xl group-hover:rotate-[-225deg] transition-all duration-700">
             <img src="/src/assets/logo.png" alt="Logo" className="w-8 h-8" />
            </span>
          </div>
          <div>
            <span className="font-serif font-bold tracking-[0.2em] text-base uppercase block text-luxury-charcoal dark:text-white">
              Ocean View
            </span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-luxury-gold/80 font-bold">
              Welcome Admin 
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center space-x-4 p-4 rounded-sm 
                transition-all duration-300 group
                ${
                  location.pathname === item.path
                    ? "bg-luxury-gold text-white shadow-lg shadow-luxury-gold/20"
                    : "hover:bg-gray-100 dark:hover:bg-white/5 text-luxury-charcoal/60 dark:text-white/40 hover:text-luxury-charcoal dark:hover:text-white"
                }
              `}
            >
              <item.icon
                size={18}
                className={`${location.pathname === item.path ? "scale-110" : "group-hover:translate-x-1"} transition-all`}
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="pt-8 border-t border-gray-200 dark:border-white/5 space-y-2">
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

export default AdminSidebar;
