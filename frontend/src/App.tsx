import React, { useEffect } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
    Route,
    Navigate,
    Outlet
} from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { authService } from './api/services';
import type { User } from './types';
import Main from './pages/Main';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminCoworking from './pages/admin/AdminCoworking';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import ErrorPage from './components/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Coworking from './pages/Coworking';
import Courts from './pages/Courts';
import CourtsAdmin from './pages/admin/CourtsAdmin';
import CourtReservationsAdmin from './pages/admin/CourtReservationsAdmin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PublicOffer from './pages/PublicOffer';

const Layout = () => {
    return (
        <ThemeProvider>
            <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-200">
                <Navbar />
                <main className="flex-grow">
                    <AnimatePresence mode="wait">
                        <Outlet />
                    </AnimatePresence>
                </main>
                <Footer />
                <Toaster position="top-right" />
            </div>
        </ThemeProvider>
    );
};

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
            <Route index element={<PageTransition><Main /></PageTransition>} />
            <Route path="events" element={<PageTransition><Home /></PageTransition>} />
            <Route path="courts" element={<PageTransition><Courts /></PageTransition>} />
            <Route path="profile" element={
                <ProtectedRoute>
                    <PageTransition><Profile /></PageTransition>
                </ProtectedRoute>
            } />
            <Route path="events/:id" element={<PageTransition><EventDetails /></PageTransition>} />
            <Route path="coworking" element={<PageTransition><Coworking /></PageTransition>} />
            <Route path="admin-panel/*" element={
                <AdminRoute>
                    <PageTransition><AdminDashboard /></PageTransition>
                </AdminRoute>
            }>
                <Route path="events" element={<AdminEvents />} />
                <Route path="coworking" element={<AdminCoworking />} />
                <Route path="courts" element={<CourtsAdmin />} />
                <Route path="court-reservations" element={<CourtReservationsAdmin />} />
            </Route>
            <Route path="login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route path="reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
            <Route path="privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
            <Route path="public-offer" element={<PageTransition><PublicOffer /></PageTransition>} />
            <Route path="*" element={<Navigate to="/" />} />
        </Route>
    ),
    {
        future: {
            v7_startTransition: true,
            v7_relativeSplatPath: true
        } as any
    }
);

const App: React.FC = () => {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authService.setAuthToken(token);
        }
    }, []);

    return <RouterProvider router={router} />;
};

export default App;