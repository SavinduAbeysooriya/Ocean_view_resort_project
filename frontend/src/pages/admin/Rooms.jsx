import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../utils/AuthContext";
import { BASE_URL, API_URL as BASE_API_URL } from "../../config/api";

import {
  LayoutDashboard,
  Users,
  Hotel,
  Calendar,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  ChevronRight,
  Eye,
  Check,
  AlertCircle,
  Info,
  Image as ImageIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

const AdminRooms = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  const [formData, setFormData] = useState({
    roomNumber: "",
    roomCategoryId: "",
    notes: "",
    amenities: "",
    ac: false,
    bedType: "",
    ratePerNight: "",
    capacity: "",
    status: "available",
  });

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
  });

  const [previews, setPreviews] = useState({
    image1: null,
    image2: null,
    image3: null,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = `${BASE_API_URL}/rooms`;
  const CAT_API_URL = `${BASE_API_URL}/room-categories`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [roomsRes, catsRes] = await Promise.all([
        axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(CAT_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setRooms(roomsRes.data);
      setCategories(catsRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        roomNumber: room.roomNumber,
        roomCategoryId: room.roomCategoryId,
        notes: room.notes || "",
        amenities: room.amenities || "",
        ac: room.ac,
        bedType: room.bedType || "",
        ratePerNight: room.ratePerNight,
        capacity: room.capacity,
        status: room.status,
      });
      setPreviews({
        image1: room.image1 ? `${BASE_URL}${room.image1}` : null,
        image2: room.image2 ? `${BASE_URL}${room.image2}` : null,
        image3: room.image3 ? `${BASE_URL}${room.image3}` : null,
      });
    } else {
      setEditingRoom(null);
      setFormData({
        roomNumber: "",
        roomCategoryId: categories.length > 0 ? categories[0].id : "",
        notes: "",
        amenities: "",
        ac: false,
        bedType: "",
        ratePerNight: "",
        capacity: "",
        status: "available",
      });
      setPreviews({ image1: null, image2: null, image3: null });
    }
    setImages({ image1: null, image2: null, image3: null });
    setIsModalOpen(true);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => ({ ...prev, [field]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenViewModal = (room) => {
    setSelectedRoom(room);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (images.image1) data.append("image1", images.image1);
      if (images.image2) data.append("image2", images.image2);
      if (images.image3) data.append("image3", images.image3);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingRoom) {
        await axios.put(`${API_URL}/${editingRoom.id}`, data, config);
        alert("Room updated successfully!");
      } else {
        await axios.post(API_URL, data, config);
        alert("Room created successfully!");
      }

      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving room:", error);
      alert("Failed to save room details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.category : "Unknown";
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(room.roomCategoryId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      room.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-300 flex selection:bg-luxury-gold selection:text-white">
      {/* Sidebar */}

      <AdminSidebar activePage="dashboard" />
      {/* Main Content */}
      <main className="flex-1 ml-64 p-12 min-h-screen">
        <AdminHeader
          subtitle="Room Inventory"
          title="Luxury Accommodations"
          description={`Overseeing ${rooms.length} individual room units`}
        />

        {/* Action Toolbar */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-charcoal/30 dark:text-white/30"
              size={16}
            />
            <input
              type="text"
              placeholder="Search Room Number / Category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white dark:bg-luxury-charcoal/20 border border-black/10 dark:border-white/10 rounded-sm focus:outline-none focus:border-luxury-gold transition-all text-sm w-96"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-luxury-gold hover:bg-luxury-gold/90 text-white px-8 py-3 rounded-sm transition-all shadow-xl hover:shadow-luxury-gold/30 active:scale-95"
          >
            <Plus size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Add New Room
            </span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-gold"></div>
            <p className="text-xs uppercase tracking-widest text-luxury-gold animate-pulse">
              Scanning Inventory...
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-luxury-charcoal/20 border border-black/5 dark:border-white/5 rounded-sm overflow-hidden shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-luxury-dark/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5">
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/60 dark:text-white/60">
                      Room No.
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/60 dark:text-white/60">
                      Category
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/60 dark:text-white/60">
                      rate per Night
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/60 dark:text-white/60">
                      Status
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/60 dark:text-white/60 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  <AnimatePresence>
                    {filteredRooms.length > 0 ? (
                      filteredRooms.map((room) => (
                        <motion.tr
                          key={room.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="group hover:bg-luxury-gold/5 transition-all duration-300"
                        >
                          <td className="px-8 py-6">
                            <span className="text-lg font-serif text-luxury-charcoal dark:text-white font-bold">
                              {room.roomNumber}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold">
                              {getCategoryName(room.roomCategoryId)}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-sm font-medium text-luxury-charcoal dark:text-white">
                              LKR {room.ratePerNight}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <span
                              className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                room.status === "available"
                                  ? "bg-green-500/10 text-green-500"
                                  : room.status === "booked"
                                    ? "bg-luxury-gold/10 text-luxury-gold"
                                    : room.status === "maintenance"
                                      ? "bg-orange-500/10 text-orange-500"
                                      : "bg-red-500/10 text-red-500"
                              }`}
                            >
                              {room.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleOpenViewModal(room)}
                                className="p-2.5 text-luxury-charcoal/40 dark:text-white/40 hover:text-blue-500 hover:bg-blue-500/10 rounded-full transition-all"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleOpenModal(room)}
                                className="p-2.5 text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-full transition-all"
                                title="Edit Room"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(room.id)}
                                className="p-2.5 text-luxury-charcoal/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                title="Delete Room"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center space-y-4">
                            <Search className="text-luxury-gold/20" size={48} />
                            <p className="text-luxury-charcoal/30 dark:text-white/30 text-sm font-medium">
                              No rooms found in the vault.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-luxury-dark/95 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-luxury-charcoal w-full max-w-4xl max-h-[90vh] rounded-sm shadow-2xl z-10 overflow-hidden border border-white/5 flex flex-col"
            >
              <div className="flex justify-between items-center p-8 border-b border-black/5 dark:border-white/5 bg-white dark:bg-luxury-charcoal text-luxury-charcoal dark:text-white">
                <div>
                  <h2 className="text-3xl font-serif mb-1">
                    {editingRoom
                      ? "Update Room details"
                      : "Create New Room"}
                  </h2>
                  <p className="text-[10px] text-luxury-gold uppercase tracking-[0.3em] font-bold">
                    Room Configuration page
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:text-luxury-gold transition-all"
                >
                  <X size={28} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar"
              >
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold">
                    Visual Assets (Upload 3 Images)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="space-y-3">
                        <div className="relative group">
                          <input
                            type="file"
                            id={`image${num}`}
                            onChange={(e) => handleFileChange(e, `image${num}`)}
                            className="hidden"
                            accept="image/*"
                          />
                          <label
                            htmlFor={`image${num}`}
                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-black/10 dark:border-white/10 rounded-sm hover:border-luxury-gold/50 cursor-pointer transition-all bg-luxury-dark/5 dark:bg-white/5 overflow-hidden"
                          >
                            {previews[`image${num}`] ? (
                              <img
                                src={previews[`image${num}`]}
                                alt={`Preview ${num}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center space-y-2 opacity-40">
                                <ImageIcon size={24} />
                                <span className="text-[8px] font-bold uppercase">
                                  Image {num}
                                </span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold">
                        Room Number
                      </label>
                      <input
                        type="text"
                        value={formData.roomNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            roomNumber: e.target.value,
                          })
                        }
                        placeholder="e.g. 301-A"
                        className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 focus:outline-none focus:border-luxury-gold transition-colors text-luxury-charcoal dark:text-white font-serif text-lg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold">
                        Category 
                      </label>
                      <select
                        value={formData.roomCategoryId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            roomCategoryId: e.target.value,
                          })
                        }
                        className="w-full bg-luxury-dark/5 dark:bg-white/5 border border-transparent p-3 focus:outline-none focus:border-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white text-sm rounded-sm"
                        required
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold">
                        Rate Per Night (LKR)
                      </label>
                      <input
                        type="number"
                        value={formData.ratePerNight}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ratePerNight: e.target.value,
                          })
                        }
                        placeholder="0.00"
                        className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 focus:outline-none focus:border-luxury-gold transition-colors text-luxury-charcoal dark:text-white text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Operational Info */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold">
                          Capacity (Guests)
                        </label>
                        <input
                          type="number"
                          value={formData.capacity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              capacity: e.target.value,
                            })
                          }
                          placeholder="2"
                          className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 focus:outline-none focus:border-luxury-gold transition-colors text-luxury-charcoal dark:text-white text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px) uppercase tracking-widest font-bold text-luxury-gold">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="w-full bg-luxury-dark/5 dark:bg-white/5 border border-transparent p-3 focus:outline-none focus:border-luxury-gold/50 transition-all text-luxury-charcoal dark:text-white text-sm rounded-sm"
                        >
                          <option value="available">Available</option>
                          <option value="booked">Booked</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold">
                        Bed type
                      </label>
                      <input
                        type="text"
                        value={formData.bedType}
                        onChange={(e) =>
                          setFormData({ ...formData, bedType: e.target.value })
                        }
                        placeholder="e.g. King-size, Twin XL"
                        className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 focus:outline-none focus:border-luxury-gold transition-colors text-luxury-charcoal dark:text-white text-sm"
                      />
                    </div>

                    <div className="flex items-center space-x-3 pt-4">
                      <div
                        onClick={() =>
                          setFormData({ ...formData, ac: !formData.ac })
                        }
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${formData.ac ? "bg-luxury-gold" : "bg-black/20 dark:bg-white/10"}`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${formData.ac ? "translate-x-6" : ""}`}
                        ></div>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/60 dark:text-white/60">
                        Air Conditioned
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold">
                      Amenities (Comma separated)
                    </label>
                    <textarea
                      value={formData.amenities}
                      onChange={(e) =>
                        setFormData({ ...formData, amenities: e.target.value })
                      }
                      placeholder="Mini-bar, Ocean view Balcony, Wi-Fi..."
                      className="w-full bg-luxury-dark/5 dark:bg-white/5 border border-transparent p-4 focus:outline-none focus:border-luxury-gold/30 transition-all text-luxury-charcoal dark:text-white text-sm h-24 resize-none rounded-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold">
                      Internal Administrative Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Special instructions or history..."
                      className="w-full bg-luxury-dark/5 dark:bg-white/5 border border-transparent p-4 focus:outline-none focus:border-luxury-gold/30 transition-all text-luxury-charcoal dark:text-white text-sm h-24 resize-none rounded-sm"
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-black/5 dark:border-white/5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-luxury-gold text-white py-5 rounded-sm font-bold uppercase tracking-[0.25em] text-xs transition-all shadow-2xl active:scale-[0.98] ${isSubmitting ? "opacity-70 cursor-not-allowed shadow-none" : "hover:bg-luxury-gold/90 shadow-luxury-gold/40"}`}
                  >
                    {isSubmitting
                      ? "Syncing with mainframe..."
                      : editingRoom
                        ? "Commit Changes"
                        : "Initialize Room Entry"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedRoom && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-luxury-dark/95 backdrop-blur-md"
              onClick={() => setIsViewModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white dark:bg-luxury-dark w-full h-full md:h-[95vh] md:max-w-[95vw] md:rounded-sm shadow-2xl z-10 overflow-hidden border border-white/5 flex flex-col md:flex-row"
            >
              {/* Left Side: Visual Experience */}
              <div className="w-full md:w-[45%] h-[40vh] md:h-full relative bg-luxury-dark border-r border-white/5 overflow-hidden">
                <div className="absolute inset-0 flex flex-col">
                  {[
                    selectedRoom.image1,
                    selectedRoom.image2,
                    selectedRoom.image3,
                  ].filter(Boolean).length > 0 ? (
                    [
                      selectedRoom.image1,
                      selectedRoom.image2,
                      selectedRoom.image3,
                    ].map(
                      (img, i) =>
                        img && (
                          <div
                            key={i}
                            className="flex-1 relative overflow-hidden group border-b border-white/5"
                          >
                            <img
                              src={`${BASE_URL}${img}`}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                              alt={`Room Perspective ${i + 1}`}
                            />
                          </div>
                        ),
                    )
                  ) : (
                    <div className="w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                  )}
                </div>

                {/* Visual Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent pointer-events-none"></div>

                <div className="absolute bottom-12 left-12 z-10 hidden md:block">
                  <span className="text-[12px] uppercase tracking-[0.6em] text-luxury-gold font-black mb-4 block">
                    Room Number
                  </span>
                  <h2 className="text-8xl font-serif text-white tracking-tighter leading-none mb-4">
                    {selectedRoom.roomNumber}
                  </h2>
                  <div className="h-[2px] w-24 bg-luxury-gold"></div>
                </div>

                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="absolute top-8 left-8 p-3 text-white/50 hover:text-white transition-all z-30 bg-black/40 rounded-full md:hidden"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Right Side: Administrative Profile */}
              <div className="flex-1 flex flex-col h-full bg-luxury-cream/30 dark:bg-luxury-dark transition-colors duration-500 relative">
                {/* Desktop Close Button */}
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="absolute top-10 right-10 p-2 text-luxury-charcoal/30 dark:text-white/30 hover:text-luxury-gold transition-all z-30 hidden md:block"
                >
                  <X size={40} strokeWidth={1} />
                </button>

                <div className="p-8 md:p-20 overflow-y-auto custom-scrollbar flex-1">
                  <header className="mb-16">
                    <div className="flex items-center space-x-4 text-luxury-gold mb-6">
                      <span className="w-12 h-[1px] bg-luxury-gold"></span>
                      <span className="text-[10px] uppercase tracking-[0.5em] font-black">
                        Room Specification Profile
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-luxury-charcoal dark:text-white tracking-tight mb-2">
                      Detailed Overview
                    </h1>
                    <p className="text-luxury-charcoal/40 dark:text-white/40 font-medium italic">
                      Internal System Record ID: {selectedRoom.id}
                    </p>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                    <div className="space-y-12">
                      <section>
                        <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-black mb-4 flex items-center">
                          <Info size={14} className="mr-2" /> Info
                        </p>
                        <div className="space-y-8">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 font-bold mb-1">
                              Asset Category
                            </p>
                            <p className="text-3xl font-serif text-luxury-charcoal dark:text-white">
                              {getCategoryName(selectedRoom.roomCategoryId)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 font-bold mb-1">
                              Nightly Valuation
                            </p>
                            <p className="text-3xl font-serif text-luxury-charcoal dark:text-white">
                              LKR {selectedRoom.ratePerNight}{" "}
                              <span className="text-sm font-sans text-luxury-charcoal/30 uppercase tracking-widest">
                                LKR
                              </span>
                            </p>
                          </div>
                        </div>
                      </section>

                      <section>
                        <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-black mb-4">
                          Operational Status
                        </p>
                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] ${
                              selectedRoom.status === "available"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : selectedRoom.status === "booked"
                                  ? "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20"
                                  : "bg-red-500/10 text-red-500 border border-red-500/20"
                            }`}
                          >
                            {selectedRoom.status}
                          </span>
                        </div>
                      </section>
                    </div>

                    <div className="space-y-12">
                      <section>
                        <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-black mb-4 flex items-center">
                          <Settings size={14} className="mr-2" /> Configuration
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 font-bold mb-1">
                              Capacity
                            </p>
                            <p className="text-xl font-serif text-luxury-charcoal dark:text-white">
                              {selectedRoom.capacity} PAX
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 font-bold mb-1">
                              Bed Type
                            </p>
                            <p className="text-xl font-serif text-luxury-charcoal dark:text-white capitalize">
                              {selectedRoom.bedType || "N/A"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[9px] uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40 font-bold mb-1">
                              Climate Control
                            </p>
                            <div className="flex items-center space-x-2 text-luxury-charcoal dark:text-white">
                              {selectedRoom.ac ? (
                                <Check className="text-green-500" size={16} />
                              ) : (
                                <AlertCircle
                                  className="text-red-400"
                                  size={16}
                                />
                              )}
                              <span className="text-sm font-bold uppercase tracking-widest">
                                {selectedRoom.ac
                                  ? "Full HVAC System"
                                  : "Natural Ventilation"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>

                  <div className="space-y-16 border-t border-black/5 dark:border-white/5 pt-16">
                    {selectedRoom.amenities && (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-black mb-6">
                          Signature Amenities
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedRoom.amenities
                            .split(",")
                            .map((amenity, i) => (
                              <div
                                key={i}
                                className="flex items-center space-x-3 text-luxury-charcoal/60 dark:text-white/60"
                              >
                                <div className="w-1 h-1 bg-luxury-gold rounded-full"></div>
                                <span className="text-xs uppercase tracking-widest font-bold">
                                  {amenity.trim()}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {selectedRoom.notes && (
                      <div className="bg-luxury-dark/5 dark:bg-white/5 p-12 rounded-sm border border-black/5 dark:border-white/5">
                        <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-black mb-6">
                          Management Directives
                        </p>
                        <p className="text-xl font-serif italic text-luxury-charcoal/80 dark:text-white/80 leading-relaxed">
                          "{selectedRoom.notes}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-24 pt-10 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="hidden lg:block">
                      <p className="text-[10px] uppercase tracking-widest text-luxury-charcoal/30 dark:text-white/30 font-bold italic">
                        Generated by Ocean View Resort Admin Authority System
                      </p>
                    </div>
                    <div className="flex space-x-4 w-full md:w-auto">
                      <button
                        onClick={() => setIsViewModalOpen(false)}
                        className="flex-1 md:flex-none px-10 py-5 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      >
                        Exit Archive
                      </button>
                      <button
                        onClick={() => {
                          setIsViewModalOpen(false);
                          handleOpenModal(selectedRoom);
                        }}
                        className="flex-1 md:flex-none bg-luxury-gold text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-luxury-gold/80 transition-all shadow-2xl shadow-luxury-gold/20"
                      >
                        Modify Asset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminRooms;
