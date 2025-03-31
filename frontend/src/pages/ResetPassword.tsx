import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../api/services';
import AuthForm from '../components/AuthForm';

interface ResetPasswordForm {
    new_password: string;
    confirm_password: string;
}

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordForm>();

    const resetPasswordMutation = useMutation({
        mutationFn: async (data: { new_password: string }) => {
            if (!token) throw new Error('Token not found');
            return await authService.resetPassword({ token, new_password: data.new_password });
        },
        onSuccess: () => {
            toast.success('Пароль успешно изменен');
            navigate('/login');
        },
        onError: () => {
            toast.error('Произошла ошибка при смене пароля');
        },
    });

    const onSubmit = (data: ResetPasswordForm) => {
        resetPasswordMutation.mutate({ new_password: data.new_password });
    };

    const password = watch('new_password');

    return (
        <AuthForm
            title="Сброс пароля"
            subtitle="Вспомнили пароль?"
            linkText="Войти"
            linkTo="/login"
            onSubmit={handleSubmit(onSubmit)}
            isLoading={resetPasswordMutation.isPending}
            error={resetPasswordMutation.isError ? 'Ошибка при сбросе пароля' : undefined}
        >
            <div className="space-y-5">
                <div>
                    <label htmlFor="new_password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Новый пароль
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            {...register('new_password', {
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
                    {errors.new_password && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.new_password.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Подтвердите пароль
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            {...register('confirm_password', {
                                required: 'Подтверждение пароля обязательно',
                                validate: value => value === password || 'Пароли не совпадают'
                            })}
                            type="password"
                            className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.confirm_password && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.confirm_password.message}
                        </p>
                    )}
                </div>
            </div>
        </AuthForm>
    );
};

export default ResetPassword; 