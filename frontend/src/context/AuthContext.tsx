import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

interface User {
    email: string;
    first_name?: string;
    last_name?: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await api.get('/users/me');
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Ошибка при загрузке пользователя:', error);
                localStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 