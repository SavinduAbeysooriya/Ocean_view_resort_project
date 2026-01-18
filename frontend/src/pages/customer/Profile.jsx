import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Phone, CreditCard, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../../utils/AuthContext";
import axios from "axios";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: "",
    nicNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/guests/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setFormData({
          name: response.data.name || "",
          address: response.data.address || "",
          contactNumber: response.data.contactNumber || "",
          nicNumber: response.data.nicNumber || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: "error", text: "Failed to load profile data." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/guests/me", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
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
    <div className="min-h-screen pt-32 pb-20 px-6 bg-luxury-cream dark:bg-luxury-dark">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-48 bg-luxury-gold overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
            </div>
            <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
              <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-xl">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.username}&background=D4AF37&color=fff&size=128`}
                  className="w-full h-full rounded-xl object-cover"
                  alt="Avatar"
                />
              </div>
              <div className="pb-20">
                <h1 className="text-3xl font-serif font-bold text-white mb-1">
                  {formData.name || user?.username}
                </h1>
                <p className="text-white/80 font-sans tracking-widest uppercase text-xs">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-24 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">
                  Complete Your Guest Profile
                </h2>
                <p className="text-luxury-charcoal/60 dark:text-white/60 text-sm">
                  Please provide your details for a faster booking experience.
                </p>
              </div>
            </div>

            {message.text && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`mb-8 p-4 rounded-xl flex items-center space-x-3 ${
                  message.type === "success"
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}
              >
                {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span className="text-sm font-medium">{message.text}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-sans tracking-widest uppercase text-luxury-charcoal/60 dark:text-white/60 ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gold group-focus-within:scale-110 transition-transform">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-luxury-cream/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* NIC Number */}
                <div className="space-y-2">
                  <label className="text-xs font-sans tracking-widest uppercase text-luxury-charcoal/60 dark:text-white/60 ml-1">
                    NIC / Passport Number
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gold group-focus-within:scale-110 transition-transform">
                      <CreditCard size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.nicNumber}
                      onChange={(e) => setFormData({ ...formData, nicNumber: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-luxury-cream/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white"
                      placeholder="Enter NIC number"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                  <label className="text-xs font-sans tracking-widest uppercase text-luxury-charcoal/60 dark:text-white/60 ml-1">
                    Contact Number
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gold group-focus-within:scale-110 transition-transform">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      required
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-luxury-cream/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white"
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-sans tracking-widest uppercase text-luxury-charcoal/60 dark:text-white/60 ml-1">
                    Home Address
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-6 text-luxury-gold group-focus-within:scale-110 transition-transform">
                      <MapPin size={18} />
                    </div>
                    <textarea
                      required
                      rows="3"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-luxury-cream/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white resize-none"
                      placeholder="Enter your permanent address"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={saving}
                  type="submit"
                  className="flex items-center space-x-2 px-8 py-4 bg-luxury-gold hover:bg-yellow-600 disabled:bg-gray-400 text-white font-sans font-bold text-sm tracking-[0.2em] uppercase rounded-xl transition-all shadow-lg overflow-hidden relative group"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Profile</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
