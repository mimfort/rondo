import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/config';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Reservation {
    id: number;
    court_id: number;
    date: string;
    time: number;
    user_id: number;
    created_at: string;
    is_confirmed: boolean;
    user: {
        email: string;
        first_name: string;
        last_name: string;
    };
}

const CourtReservationsAdmin: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { data: reservationsResponse } = useQuery({
        queryKey: ['reservations', selectedDate],
        queryFn: async () => {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const response = await api.get(`/court_reservations/all_admin/${formattedDate}`);
            return response.data;
        }
    });

    const reservations = reservationsResponse?.items as Reservation[] | undefined;

    const cancelReservationMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await api.delete(`/court_reservations/cancel_by_admin/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations', selectedDate] });
            toast.success('Бронирование отменено');
        },
        onError: (error) => {
            console.error('Ошибка при отмене бронирования:', error);
            toast.error('Ошибка при отмене бронирования');
        }
    });

    const confirmReservationMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await api.post(`/court_reservations/${id}/confirm`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations', selectedDate] });
            toast.success('Бронирование подтверждено');
        },
        onError: (error) => {
            console.error('Ошибка при подтверждении бронирования:', error);
            toast.error('Ошибка при подтверждении бронирования');
        }
    });

    return (
        <div className="space-y-8">
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Бронирования кортов</h2>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="input"
                />
            </div>

            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Список бронирований</h2>
                <div className="space-y-4">
                    {reservations && reservations.length > 0 ? (
                        reservations.map((reservation) => (
                            <div key={reservation.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-400">Корт ID: {reservation.court_id}</p>
                                        <p className="text-gray-600 dark:text-gray-400">Дата: {reservation.date}</p>
                                        <p className="text-gray-600 dark:text-gray-400">Время: {reservation.time}:00</p>
                                        <p className="text-gray-600 dark:text-gray-400">Пользователь: {reservation.user.first_name} {reservation.user.last_name}</p>
                                        <p className="text-gray-600 dark:text-gray-400">Email: {reservation.user.email}</p>
                                        <p className="text-gray-600 dark:text-gray-400">Статус: {reservation.is_confirmed ? 'Подтверждено' : 'Не подтверждено'}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        {!reservation.is_confirmed && (
                                            <button
                                                onClick={() => confirmReservationMutation.mutate(reservation.id)}
                                                className="btn-primary"
                                            >
                                                Подтвердить
                                            </button>
                                        )}
                                        <button
                                            onClick={() => cancelReservationMutation.mutate(reservation.id)}
                                            className="btn-danger"
                                        >
                                            Отменить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">Нет бронирований на выбранную дату</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourtReservationsAdmin;