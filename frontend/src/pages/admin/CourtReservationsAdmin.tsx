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
    is_social?: boolean;
    user: {
        email: string;
        first_name: string;
        last_name: string;
    };
}

const TransferForm: React.FC<{ onSubmit: (data: { date: string; time: number; court_id: number }) => void; onClose: () => void }> = ({ onSubmit, onClose }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [courtId, setCourtId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedTime = parseInt(time, 10);
        const parsedCourtId = parseInt(courtId, 10);
        if (date && !isNaN(parsedTime) && !isNaN(parsedCourtId)) {
            onSubmit({ date, time: parsedTime, court_id: parsedCourtId });
        } else {
            alert('Пожалуйста, заполните все поля корректно.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 dark:text-gray-200 rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Перенос бронирования</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Дата (YYYY-MM-DD)</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="input dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Время (HH)</label>
                        <input
                            type="number"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="input dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID корта</label>
                        <input
                            type="number"
                            value={courtId}
                            onChange={(e) => setCourtId(e.target.value)}
                            className="input dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="btn-secondary">Отмена</button>
                        <button type="submit" className="btn-primary">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CourtReservationsAdmin: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
    const [currentReservationId, setCurrentReservationId] = useState<number | null>(null);

    const [modalData, setModalData] = useState<{ action: 'confirm' | 'cancel'; reservationId: number } | null>(null);

    const handleModalConfirm = () => {
        if (modalData) {
            if (modalData.action === 'confirm') {
                confirmReservationMutation.mutate(modalData.reservationId);
            } else if (modalData.action === 'cancel') {
                cancelReservationMutation.mutate(modalData.reservationId);
            }
            setModalData(null);
        }
    };

    const handleModalClose = () => {
        setModalData(null);
    };

    const buttonBaseClass = "px-4 py-2 rounded text-white font-semibold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
    const buttonPrimaryClass = `${buttonBaseClass} bg-blue-500 hover:bg-blue-600 focus:ring-blue-500`;
    const buttonDangerClass = `${buttonBaseClass} bg-red-500 hover:bg-red-600 focus:ring-red-500`;
    const buttonSecondaryClass = `${buttonBaseClass} bg-gray-500 hover:bg-gray-600 focus:ring-gray-500`;

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

    const updateSocialMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await api.put(`/court_reservations/update_social/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations', selectedDate] });
            toast.success('Бронирование обновлено как социальное');
        },
        onError: (error) => {
            console.error('Ошибка при обновлении бронирования:', error);
            toast.error('Ошибка при обновлении бронирования');
        }
    });

    const unupdateSocialMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await api.put(`/court_reservations/unupdate_social/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations', selectedDate] });
            toast.success('Социальный статус бронирования снят');
        },
        onError: (error) => {
            console.error('Ошибка при снятии социального статуса бронирования:', error);
            toast.error('Ошибка при снятии социального статуса бронирования');
        }
    });

    const handleTransferSubmit = async (data: { date: string; time: number; court_id: number }) => {
        if (currentReservationId !== null) {
            try {
                await api.put(`/court_reservations/update/${currentReservationId}`, data);
                toast.success('Бронирование успешно перенесено');
                queryClient.invalidateQueries({ queryKey: ['reservations', selectedDate] });
                setIsTransferFormOpen(false);
            } catch (error: any) {
                console.error('Ошибка при переносе бронирования:', error);
                const errorMessage = error.response?.data?.detail || 'Ошибка при переносе бронирования';
                toast.error(errorMessage);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Бронирования кортов</h2>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => date && setSelectedDate(date)}
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
                                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                        {!reservation.is_confirmed && (
                                            <button
                                                onClick={() => setModalData({ action: 'confirm', reservationId: reservation.id })}
                                                className={buttonPrimaryClass + " w-full md:w-auto"}
                                            >
                                                Подтвердить
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setModalData({ action: 'cancel', reservationId: reservation.id })}
                                            className={buttonDangerClass + " w-full md:w-auto"}
                                        >
                                            Отменить
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCurrentReservationId(reservation.id);
                                                setIsTransferFormOpen(true);
                                            }}
                                            className={buttonSecondaryClass + " w-full md:w-auto"}
                                        >
                                            Перенести
                                        </button>
                                        {reservation.is_social === false || reservation.is_social === null ? (
                                            <button
                                                onClick={() => updateSocialMutation.mutate(reservation.id)}
                                                className={buttonSecondaryClass + " w-full md:w-auto"}
                                            >
                                                Секция
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => unupdateSocialMutation.mutate(reservation.id)}
                                                className={buttonSecondaryClass + " w-full md:w-auto"}
                                            >
                                                Снять
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">Нет бронирований на выбранную дату</p>
                    )}
                </div>
            </div>

            {modalData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                        <h2 className="text-2xl font-bold mb-4 text-center">
                            {modalData.action === 'confirm' ? 'Подтвердить бронирование?' : 'Отменить бронирование?'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                            Вы уверены, что хотите {modalData.action === 'confirm' ? 'подтвердить' : 'отменить'} это бронирование?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleModalClose}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleModalConfirm}
                                className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${modalData.action === 'confirm' ? 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500' : 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'}`}
                            >
                                {modalData.action === 'confirm' ? 'Подтвердить' : 'Отменить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isTransferFormOpen && currentReservationId !== null && (
                <TransferForm
                    onSubmit={handleTransferSubmit}
                    onClose={() => setIsTransferFormOpen(false)}
                />
            )}
        </div>
    );
};

export default CourtReservationsAdmin;