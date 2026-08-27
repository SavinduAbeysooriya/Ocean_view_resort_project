import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../utils/AuthContext';
import { API_URL } from '../config/api';

const Register = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    if (formData.password.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.post(`${API_URL}/auth/signup`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      setStatus({ type: 'success', message: 'Registration successful! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMsg = typeof err.response?.data === 'string' 
        ? err.response.data 
        : err.response?.data?.message || 'Registration failed. Please try again.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      console.log('Attempting Google signup...');
      const response = await axios.post(`${API_URL}/auth/google`, {
        token: credentialResponse.credential,
      });
      console.log('Google signup response:', response.data);
      login(response.data, response.data.accessToken);
    } catch (err) {
      console.error('Google signup error details:', err);
      const errorMsg = typeof err.response?.data === 'string' && err.response.data.trim() !== ''
        ? err.response.data 
        : err.response?.data?.message || 'Google signup failed. Please try again.';
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-luxury-cream dark:bg-luxury-dark transition-colors duration-300 flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-luxury-charcoal/40 p-10 rounded-sm shadow-2xl backdrop-blur-sm border border-black/5 dark:border-white/5">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif text-luxury-charcoal dark:text-white mb-2">Join Ocean View</h1>
            <p className="text-luxury-charcoal/50 dark:text-white/50 text-sm">Experience the pinnacle of coastal luxury</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 font-bold">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={18} />
                <input 
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 pl-10 pr-4 py-3 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold transition-all placeholder:text-luxury-charcoal/20 dark:placeholder:text-white/20"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={18} />
                <input 
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 pl-10 pr-4 py-3 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold transition-all placeholder:text-luxury-charcoal/20 dark:placeholder:text-white/20"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 font-bold">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={18} />
                        <input 
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 pl-10 pr-4 py-3 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold transition-all placeholder:text-luxury-charcoal/20 dark:placeholder:text-white/20"
                        placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 font-bold">Confirm</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={18} />
                        <input 
                        type="password"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 pl-10 pr-4 py-3 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold transition-all placeholder:text-luxury-charcoal/20 dark:placeholder:text-white/20"
                        placeholder="••••••••"
                        />
                    </div>
                </div>
            </div>

            {status.message && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={cn(
                    "p-4 text-xs rounded-sm flex items-center space-x-2",
                    status.type === 'success' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                )}
              >
                {status.type === 'success' && <CheckCircle2 size={14} />}
                <span>{status.message}</span>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-luxury-gold text-white font-bold uppercase tracking-[0.2em] text-xs rounded-sm hover:bg-yellow-600 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/5 dark:border-white/5"></div>
            </div>
            <span className="relative z-10 bg-white dark:bg-[#151515] px-4 text-[10px] uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">
              Or join with
            </span>
          </div>

          <div className="mt-8 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setStatus({ type: 'error', message: 'Google Sign up Failed' })}
              useOneTap
              theme="filled_black"
              shape="square"
            />
          </div>

          <div className="mt-10 text-center border-t border-black/5 dark:border-white/5 pt-8">
            <p className="text-xs text-luxury-charcoal/50 dark:text-white/50 uppercase tracking-widest">
              Already have an account? <Link to="/login" className="text-luxury-gold font-bold hover:underline">Log In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to merge classes
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default Register;
