import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post(`${API_URL}/auth/forgot-password`, { email });
            setStatus({ 
                type: 'success', 
                message: 'If an account exists with that email, a password reset link has been sent.' 
            });
        } catch (err) {
            setStatus({ 
                type: 'error', 
                message: 'Failed to send reset link. Please try again later.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-luxury-cream dark:bg-luxury-dark flex items-center justify-center px-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="bg-white dark:bg-luxury-charcoal/40 p-10 rounded-sm shadow-2xl backdrop-blur-sm border border-black/5 dark:border-white/5">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-serif text-luxury-charcoal dark:text-white mb-2">Forgot Password</h1>
                        <p className="text-luxury-charcoal/50 dark:text-white/50 text-sm">Enter your email and we'll send you a reset link</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 font-bold ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold group-focus-within:scale-110 transition-transform" size={18} />
                                <input 
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 pl-10 pr-4 py-3 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold transition-all"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        {status.message && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`p-4 text-xs rounded-sm flex items-center space-x-2 ${
                                    status.type === 'success' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                }`}
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
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Send Reset Link</span>}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-black/5 dark:border-white/5 pt-8">
                        <Link to="/login" className="text-xs text-luxury-charcoal/50 dark:text-white/50 uppercase tracking-[0.2em] hover:text-luxury-gold transition-colors flex items-center justify-center space-x-2 group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Login</span>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
