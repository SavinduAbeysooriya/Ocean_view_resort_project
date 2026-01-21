import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import { 
  LayoutDashboard, Users, Hotel, Calendar, Settings, LogOut, 
  Plus, Edit2, Trash2, X, Image as ImageIcon, Search, ChevronRight
} from 'lucide-react';
import { Link,useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import axios from 'axios';

const RoomCategories = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = 'http://localhost:8080/api/room-categories';
  const BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        category: category.category,
        description: category.description,
      });
      setImagePreview(category.categoryImage ? `${BASE_URL}${category.categoryImage}` : null);
      setSelectedFile(null);
    } else {
      setEditingCategory(null);
      setFormData({
        category: '',
        description: '',
      });
      setImagePreview(null);
      setSelectedFile(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting category data:', formData);
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token missing. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      const data = new FormData();
      data.append('category', formData.category);
      data.append('description', formData.description);
      if (selectedFile) {
        data.append('image', selectedFile);
      }
      
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      };
      
      console.log('Sending request to:', editingCategory ? `${API_URL}/${editingCategory.id}` : API_URL);
      
      if (editingCategory) {
        await axios.put(`${API_URL}/${editingCategory.id}`, data, config);
        alert('Category updated successfully!');
      } else {
        await axios.post(API_URL, data, config);
        alert('Category created successfully!');
      }
      
      await fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert(`Failed to save category: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-luxury-cream dark:bg-luxury-dark transition-colors duration-300 flex">
      {/* Sidebar */}
    <AdminSidebar activePage="dashboard" />
      {/* Main Content */}
      <main className="flex-1 ml-64 p-12 min-h-screen">
        <AdminHeader 
          subtitle="Category Management"
          title="Room Categories"
          description="Manage your luxury suite categories and descriptions"
        />

        {/* Action Toolbar */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-charcoal/30 dark:text-white/30" size={16} />
            <input 
              type="text" 
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white dark:bg-luxury-charcoal/20 border border-black/10 dark:border-white/10 rounded-sm focus:outline-none focus:border-luxury-gold transition-all text-sm w-80"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-luxury-gold hover:bg-luxury-gold/90 text-white px-8 py-3 rounded-sm transition-all shadow-xl hover:shadow-luxury-gold/30 active:scale-95"
          >
            <Plus size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Add New Category</span>
          </button>
        </div>

        {/* Categories Table */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-gold"></div>
            <p className="text-xs uppercase tracking-widest text-luxury-gold animate-pulse">Loading Collection...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-luxury-charcoal/20 border border-black/5 dark:border-white/5 rounded-sm overflow-hidden shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-luxury-dark/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5">
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/60 dark:text-white/60"> Image</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/60 dark:text-white/60">Category </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/60 dark:text-white/60">Description </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-luxury-charcoal/60 dark:text-white/60 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  <AnimatePresence>
                    {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
                      <motion.tr 
                        key={cat.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-luxury-gold/5 transition-all duration-300"
                      >
                        <td className="px-8 py-6">
                          <div className="relative w-24 h-16 rounded-sm overflow-hidden group-hover:scale-105 transition-transform duration-500 border border-black/5 dark:border-white/10">
                            {cat.categoryImage ? (
                              <img 
                                src={`${BASE_URL}${cat.categoryImage}`} 
                                alt={cat.category} 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                  if (!e.target.src.includes('http') && cat.categoryImage.startsWith('http')) {
                                    e.target.src = cat.categoryImage;
                                  } else {
                                    e.target.parentNode.innerHTML = '<div class="w-full h-full bg-luxury-dark/5 dark:bg-white/5 flex items-center justify-center"><svg class="text-luxury-charcoal/20 dark:text-white/20" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>';
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-luxury-dark/5 dark:bg-white/5 flex items-center justify-center">
                                <ImageIcon className="text-luxury-charcoal/20 dark:text-white/20" size={20} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6 font-serif">
                          <span className="text-lg text-luxury-charcoal dark:text-white group-hover:text-luxury-gold transition-colors">{cat.category}</span>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs text-luxury-charcoal/50 dark:text-white/40 line-clamp-2 max-w-sm leading-relaxed">{cat.description}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => handleOpenModal(cat)}
                              className="p-2.5 text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-full transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(cat.id)}
                              className="p-2.5 text-luxury-charcoal/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center space-y-4">
                            <Search className="text-luxury-gold/20" size={48} />
                            <p className="text-luxury-charcoal/30 dark:text-white/30 text-sm font-medium">No categories found matching your request.</p>
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

      {/* Modal - FIXED SCROLL ISSUE */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-luxury-dark/90 backdrop-blur-md"
              onClick={handleCloseModal}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-luxury-charcoal w-full max-w-2xl max-h-[90vh] rounded-sm shadow-2xl z-10 overflow-hidden border border-white/5 flex flex-col"
            >
              <div className="flex justify-between items-center p-8 border-b border-black/5 dark:border-white/5 sticky top-0 bg-white dark:bg-luxury-charcoal z-20">
                <div>
                  <h2 className="text-3xl font-serif text-luxury-charcoal dark:text-white mb-1">
                    {editingCategory ? 'Modify Category' : 'New Collection'}
                  </h2>
                  <p className="text-xs text-luxury-gold uppercase tracking-widest font-bold">Room Category configuration</p>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 text-luxury-charcoal/40 dark:text-white/40 hover:text-luxury-gold hover:rotate-90 transition-all duration-300"
                >
                  <X size={28} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-gold">Category Title</label>
                    <input 
                      type="text" 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      placeholder="e.g. Royal Presidential Suite"
                      className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-4 focus:outline-none focus:border-luxury-gold transition-colors text-luxury-charcoal dark:text-white font-serif text-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-gold">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe the luxury and comfort..."
                      className="w-full bg-luxury-dark/5 dark:bg-white/5 border border-transparent p-4 focus:outline-none focus:border-luxury-gold/30 transition-all text-luxury-charcoal dark:text-white h-40 resize-none rounded-sm"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-gold block">Image </label>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative flex-1">
                        <input 
                          type="file" 
                          id="category-image"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                        <label 
                          htmlFor="category-image"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-black/10 dark:border-white/10 rounded-sm hover:border-luxury-gold/50 cursor-pointer transition-all bg-luxury-dark/5 dark:bg-white/5"
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <ImageIcon className="text-luxury-charcoal/20 dark:text-white/20" size={32} />
                            <p className="text-[10px] text-luxury-charcoal/40 dark:text-white/40 uppercase font-bold tracking-widest text-center px-4">
                              {selectedFile ? selectedFile.name : 'Upload Image'}
                            </p>
                          </div>
                        </label>
                      </div>
                      
                      {imagePreview && (
                        <div className="relative w-full md:w-48 h-48 rounded-sm overflow-hidden border border-black/5 dark:border-white/10 group">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-black/5 dark:border-white/5">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-luxury-gold text-white py-5 rounded-sm font-bold uppercase tracking-[0.25em] text-xs transition-all shadow-2xl active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed shadow-none' : 'hover:bg-luxury-gold/90 shadow-luxury-gold/40'}`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Archiving...
                      </span>
                    ) : (
                      editingCategory ? 'Update Collection' : 'Add Category'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomCategories;
