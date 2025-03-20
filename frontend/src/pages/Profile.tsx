import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { authService, registrationService, eventService } from '../api/services';
import type { Registration, RegistrationWithEvent } from '../types';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface User {
    id: number;
    username: string;
    email: string;
    avatar_url: string | null;
    created_at: string;
}

const Profile = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'registrations'>('profile');

    const { data: user, isLoading: isLoadingUser } = useQuery<User>({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await authService.getCurrentUser();
            return response.data;
        },
    });

    const { data: registrations, isLoading: isLoadingRegistrations, error } = useQuery<RegistrationWithEvent[]>({
        queryKey: ['userRegistrations'],
        queryFn: async () => {
            const response = await registrationService.getUserRegistrations();
            const registrationsWithEvents = await Promise.all(
                response.data.map(async (registration) => {
                    const eventResponse = await eventService.getEventById(registration.event_id);
                    return {
                        ...registration,
                        event: eventResponse.data
                    };
                })
            );
            return registrationsWithEvents;
        },
    });

    const queryClient = useQueryClient();

    const cancelRegistrationMutation = useMutation({
        mutationFn: async (eventId: number) => {
            await registrationService.cancelRegistration(eventId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userRegistrations'] });
            toast.success('Регистрация на событие отменена');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Ошибка при отмене регистрации');
        },
    });

    const handleCancelRegistration = (eventId: number) => {
        cancelRegistrationMutation.mutate(eventId);
    };

    if (isLoadingUser || isLoadingRegistrations) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        console.error('Error loading registrations:', error);
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Ошибка при загрузке регистраций</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'profile'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Профиль
                        </button>
                        <button
                            onClick={() => setActiveTab('registrations')}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'registrations'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Мои регистрации
                        </button>
                    </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    {activeTab === 'profile' ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Информация о пользователе
                                </h3>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Имя пользователя
                                        </label>
                                        <div className="mt-1 text-sm text-gray-900">{user?.username}</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <div className="mt-1 text-sm text-gray-900">{user?.email}</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Дата регистрации
                                        </label>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Не указана'}
                                        </div>
                                    </div>
                                    {user?.avatar_url && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Аватар
                                            </label>
                                            <div className="mt-1">
                                                <img
                                                    src={user.avatar_url}
                                                    alt="Аватар пользователя"
                                                    className="h-20 w-20 rounded-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                Мои регистрации
                            </h3>
                            <div className="space-y-4">
                                {registrations?.map((registration) => (
                                    <div
                                        key={registration.id}
                                        className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                                    >
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {registration.event.title}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {new Date(registration.event.start_time).toLocaleDateString('ru-RU')} •{' '}
                                                {registration.event.location}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Зарегистрирован
                                            </span>
                                            <button
                                                onClick={() => handleCancelRegistration(registration.event.id)}
                                                className="text-red-600 hover:text-red-800"
                                                disabled={cancelRegistrationMutation.isPending}
                                            >
                                                Отменить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {registrations?.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">
                                        У вас пока нет регистраций на события
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile; 