import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/services';
import AuthForm from '../components/AuthForm';

interface RegisterForm {
    username: string;
    email: string;
    password: string;
    personalDataConsent: boolean;
}

const Register = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>();

    const registerMutation = useMutation({
        mutationFn: async (data: RegisterForm) => {
            return await authService.register(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            navigate('/');
        },
    });

    const onSubmit = (data: RegisterForm) => {
        if (!data.personalDataConsent) {
            return;
        }
        registerMutation.mutate(data);
    };

    return (
        <AuthForm
            title="Создать аккаунт"
            subtitle="Уже есть аккаунт?"
            linkText="Войти"
            linkTo="/login"
            onSubmit={handleSubmit(onSubmit)}
            isLoading={registerMutation.isPending}
            error={registerMutation.isError ? 'Ошибка при регистрации. Пожалуйста, проверьте введенные данные.' : undefined}
        >
            <div className="space-y-5">
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Имя пользователя
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <input
                            {...register('username', { required: 'Имя пользователя обязательно' })}
                            type="text"
                            className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
                            placeholder="username"
                        />
                    </div>
                    {errors.username && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.username.message}
                        </p>
                    )}
                </div>

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
                            {...register('password', {
                                required: 'Пароль обязателен',
                                minLength: {
                                    value: 6,
                                    message: 'Пароль должен содержать минимум 6 символов',
                                },
                            })}
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
                </div>

                <div className="flex items-start space-x-3">
                    <div className="flex items-center h-5">
                        <input
                            {...register('personalDataConsent', {
                                required: 'Необходимо согласие на обработку персональных данных'
                            })}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            Я согласен на обработку персональных данных
                            <a
                                href="/privacy-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline ml-1"
                            >
                                (Подробнее)
                            </a>
                        </label>
                        {errors.personalDataConsent && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.personalDataConsent.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthForm>
    );
};

export default Register;