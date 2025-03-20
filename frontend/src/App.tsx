import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
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

const queryClient = new QueryClient();

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { data: user, isLoading } = useQuery<User>({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await authService.getCurrentUser();
            console.log('ProtectedAdminRoute - getCurrentUser response:', response);
            return response.data;
        },
        retry: false,
    });

    if (isLoading) {
        console.log('ProtectedAdminRoute - загрузка данных пользователя');
        return <div>Загрузка...</div>;
    }

    console.log('ProtectedAdminRoute - полученные данные пользователя:', user);

    if (!user) {
        console.log('ProtectedAdminRoute - нет данных пользователя, перенаправление на главную');
        return <Navigate to="/" replace />;
    }

    if (user.admin_status !== 'admin') {
        console.log('ProtectedAdminRoute - пользователь не админ:', user.admin_status, 'перенаправление на главную');
        return <Navigate to="/" replace />;
    }

    console.log('ProtectedAdminRoute - доступ разрешен, отображение панели администратора');
    return <>{children}</>;
};

const App = () => {
    const queryClient = useQueryClient();
    const { data: user, isLoading } = useQuery<User>({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await authService.getCurrentUser();
            return response.data;
        },
        retry: false,
    });

    console.log('App - user:', user);

    useEffect(() => {
        // Инициализируем токен при загрузке приложения
        const token = localStorage.getItem('token');
        if (token) {
            authService.setAuthToken(token);
        }
    }, []);

    const handleLogout = async () => {
        try {
            console.log('Logout button clicked');
            await authService.logout();
            // Инвалидируем кэш запроса пользователя после выхода
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <nav className="bg-white shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex items-center">
                                    <Link to="/" className="text-2xl font-bold text-indigo-600">
                                        СОТЫ
                                    </Link>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Link to="/events" className="text-gray-700 hover:text-indigo-600">
                                        События
                                    </Link>
                                    {!isLoading && user && (
                                        <>
                                            <Link to="/profile" className="text-gray-700 hover:text-indigo-600">
                                                Профиль
                                            </Link>
                                            {user.admin_status === 'admin' && (
                                                <Link to="/admin-panel" className="text-gray-700 hover:text-indigo-600">
                                                    Админ
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="text-gray-700 hover:text-indigo-600"
                                            >
                                                Выйти
                                            </button>
                                        </>
                                    )}
                                    {!isLoading && !user && (
                                        <>
                                            <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                                                Войти
                                            </Link>
                                            <Link
                                                to="/register"
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                            >
                                                Регистрация
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>

                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <Routes>
                            <Route path="/" element={<Main />} />
                            <Route path="/events" element={<Home />} />
                            <Route path="/events/:id" element={<EventDetails />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/admin-panel"
                                element={
                                    <ProtectedAdminRoute>
                                        <AdminDashboard />
                                    </ProtectedAdminRoute>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
            <Toaster position="top-right" />
        </QueryClientProvider>
    );
};

export default App; 