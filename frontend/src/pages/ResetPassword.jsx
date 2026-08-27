import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post(`${API_URL}/auth/reset-password`, { 
                token, 
                password 
            });
            setStatus({ type: 'success', message: 'Password reset successful! Redirecting to login...' });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setStatus({ 
                type: 'error', 
                message: err.response?.data || 'Reset failed. Token may be invalid or expired.' 
            });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-luxury-cream dark:bg-luxury-dark">
                <div className="text-center p-10 bg-white dark:bg-luxury-charcoal/40 rounded-sm shadow-xl">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-xl dark:text-white font-serif mb-4">Invalid Reset Link</h2>
                    <button onClick={() => navigate('/login')} className="text-luxury-gold hover:underline uppercase tracking-widest text-xs font-bold">Back to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 bg-luxury-cream dark:bg-luxury-dark flex items-center justify-center px-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="bg-white dark:bg-luxury-charcoal/40 p-10 rounded-sm shadow-2xl backdrop-blur-sm border border-black/5 dark:border-white/5">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-serif text-luxury-charcoal dark:text-white mb-2">New Password</h1>
                        <p className="text-luxury-charcoal/50 dark:text-white/50 text-sm">Please enter your new secure password</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 font-bold ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={18} />
                                <input 
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 pl-10 pr-4 py-3 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-luxury-charcoal/50 dark:text-white/50 font-bold ml-1">Confirm New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={18} />
                                <input 
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 pl-10 pr-4 py-3 text-luxury-charcoal dark:text-white outline-none focus:border-luxury-gold transition-all"
                                    placeholder="••••••••"
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
                                {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                <span>{status.message}</span>
                            </motion.div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-luxury-gold text-white font-bold uppercase tracking-[0.2em] text-xs rounded-sm hover:bg-yellow-600 transition-all flex items-center justify-center space-x-2 shadow-lg"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Update Password</span>}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
