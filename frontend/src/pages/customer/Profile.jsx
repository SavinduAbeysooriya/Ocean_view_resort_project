import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Phone, CreditCard, Save, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { useAuth } from "../../utils/AuthContext";
import axios from "axios";
import PayHereButton from "../../components/PayHereButton";
import { useNavigate, useLocation } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: "",
    nicNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [reservations, setReservations] = useState([]);
  const [fetchingReservations, setFetchingReservations] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchReservations();
    
    // Check if there's a message in location state (e.g., from successful booking)
    if (location.state?.message) {
      setMessage({ type: "success", text: location.state.message });
      // Clear state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
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

  const fetchReservations = async () => {
    try {
      setFetchingReservations(true);
      const token = localStorage.getItem("token");
      if (!user?.id) return;
      const response = await axios.get(`http://localhost:8080/api/reservations/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setFetchingReservations(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'completed': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getPaymentStatusColor = (status) => {
    return status?.toLowerCase() === 'paid' 
      ? 'text-green-500 bg-green-500/10 border-green-500/20' 
      : 'text-red-500 bg-red-500/10 border-red-500/20';
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
    <div className="min-h-screen pt-32 pb-20 px-6 bg-luxury-cream dark:bg-luxury-dark transition-colors duration-500">
      {/* Debug: Showing if user exists */}
      {!user && <div className="text-white text-center">Caution: User context is missing</div>}
      <div className="max-w-5xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-luxury-charcoal backdrop-blur-xl rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-48 bg-luxury-gold overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
            </div>
            <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
              <div className="w-32 h-32 rounded-2xl bg-white dark:bg-luxury-dark p-1 shadow-xl">
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
                  Guest Profile
                </h2>
                <p className="text-luxury-charcoal/60 dark:text-white/60 text-sm">
                  Manage your personal details and preferences.
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
                      className="w-full pl-12 pr-4 py-4 bg-luxury-cream dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white"
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
                      className="w-full pl-12 pr-4 py-4 bg-luxury-cream dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white"
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
                      className="w-full pl-12 pr-4 py-4 bg-luxury-cream dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white"
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
                      className="w-full pl-12 pr-4 py-4 bg-luxury-cream dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white resize-none"
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

        {/* Reservations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-luxury-charcoal backdrop-blur-xl rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">
                  My Reservations
                </h2>
                <p className="text-luxury-charcoal/60 dark:text-white/60 text-sm">
                  View and manage your upcoming and past stays.
                </p>
              </div>
            </div>

            {fetchingReservations ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-20 bg-luxury-cream/30 dark:bg-white/5 rounded-2xl border border-dashed border-black/10 dark:border-white/10">
                <CreditCard className="mx-auto text-luxury-gold/30 mb-4" size={48} />
                <p className="text-luxury-charcoal/60 dark:text-white/60">No reservations found.</p>
                <button 
                  onClick={() => navigate('/rooms')}
                  className="mt-4 text-luxury-gold font-bold hover:underline"
                >
                  Book your first stay
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/5 dark:border-white/10">
                      <th className="pb-4 text-xs font-sans tracking-widest uppercase text-luxury-charcoal/40 dark:text-white/40">Res #</th>
                      <th className="pb-4 text-xs font-sans tracking-widest uppercase text-luxury-charcoal/40 dark:text-white/40">Check-In</th>
                      <th className="pb-4 text-xs font-sans tracking-widest uppercase text-luxury-charcoal/40 dark:text-white/40">Check-Out</th>
                      <th className="pb-4 text-xs font-sans tracking-widest uppercase text-luxury-charcoal/40 dark:text-white/40">Amount</th>
                      <th className="pb-4 text-xs font-sans tracking-widest uppercase text-luxury-charcoal/40 dark:text-white/40">Status</th>
                      <th className="pb-4 text-xs font-sans tracking-widest uppercase text-luxury-charcoal/40 dark:text-white/40">Payment</th>
                      <th className="pb-4 text-xs font-sans tracking-widest uppercase text-luxury-charcoal/40 dark:text-white/40">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:border-white/10">
                    {reservations.map((res) => (
                      <tr key={res.id} className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 text-sm font-sans font-bold text-luxury-charcoal dark:text-white">
                          #{res.reservationNumber || res.id?.substring(0, 8) || 'REF'}
                        </td>
                        <td className="py-4 text-sm text-luxury-charcoal/60 dark:text-white/60">
                          {new Date(res.checkInDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-sm text-luxury-charcoal/60 dark:text-white/60">
                          {new Date(res.checkOutDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-sm font-bold text-luxury-gold">
                          ${res.totalCost}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(res.status)}`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getPaymentStatusColor(res.paymentStatus)}`}>
                            {res.paymentStatus}
                          </span>
                        </td>
                        <td className="py-4">
                          {res.paymentStatus?.toLowerCase() === 'unpaid' && res.status?.toLowerCase() !== 'cancelled' && (
                            <PayHereButton 
                              reservation={res} 
                              onSuccess={() => {
                                fetchReservations();
                                setMessage({ type: 'success', text: 'Payment successful!' });
                              }}
                              onError={(err) => setMessage({ type: 'error', text: err })}
                            />
                          )}
                          {res.paymentStatus?.toLowerCase() === 'paid' && (
                            <button
                              onClick={() => navigate(`/profile/invoice/${res.id}`)}
                              className="flex items-center space-x-2 text-luxury-gold hover:text-yellow-600 font-bold uppercase tracking-widest text-[10px]"
                            >
                              <Download size={14} />
                              <span>Invoice</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
