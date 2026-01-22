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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Gallery from './pages/Gallery';
import RoomDetail from './pages/RoomDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AdminDashboard from './pages/admin/AdminDashboard';
import RoomCategories from './pages/admin/RoomCategories';
import AdminRooms from './pages/admin/Rooms';
import AdminReservations from './pages/admin/Reservations';
import AdminUsers from './pages/admin/Users';
import StaffDashboard from './pages/staff/StaffDashboard';
import Profile from './pages/customer/Profile';
import InvoicePage from './pages/customer/InvoicePage';
import Help from './pages/Help';
import AdminHelp from './pages/admin/AdminHelp';
import StaffHelp from './pages/staff/StaffHelp';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/utils/ScrollToTop';

const GOOGLE_CLIENT_ID = "707866377438-20640dlhedfh63fu8iqot6n8394vp9mo.apps.googleusercontent.com";

const App = () => {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Router>
                <ScrollToTop />
                <AuthProvider>
                    <Routes>
                        {/* Public Routes with Main Layout */}
                        <Route path="/" element={<Layout><Home /></Layout>} />
                        <Route path="/contact" element={<Layout><Contact /></Layout>} />
                        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
                        <Route path="/rooms" element={<Layout><Rooms /></Layout>} />
                        <Route path="/rooms/:id" element={<Layout><RoomDetail /></Layout>} />
                        <Route path="/login" element={<Layout><Login /></Layout>} />
                        <Route path="/register" element={<Layout><Register /></Layout>} />
                        <Route path="/about" element={<Layout><About /></Layout>} />
                        <Route path="/help" element={<Layout><Help /></Layout>} />
                        <Route path="/faq" element={<Layout><FAQ /></Layout>} />
                        <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
                        <Route path="/terms-of-service" element={<Layout><TermsOfService /></Layout>} />
                        <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Admin Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/room-categories" element={<RoomCategories />} />
                            <Route path="/admin/rooms" element={<AdminRooms />} />
                            <Route path="/admin/reservations" element={<AdminReservations />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/admin/help" element={<AdminHelp />} />
                        </Route>

                        {/* Staff Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['ROLE_STAFF']} />}>
                            <Route path="/staff/dashboard" element={<StaffDashboard />} />
                            <Route path="/staff/help" element={<StaffHelp />} />
                        </Route>

                        {/* Customer Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']} />}>
                            <Route path="/profile" element={<Layout><Profile /></Layout>} />
                            <Route path="/profile/invoice/:reservationId" element={<InvoicePage />} />
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
