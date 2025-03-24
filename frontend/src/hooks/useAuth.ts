import { useMutation, useQuery } from '@tanstack/react-query';
import { User } from '../types';
import { API_URL } from '../api/config';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterCredentials extends LoginCredentials {
    username: string;
}

export const useAuth = () => {
    const { data: currentUser, isLoading } = useQuery<User>({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/users/me`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Not authenticated');
            }
            return response.json();
        },
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(credentials),
            });
            if (!response.ok) {
                throw new Error('Ошибка авторизации');
            }
            return response.json();
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (credentials: RegisterCredentials) => {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(credentials),
            });
            if (!response.ok) {
                throw new Error('Ошибка регистрации');
            }
            return response.json();
        },
    });

    const logout = async () => {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    };

    return {
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout,
        isLoading,
        error: loginMutation.error || registerMutation.error,
        currentUser
    };
}; 