import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './utils/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Rooms from './pages/Rooms';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import FAQ from './pages/FAQ';
import AdminDashboard from './pages/admin/AdminDashboard';
import RoomCategories from './pages/admin/RoomCategories';
import StaffDashboard from './pages/staff/StaffDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

const GOOGLE_CLIENT_ID = "707866377438-20640dlhedfh63fu8iqot6n8394vp9mo.apps.googleusercontent.com";

const App = () => {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Router>
                <AuthProvider>
                    <Routes>
                        {/* Public Routes with Main Layout */}
                        <Route path="/" element={<Layout><Home /></Layout>} />
                        <Route path="/contact" element={<Layout><Contact /></Layout>} />
                        <Route path="/rooms" element={<Layout><Rooms /></Layout>} />
                        <Route path="/login" element={<Layout><Login /></Layout>} />
                        <Route path="/register" element={<Layout><Register /></Layout>} />
                        <Route path="/about" element={<Layout><About /></Layout>} />
                        <Route path="/faq" element={<Layout><FAQ /></Layout>} />

                        {/* Admin Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/room-categories" element={<RoomCategories />} />
                        </Route>

                        {/* Staff Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['ROLE_STAFF']} />}>
                            <Route path="/staff/dashboard" element={<StaffDashboard />} />
                        </Route>

                        {/* Catch all */}
                        <Route path="*" element={<Layout><Home /></Layout>} />
                    </Routes>
                </AuthProvider>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
