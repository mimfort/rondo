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
import AdminDashboard from './pages/AdminDashboard';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import ErrorPage from './components/ErrorPage';

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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { data: user, isLoading } = useQuery<User>({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await authService.getCurrentUser();
            return response.data;
        },
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { data: user, isLoading } = useQuery<User>({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await authService.getCurrentUser();
            return response.data;
        },
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user || user.admin_status !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
            <Route index element={<Main />} />
            <Route path="events" element={<Home />} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="admin-panel" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
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