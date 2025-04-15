import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../../api/config';
import toast from 'react-hot-toast';

interface Court {
    id: number;
    name: string;
    description: string;
    price: number;
    is_available: boolean;
    not_available_dates: string[];
}

interface CourtForm {
    name: string;
    description: string;
    price: number;
    is_available: boolean;
    not_available_dates: string[];
}

const CourtsAdmin: React.FC = () => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CourtForm>();
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

    const { data: courtsResponse } = useQuery({
        queryKey: ['courts'],
        queryFn: async () => {
            const response = await api.get('/courts/');
            return response.data;
        }
    });

    const courts = courtsResponse?.items as Court[] | undefined;

    const createCourtMutation = useMutation({
        mutationFn: async (data: CourtForm) => {
            const response = await api.post('/courts/admin_create', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courts'] });
            reset();
            toast.success('Корт успешно создан');
        },
        onError: (error) => {
            console.error('Ошибка при создании корта:', error);
            toast.error('Ошибка при создании корта');
        }
    });

    const updateCourtMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: CourtForm }) => {
            const response = await api.put(`/courts/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courts'] });
            reset();
            setSelectedCourt(null);
            toast.success('Корт успешно обновлен');
        },
        onError: (error) => {
            console.error('Ошибка при обновлении корта:', error);
            toast.error('Ошибка при обновлении корта');
        }
    });

    const deleteCourtMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await api.delete(`/courts/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courts'] });
            toast.success('Корт успешно удален');
        },
        onError: (error) => {
            console.error('Ошибка при удалении корта:', error);
            toast.error('Ошибка при удалении корта');
        }
    });

    const addNotAvailableDateMutation = useMutation({
        mutationFn: async ({ id, not_available_date }: { id: number; not_available_date: string }) => {
            const response = await api.post(`/courts/${id}/add_not_available_date`, { not_available_date });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courts'] });
            toast.success('Дата успешно добавлена');
        },
        onError: (error) => {
            console.error('Ошибка при добавлении даты:', error);
            toast.error('Ошибка при добавлении даты');
        }
    });

    const onSubmit = (data: CourtForm) => {
        if (selectedCourt) {
            updateCourtMutation.mutate({ id: selectedCourt.id, data });
        } else {
            createCourtMutation.mutate(data);
        }
    };

    const handleEdit = (court: Court) => {
        setSelectedCourt(court);
        reset({
            name: court.name,
            description: court.description,
            price: court.price,
            is_available: court.is_available,
            not_available_dates: court.not_available_dates
        });
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот корт?')) {
            deleteCourtMutation.mutate(id);
        }
    };

    const handleAddNotAvailableDate = (id: number) => {
        const date = prompt('Введите дату в формате YYYY-MM-DD');
        if (date) {
            addNotAvailableDateMutation.mutate({ id, not_available_date: date });
        }
    };

    return (
        <div className="space-y-8">
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {selectedCourt ? 'Редактировать корт' : 'Создать новый корт'}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="label">Название корта</label>
                        <input
                            type="text"
                            {...register('name', { required: 'Обязательное поле' })}
                            className="input"
                        />
                        {errors.name && <p className="error-text">{errors.name.message}</p>}
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
                        <label className="label">Цена (₽/час)</label>
                        <input
                            type="number"
                            {...register('price', { required: 'Обязательное поле', min: 0 })}
                            className="input"
                        />
                        {errors.price && <p className="error-text">{errors.price.message}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            {...register('is_available')}
                            className="mr-2"
                        />
                        <label className="label">Доступен для бронирования</label>
                    </div>

                    <button type="submit" className="btn-primary">
                        {selectedCourt ? 'Обновить' : 'Создать'}
                    </button>
                    {selectedCourt && (
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedCourt(null);
                                reset();
                            }}
                            className="btn-secondary ml-2"
                        >
                            Отмена
                        </button>
                    )}
                </form>
            </div>

            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Список кортов</h2>
                <div className="space-y-4">
                    {courts && courts.length > 0 ? (
                        courts.map((court) => (
                            <div key={court.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{court.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{court.description}</p>
                                        <p className="text-gray-600 dark:text-gray-400">Цена: {court.price} ₽/час</p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Статус: {court.is_available ? 'Доступен' : 'Недоступен'}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(court)}
                                            className="btn-secondary"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() => handleDelete(court.id)}
                                            className="btn-danger"
                                        >
                                            Удалить
                                        </button>
                                        <button
                                            onClick={() => handleAddNotAvailableDate(court.id)}
                                            className="btn-primary"
                                        >
                                            Добавить дату
                                        </button>
                                    </div>
                                </div>
                                {court.not_available_dates && court.not_available_dates.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Недоступные даты: {court.not_available_dates.join(', ')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">Нет доступных кортов</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourtsAdmin; 