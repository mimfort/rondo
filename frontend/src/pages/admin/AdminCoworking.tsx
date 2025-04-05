import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { coworkingService } from '../../api/services';
import { Coworking, CoworkingReservation } from '../../types';

interface CoworkingResponse {
    items: Coworking[];
}

interface ReservationResponse {
    items: CoworkingReservation[];
}

interface CoworkingForm {
    name: string;
    description: string;
    is_available: boolean;
}

const AdminCoworking = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<CoworkingForm>({
        name: '',
        description: '',
        is_available: true
    });
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data: coworkings } = useQuery<CoworkingResponse>({
        queryKey: ['coworkings'],
        queryFn: async () => {
            const response = await coworkingService.getAllCoworking();
            return response.data;
        }
    });

    const { data: activeReservations } = useQuery<ReservationResponse>({
        queryKey: ['activeReservations'],
        queryFn: async () => {
            const response = await coworkingService.getActiveReservationsAdmin();
            return response.data;
        }
    });

    const createCoworkingMutation = useMutation({
        mutationFn: async (data: { name: string; description: string; is_available: boolean }) => {
            const response = await coworkingService.createCoworking(data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coworkings'] });
            toast.success('Коворкинг успешно создан');
            setFormData({ name: '', description: '', is_available: true });
        },
        onError: () => {
            toast.error('Ошибка при создании коворкинга');
        }
    });

    const updateCoworkingMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: { name: string; description: string; is_available: boolean } }) => {
            const response = await coworkingService.updateCoworking(id, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coworkings'] });
            toast.success('Коворкинг успешно обновлен');
            setEditingId(null);
            setFormData({ name: '', description: '', is_available: true });
        },
        onError: () => {
            toast.error('Ошибка при обновлении коворкинга');
        }
    });

    const deleteCoworkingMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await coworkingService.deleteCoworking(id);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coworkings'] });
            toast.success('Коворкинг успешно удален');
        },
        onError: (error: any) => {
            if (error?.message?.includes('foreign key constraint')) {
                toast.error('Невозможно удалить место, пока есть активные бронирования');
            } else {
                toast.error('Ошибка при удалении коворкинга');
            }
        }
    });

    const closeReservationMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await coworkingService.closeReservationAdmin({ coworking_id: id });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activeReservations'] });
            toast.success('Бронирование успешно закрыто');
        },
        onError: () => {
            toast.error('Ошибка при закрытии бронирования');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateCoworkingMutation.mutate({ id: editingId, data: formData });
        } else {
            createCoworkingMutation.mutate(formData);
        }
    };

    const handleEdit = (coworking: Coworking) => {
        setEditingId(coworking.id);
        setFormData({
            name: coworking.name,
            description: coworking.description,
            is_available: coworking.is_available
        });
    };

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
                {/* Форма создания/редактирования коворкинга */}
                <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow h-[calc(100vh-2rem)] overflow-hidden">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 sticky top-0 bg-white dark:bg-gray-800 py-2 z-10">
                        {editingId ? 'Редактировать коворкинг' : 'Создать новый коворкинг'}
                    </h2>
                    <div className="overflow-y-auto h-[calc(100%-4rem)] pb-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Название
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Описание
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.is_available}
                                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Доступен для бронирования
                                </label>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {editingId ? 'Обновить' : 'Создать'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null);
                                            setFormData({ name: '', description: '', is_available: true });
                                        }}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Отмена
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Список коворкингов */}
                <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow h-[calc(100vh-2rem)] overflow-hidden">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 sticky top-0 bg-white dark:bg-gray-800 py-2 z-10">
                        Существующие коворкинги
                    </h2>
                    <div className="space-y-4 overflow-y-auto h-[calc(100%-4rem)] pb-4">
                        {coworkings?.items.map((coworking: Coworking) => (
                            <div
                                key={coworking.id}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {coworking.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                            {coworking.description}
                                        </p>
                                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${coworking.is_available
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {coworking.is_available ? 'Доступен' : 'Не доступен'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleEdit(coworking)}
                                            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() => deleteCoworkingMutation.mutate(coworking.id)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Активные бронирования */}
                <div className="col-span-1 lg:col-span-2 card p-6 bg-white dark:bg-gray-800 rounded-lg shadow h-[calc(100vh-2rem)] overflow-hidden">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 sticky top-0 bg-white dark:bg-gray-800 py-2 z-10">
                        Активные бронирования
                    </h2>
                    <div className="space-y-4 overflow-y-auto h-[calc(100%-4rem)] pb-4">
                        {activeReservations?.items.map((reservation: CoworkingReservation) => (
                            <div
                                key={reservation.id}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {reservation.coworking.name}
                                        </h3>
                                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                            <p>Начало: {reservation.start_time ? new Date(reservation.start_time).toLocaleString() : 'Не указано'}</p>
                                            <p>Конец: {reservation.end_time ? new Date(reservation.end_time).toLocaleString() : 'Не указано'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => closeReservationMutation.mutate(reservation.coworking_id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Закрыть бронирование
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCoworking; 