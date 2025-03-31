import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { authService } from '../api/services';
import AuthForm from '../components/AuthForm';

interface ForgotPasswordForm {
    email: string;
}

const ForgotPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>();

    const forgotPasswordMutation = useMutation({
        mutationFn: async (data: ForgotPasswordForm) => {
            return await authService.forgotPassword(data);
        },
        onSuccess: () => {
            toast.success('Инструкции по сбросу пароля отправлены на вашу почту');
        },
        onError: () => {
            toast.error('Произошла ошибка. Пожалуйста, проверьте введенный email');
        },
    });

    const onSubmit = (data: ForgotPasswordForm) => {
        forgotPasswordMutation.mutate(data);
    };

    return (
        <AuthForm
            title="Восстановление пароля"
            subtitle="Вспомнили пароль?"
            linkText="Войти"
            linkTo="/login"
            onSubmit={handleSubmit(onSubmit)}
            isLoading={forgotPasswordMutation.isPending}
            error={forgotPasswordMutation.isError ? 'Ошибка при отправке запроса' : undefined}
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
            </div>
        </AuthForm>
    );
};

export default ForgotPassword; 