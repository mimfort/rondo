import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { eventService, authService } from '../api/services';
import type { Event, EventForm, User } from '../types';
import { API_URL } from '../api/config';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<EventForm>();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [showImageGallery, setShowImageGallery] = useState(false);
    const [selectedExistingImage, setSelectedExistingImage] = useState<string | null>(null);

    const { data: user, isLoading: userLoading } = useQuery<User>({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await authService.getCurrentUser();
            return response.data;
        },
        retry: false,
    });

    const { data: eventsResponse } = useQuery({
        queryKey: ['events'],
        queryFn: eventService.getAllEvents,
        enabled: !!user && user.admin_status === 'admin',
    });

    const { data: uploadedImages } = useQuery<string[]>({
        queryKey: ['uploadedImages'],
        queryFn: async () => {
            const images = await eventService.getUploadedImages();
            console.log('Полученные пути к изображениям:', images);
            return images;
        },
        enabled: !!user && user.admin_status === 'admin',
    });

    const events = eventsResponse?.data as Event[] | undefined;

    const createEventMutation = useMutation({
        mutationFn: async (data: EventForm) => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'max_members') {
                    formData.append(key, value.toString());
                } else {
                    formData.append(key, String(value));
                }
            });

            if (selectedExistingImage) {
                formData.append('media_url', selectedExistingImage);
            } else if (selectedImage) {
                formData.append('image', selectedImage);
            }

            return eventService.createEvent(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            reset();
            setSelectedImage(null);
            setSelectedExistingImage(null);
            setShowImageGallery(false);
            toast.success('Событие успешно создано');
        },
        onError: (error) => {
            console.error('Ошибка при создании события:', error);
            toast.error('Ошибка при создании события');
        }
    });

    const deleteEventMutation = useMutation({
        mutationFn: eventService.deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success('Событие успешно удалено');
        },
        onError: (error) => {
            console.error('Ошибка при удалении события:', error);
            toast.error('Ошибка при удалении события');
        }
    });

    const sendEventNotificationMutation = useMutation({
        mutationFn: (eventId: number) => eventService.sendNotification(eventId),
        onSuccess: () => {
            toast.success('Уведомления успешно отправлены');
        },
        onError: (error) => {
            console.error('Ошибка при отправке уведомлений:', error);
            toast.error('Ошибка при отправке уведомлений');
        }
    });

    useEffect(() => {
        if (!userLoading && (!user || user.admin_status !== 'admin')) {
            navigate('/');
        }
    }, [user, userLoading, navigate]);

    const onSubmit = (data: EventForm) => {
        createEventMutation.mutate(data);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
            setSelectedExistingImage(null);
        }
    };

    const handleExistingImageSelect = (imagePath: string) => {
        setSelectedExistingImage(imagePath);
        setSelectedImage(null);
        setShowImageGallery(false);
    };

    if (userLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user || user.admin_status !== 'admin') {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Панель администратора</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Форма создания события */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Создать новое мероприятие</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="label">Название мероприятия</label>
                            <input
                                type="text"
                                {...register('title', { required: 'Обязательное поле' })}
                                className="input"
                            />
                            {errors.title && <p className="error-text">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="label">Описание</label>
                            <textarea
                                {...register('description', { required: 'Обязательное поле' })}
                                className="input"
                                rows={4}
                            />
                            {errors.description && <p className="error-text">{errors.description.message}</p>}
                        </div>

                        <div>
                            <label className="label">Дата и время начала</label>
                            <input
                                type="datetime-local"
                                {...register('start_time', { required: 'Обязательное поле' })}
                                className="input"
                            />
                            {errors.start_time && <p className="error-text">{errors.start_time.message}</p>}
                        </div>

                        <div>
                            <label className="label">Дата и время окончания</label>
                            <input
                                type="datetime-local"
                                {...register('end_time', { required: 'Обязательное поле' })}
                                className="input"
                            />
                            {errors.end_time && <p className="error-text">{errors.end_time.message}</p>}
                        </div>

                        <div>
                            <label className="label">Место проведения</label>
                            <input
                                type="text"
                                {...register('location', { required: 'Обязательное поле' })}
                                className="input"
                            />
                            {errors.location && <p className="error-text">{errors.location.message}</p>}
                        </div>

                        <div>
                            <label className="label">Количество мест</label>
                            <input
                                type="number"
                                {...register('max_members', { required: 'Обязательное поле' })}
                                className="input"
                            />
                            {errors.max_members && <p className="error-text">{errors.max_members.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="label">Изображение события</label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="input"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowImageGallery(!showImageGallery)}
                                    className="btn btn-secondary"
                                >
                                    {showImageGallery ? 'Скрыть галерею' : 'Выбрать из загруженных'}
                                </button>
                            </div>

                            {showImageGallery && uploadedImages && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Выберите изображение</h3>
                                            <button
                                                onClick={() => setShowImageGallery(false)}
                                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                            >
                                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {uploadedImages.map((image) => (
                                                <div
                                                    key={image}
                                                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${selectedExistingImage === image
                                                        ? 'border-indigo-500'
                                                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                                        }`}
                                                    onClick={() => handleExistingImageSelect(image)}
                                                >
                                                    <img
                                                        src={image.startsWith('http') ? image : `${API_URL}${image}`}
                                                        alt={`Изображение ${image}`}
                                                        className="w-full h-48 object-cover"
                                                        onError={(e) => {
                                                            console.error('Ошибка загрузки изображения:', image);
                                                            e.currentTarget.src = '/placeholder.png';
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex justify-end space-x-2">
                                            <button
                                                onClick={() => setShowImageGallery(false)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                                            >
                                                Отмена
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (selectedExistingImage) {
                                                        setSelectedExistingImage(null);
                                                    }
                                                    setShowImageGallery(false);
                                                }}
                                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                                            >
                                                Выбрать
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(selectedImage || selectedExistingImage) && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Предпоказ изображения
                                    </label>
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                        <img
                                            src={selectedImage ? URL.createObjectURL(selectedImage) : (selectedExistingImage?.startsWith('http') ? selectedExistingImage : `${API_URL}${selectedExistingImage}`)}
                                            alt="Предпоказ"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error('Ошибка загрузки изображения в предпросмотре:', selectedExistingImage);
                                                e.currentTarget.src = '/placeholder.png';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Создать мероприятие
                            </button>
                        </div>
                    </form>
                </div>

                {/* Список существующих событий */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Существующие мероприятия</h2>
                    <div className="space-y-4">
                        {events?.map((event) => (
                            <div
                                key={event.id}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{event.title}</h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => sendEventNotificationMutation.mutate(event.id)}
                                                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                disabled={sendEventNotificationMutation.isPending}
                                            >
                                                {sendEventNotificationMutation.isPending ? 'Отправка...' : 'Уведомить'}
                                            </button>
                                            <button
                                                onClick={() => deleteEventMutation.mutate(event.id)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(event.start_time).toLocaleString()}
                                        </div>
                                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {event.location}
                                        </div>
                                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            {event.max_members - event.count_members} из {event.max_members} мест
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 