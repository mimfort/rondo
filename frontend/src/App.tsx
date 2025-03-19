import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { authService } from './api/services';
import Main from './pages/Main';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

const queryClient = new QueryClient();

const App = () => {
    const queryClient = useQueryClient();
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => authService.getCurrentUser(),
        retry: false,
    });

    const handleLogout = async () => {
        try {
            console.log('Logout button clicked');
            await authService.logout();
            // Инвалидируем кэш запроса пользователя после выхода
            queryClient.invalidateQueries({ queryKey: ['user'] });
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
                                    {user && (
                                        <Link to="/profile" className="text-gray-700 hover:text-indigo-600">
                                            Профиль
                                        </Link>
                                    )}
                                    {!user ? (
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
                                    ) : (
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-700 hover:text-indigo-600"
                                        >
                                            Выйти
                                        </button>
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
                        </Routes>
                    </main>
                </div>
            </Router>
            <Toaster position="top-right" />
        </QueryClientProvider>
    );
};

export default App; 