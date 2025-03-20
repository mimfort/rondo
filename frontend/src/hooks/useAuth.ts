import { useMutation } from '@tanstack/react-query';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterCredentials extends LoginCredentials {
    username: string;
}

export const useAuth = () => {
    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            if (!response.ok) {
                throw new Error('Ошибка регистрации');
            }
            return response.json();
        },
    });

    const logout = async () => {
        await fetch('/api/auth/logout', {
            method: 'POST',
        });
    };

    return {
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout,
        isLoading: loginMutation.isPending || registerMutation.isPending,
        error: loginMutation.error || registerMutation.error,
    };
}; 