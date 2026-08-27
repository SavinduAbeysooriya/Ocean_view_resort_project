import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { API_URL } from '../config/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login...', formData.email);
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      console.log('Login response:', response.data);
      login(response.data, response.data.accessToken);
    } catch (err) {
      console.error('Login error details:', err);
      const errorMsg = typeof err.response?.data === 'string' && err.response.data.trim() !== ''
        ? err.response.data 
        : err.response?.data?.message || 'Login failed. Please check your connection or credentials.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      console.log('Attempting Google login...');
      const response = await axios.post(`${API_URL}/auth/google`, {
        token: credentialResponse.credential
      });
      console.log('Google login response:', response.data);
      login(response.data, response.data.accessToken);
    } catch (err) {
      console.error('Google login error details:', err);
      const errorMsg = typeof err.response?.data === 'string' && err.response.data.trim() !== ''
        ? err.response.data 
        : err.response?.data?.message || 'Google login failed. Please try again.';
      setError(errorMsg);
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
            <h1 className="text-3xl font-serif text-luxury-charcoal dark:text-white mb-2">Welcome Back</h1>
            <p className="text-luxury-charcoal/50 dark:text-white/50 text-sm">Please enter your details to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 pl-10 pr-4 py-3 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold transition-all"
                  placeholder="email@example.com"
                />
              </div>
            </div>

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
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 pl-10 pr-4 py-3 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" size="sm" className="text-[10px] text-luxury-gold uppercase tracking-widest font-bold hover:underline">Forgot Password?</Link>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 text-red-500 border border-red-500/20 text-xs rounded-sm">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-luxury-gold text-white font-bold uppercase tracking-[0.2em] text-xs rounded-sm hover:bg-yellow-600 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  <LogIn size={18} />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/5 dark:border-white/5"></div>
            </div>
            <span className="relative z-10 bg-white dark:bg-[#151515] px-4 text-[10px] uppercase tracking-widest text-luxury-charcoal/40 dark:text-white/40">Or continue with</span>
          </div>

          <div className="mt-8 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Login Failed')}
              useOneTap
              theme="filled_black"
              shape="square"
            />
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-luxury-charcoal/50 dark:text-white/50 uppercase tracking-widest">
              Don't have an account? <Link to="/register" className="text-luxury-gold font-bold hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
