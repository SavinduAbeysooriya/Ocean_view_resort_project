import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../utils/AuthContext";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { Edit2, Trash2, Plus, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL as BASE_API_URL } from "../../config/api";

const AdminUsers = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "STAFF",
  });

  const API_URL = `${BASE_API_URL}/users`;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Adjust payload based on create or update
      const payload = { ...formData };
      if (!payload.password) delete payload.password; // Don't send empty password on update

      if (currentUser) {
        await axios.put(`${API_URL}/${currentUser.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("User updated successfully");
      } else {
        await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("User created successfully");
      }
      setIsModalOpen(false);
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      const errorMessage = error.response?.data
        ? typeof error.response.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response.data
        : error.message;
      alert("Failed to save user: " + errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({ username: "", email: "", password: "", role: "STAFF" });
    setCurrentUser(null);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "", // Keep empty for security
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-500 flex selection:bg-luxury-gold selection:text-white font-sans">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-12 min-h-screen pt-20 lg:pt-12">
        <AdminHeader
          subtitle="System Administration"
          title="User Management"
          description="Manage admins, staff, and guests."
        />

        {/* Action Toolbar */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-96 pl-12 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-sm focus:outline-none focus:border-luxury-gold text-luxury-charcoal dark:text-white transition-colors"
            />
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-3 bg-luxury-gold hover:bg-yellow-600 text-white px-8 py-3 rounded-sm transition-all shadow-xl hover:shadow-luxury-gold/20"
          >
            <Plus size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Add User
            </span>
          </button>
        </div>

        <div className="bg-white dark:bg-luxury-charcoal p-8 rounded-sm shadow-xl border border-black/5 dark:border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10">
                  <th className="text-left py-6 px-4 text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60">
                    User Info
                  </th>
                  <th className="text-left py-6 px-4 text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60">
                    Role
                  </th>
                  <th className="text-right py-6 px-4 text-[10px] font-bold uppercase tracking-widest text-luxury-charcoal/60 dark:text-white/60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold font-bold uppercase">
                          {u.username.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-luxury-charcoal dark:text-white">
                            {u.username}
                          </p>
                          <p className="text-sm text-luxury-charcoal/40 dark:text-white/40">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                            : u.role === "STAFF"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-2 text-gray-400 hover:text-luxury-gold transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      {user?.id !== u.id && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-luxury-charcoal w-full max-w-md rounded-sm shadow-2xl p-8 border-t-4 border-luxury-gold relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-serif text-center mb-8 text-luxury-charcoal dark:text-white">
                {currentUser ? "Edit User" : "Create New User"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-luxury-charcoal/60 dark:text-white/60">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full bg-transparent border border-black/10 dark:border-white/10 p-4 rounded-sm focus:border-luxury-gold outline-none text-luxury-charcoal dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-luxury-charcoal/60 dark:text-white/60">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-transparent border border-black/10 dark:border-white/10 p-4 rounded-sm focus:border-luxury-gold outline-none text-luxury-charcoal dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-luxury-charcoal/60 dark:text-white/60">
                    Password{" "}
                    {currentUser && (
                      <span className="text-luxury-gold lowercase font-normal">
                        (leave empty to keep current)
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    required={!currentUser}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full bg-transparent border border-black/10 dark:border-white/10 p-4 rounded-sm focus:border-luxury-gold outline-none text-luxury-charcoal dark:text-white transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-luxury-charcoal/60 dark:text-white/60">
                    Role Access
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full bg-transparent border border-black/10 dark:border-white/10 p-4 rounded-sm focus:border-luxury-gold outline-none text-luxury-charcoal dark:text-white transition-colors"
                  >
                    <option value="STAFF" className="text-black">
                      Staff
                    </option>
                    <option value="ADMIN" className="text-black">
                      Administrator
                    </option>
                    <option value="CUSTOMER" className="text-black">
                      Customer
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-luxury-gold text-white font-bold uppercase tracking-widest text-[10px] py-4 rounded-sm hover:bg-yellow-600 transition-colors shadow-lg mt-4"
                >
                  {currentUser ? "Update User Access" : "Create Account"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
