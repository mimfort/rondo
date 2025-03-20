import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { eventService, authService } from '../api/services';
import type { Event, EventForm, User } from '../types';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<EventForm>();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const { data: userResponse } = useQuery({
        queryKey: ['user'],
        queryFn: () => authService.getCurrentUser(),
        retry: false,
    });

    const user = userResponse?.data as User | undefined;

    React.useEffect(() => {
        if (user && user.admin_status !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    const { data: eventsResponse, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: eventService.getAllEvents,
    });

    const events = eventsResponse?.data as Event[] | undefined;

    const createEventMutation = useMutation({
        mutationFn: async (data: EventForm) => {
            console.log('Отправляемые данные:', data);
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'max_members') {
                    console.log(`Добавляем в FormData число: ${key} = ${value}`);
                    formData.append(key, value.toString());
                } else {
                    console.log(`Добавляем в FormData: ${key} = ${value}`);
                    formData.append(key, String(value));
                }
            });
            if (selectedImage) {
                console.log('Добавляем изображение:', selectedImage);
                formData.append('image', selectedImage);
            }
            try {
                const response = await eventService.createEvent(formData);
                console.log('Ответ сервера:', response);
                return response;
            } catch (error) {
                console.error('Ошибка при создании события:', error);
                throw error;
            }
        },
        onSuccess: () => {
            console.log('Событие успешно создано');
            queryClient.invalidateQueries({ queryKey: ['events'] });
            reset();
            setSelectedImage(null);
        },
        onError: (error) => {
            console.error('Ошибка при создании события:', error);
        }
    });

    const deleteEventMutation = useMutation({
        mutationFn: eventService.deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });

    const onSubmit = (data: EventForm) => {
        console.log('Данные формы перед отправкой:', data);
        console.log('Тип max_members:', typeof data.max_members);
        console.log('Значение max_members:', data.max_members);
        createEventMutation.mutate(data);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    if (isLoading) {
        return <div className="text-center py-8">Загрузка...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Панель администратора</h1>

            <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Создать новое событие</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Название
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register('title', { required: 'Название обязательно' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Описание
                        </label>
                        <textarea
                            id="description"
                            {...register('description', { required: 'Описание обязательно' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            rows={4}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Изображение
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                        />
                        {selectedImage && (
                            <div className="mt-2">
                                <img
                                    src={URL.createObjectURL(selectedImage)}
                                    alt="Preview"
                                    className="h-32 w-32 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                            Дата начала
                        </label>
                        <input
                            type="datetime-local"
                            id="start_time"
                            {...register('start_time', { required: 'Дата начала обязательна' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.start_time && (
                            <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                            Дата окончания
                        </label>
                        <input
                            type="datetime-local"
                            id="end_time"
                            {...register('end_time', { required: 'Дата окончания обязательна' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.end_time && (
                            <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Место проведения
                        </label>
                        <input
                            type="text"
                            id="location"
                            {...register('location', { required: 'Место проведения обязательно' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.location && (
                            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="max_members" className="block text-sm font-medium text-gray-700">
                            Максимальное количество участников
                        </label>
                        <input
                            type="number"
                            id="max_members"
                            {...register('max_members', {
                                required: 'Количество участников обязательно',
                                valueAsNumber: true,
                                min: {
                                    value: 1,
                                    message: 'Количество участников должно быть больше 0'
                                }
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.max_members && (
                            <p className="mt-1 text-sm text-red-600">{errors.max_members.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                            Создать событие
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-900 p-6 border-b border-gray-200">
                    Список событий
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Название
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Дата
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Место
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Макс. участников
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {events?.map((event: Event) => (
                                <tr key={event.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                        <div className="text-sm text-gray-500">{event.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(event.start_time).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{event.location}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {event.registration_count}/{event.max_members}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => deleteEventMutation.mutate(event.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 