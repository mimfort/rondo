import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services';
import type { LoginForm } from '../types';
import AuthForm from '../components/AuthForm';
import { AxiosError } from 'axios';

interface ErrorResponse {
    detail: string;
}

const Login = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    const loginMutation = useMutation({
        mutationFn: async (data: LoginForm) => {
            const response = await authService.login(data);
            // Сохраняем токен в localStorage
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                // Устанавливаем токен в заголовки axios
                authService.setAuthToken(response.data.access_token);
            }
            return response;
        },
        onSuccess: async () => {
            // После успешного входа получаем данные пользователя
            const userResponse = await authService.getCurrentUser();
            // Обновляем кэш React Query с данными пользователя
            queryClient.setQueryData(['currentUser'], userResponse.data);
            navigate('/');
        },
    });

    const onSubmit = (data: LoginForm) => {
        loginMutation.mutate(data);
    };

    // Определяем сообщение об ошибке
    const getErrorMessage = () => {
        if (!loginMutation.isError) return undefined;

        const error = loginMutation.error as AxiosError<ErrorResponse>;
        const errorDetail = error.response?.data?.detail;
        if (errorDetail === "Подтвердите свою почту") {
            return "Пожалуйста, подтвердите свою почту перед входом";
        }
        return "Неверный email или пароль";
    };

    return (
        <AuthForm
            title="Войти в аккаунт"
            subtitle="Нет аккаунта?"
            linkText="Создать новый"
            linkTo="/register"
            onSubmit={handleSubmit(onSubmit)}
            isLoading={loginMutation.isPending}
            error={getErrorMessage()}
        >
            <div className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <input
                            {...register('email', {
                                required: 'Email обязателен',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Некорректный email',
                                },
                            })}
                            type="email"
                            className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
                            placeholder="your@email.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Пароль
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            {...register('password', { required: 'Пароль обязателен' })}
                            type="password"
                            className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.password.message}
                        </p>
                    )}
                    <div className="mt-2 text-right">
                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Забыли пароль?
                        </Link>
                    </div>
                </div>
            </div>
        </AuthForm>
    );
};

export default Login; 