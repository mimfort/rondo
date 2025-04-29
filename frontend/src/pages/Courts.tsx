import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import { format, addDays, isBefore, startOfToday, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

const CourtContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--background-color);
  color: var(--text-color);

  @media (max-width: 768px) {
    padding: 0.5rem;
    gap: 1rem;
  }
`;

const DateSlider = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem;
  margin: 0.5rem auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 0.25rem;
    gap: 0.25rem;
    justify-content: flex-start;
    margin: 0.5rem 0;
    max-width: 100%;
  }
`;

const DateButton = styled.button<{ isSelected: boolean; isDisabled: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: none;
  background: ${({ isSelected }) => (isSelected ? '#818cf8' : 'var(--button-background)')};
  color: ${({ isSelected, isDisabled }) =>
        isDisabled ? 'var(--text-disabled)' : isSelected ? '#fff' : 'var(--text-color)'};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
  transition: all 0.2s ease;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    min-width: 60px;
    padding: 0.4rem 0.75rem;
    font-size: 0.9rem;
  }
`;

const CourtsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const CourtCard = styled(motion.div)`
  background: var(--card-background);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: var(--text-color);

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 0.75rem;
  }
`;

const TimeSlot = styled.div<{ available: boolean; selected: boolean }>`
  background: ${({ available, selected }) =>
        selected ? '#818cf8' : available ? '#34d399' : '#ef4444'};
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  cursor: ${({ available }) => available ? 'pointer' : 'default'};
  opacity: ${({ available }) => available ? 1 : 0.6};
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
`;

const CourtImage = styled.div`
  width: 100%;
  height: 300px;
  background-image: url('https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  border-radius: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    height: 200px;
    border-radius: 0.75rem;
  }
`;

const DateNavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
  padding: 0 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
    gap: 0.5rem;
    max-width: 100%;
  }
`;

const NavigationButton = styled.button`
  background: var(--button-background);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-color);
  
  &:hover {
    background: var(--button-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WeekLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color);
  min-width: 200px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
    min-width: 150px;
  }
`;

const PaymentButton = styled.button`
  background: linear-gradient(to right, #4f46e5, #818cf8);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  width: 100%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
  }
`;

const TemporaryReservationsContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--card-background);
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  color: var(--text-color);

  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: 1.5rem;
  }
`;

const TemporaryReservationCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--card-background-secondary);
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
  color: var(--text-color);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const CancelButton = styled.button`
  background: white;
  color: #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: 1px solid #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #fee2e2;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #f3f4f6;
    border-color: #9ca3af;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const ConfirmButton = styled.button`
  background: linear-gradient(to right, #f59e0b, #fbbf24);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

interface Court {
    id: number;
    name: string;
    description: string;
    price: number;
    is_available: boolean;
    not_available_dates: string[];
}

interface Reservation {
    court_id: number;
    date: string;
    time: number;
    id: number;
    user_id: number;
    created_at: string;
    is_confirmed: boolean;
}

const StaticHeader = React.memo(() => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
    >
        <h1 className="text-6xl font-bold text-[#6D4AFF] mb-4">
            КОРТЫ
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
            Теннисное пространство
        </p>
    </motion.div>
));

const DynamicContent = React.memo(({
    currentWeekStart,
    selectedDate,
    courts,
    reservations,
    currentUser,
    onDateSelect,
    onPrevWeek,
    onNextWeek,
    onReservationsUpdate,
    onTemporaryReservationsUpdate
}: {
    currentWeekStart: Date;
    selectedDate: Date;
    courts: Court[];
    reservations: Reservation[];
    currentUser: any;
    onDateSelect: (date: Date) => void;
    onPrevWeek: (e: React.MouseEvent) => void;
    onNextWeek: (e: React.MouseEvent) => void;
    onReservationsUpdate: (reservations: Reservation[]) => void;
    onTemporaryReservationsUpdate: () => Promise<void>;
}) => {
    const navigate = useNavigate();
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getDayAbbreviation = (date: Date) => {
        const days = {
            0: 'Вс',
            1: 'Пн',
            2: 'Вт',
            3: 'Ср',
            4: 'Чт',
            5: 'Пт',
            6: 'Сб'
        };
        return days[date.getDay() as keyof typeof days];
    };

    const handleDateSelect = useCallback((date: Date, e: React.MouseEvent) => {
        e.preventDefault();
        onDateSelect(date);
    }, [onDateSelect]);

    const generateDateButtons = useCallback(() => {
        const buttons = [];
        const today = startOfToday();

        for (let i = 0; i < 7; i++) {
            const date = addDays(currentWeekStart, i);
            const isDisabled = isBefore(date, today) && !format(date, 'yyyy-MM-dd').includes(format(today, 'yyyy-MM-dd'));

            buttons.push(
                <DateButton
                    key={i}
                    isSelected={format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')}
                    isDisabled={isDisabled}
                    onClick={(e) => !isDisabled && handleDateSelect(date, e)}
                >
                    <div className="text-sm">{getDayAbbreviation(date)}</div>
                    <div className="text-lg font-semibold">{format(date, 'd')}</div>
                </DateButton>
            );
        }
        return buttons;
    }, [currentWeekStart, selectedDate, handleDateSelect]);

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 10; hour <= 21; hour++) {
            slots.push(hour);
        }
        return slots;
    };

    const isTimeSlotAvailable = (courtId: number, time: number) => {
        const reservation = reservations.find(
            r => r.court_id === courtId && r.time === time
        );

        if (reservation) {
            return {
                available: false,
                isTemporary: !reservation.is_confirmed
            };
        }

        return {
            available: true,
            isTemporary: false
        };
    };

    const handleTimeSelect = (court: Court, time: number) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const { available } = isTimeSlotAvailable(court.id, time);
        if (!available) return;

        setSelectedCourt(court);
        setSelectedTimeSlot(time.toString());
    };

    const handlePayment = async () => {
        if (!selectedTimeSlot || !selectedCourt) return;

        try {
            setIsLoading(true);
            const response = await api.post('/court_reservations/temporary', {
                court_id: selectedCourt.id,
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: parseInt(selectedTimeSlot)
            });

            // Перенаправляем на страницу оплаты
            window.location.href = response.data.payment_url;

        } catch (error) {
            console.error('Ошибка при создании временной брони:', error);
            toast.error('Не удалось создать временную бронь');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DateNavigationContainer>
                <NavigationButton
                    onClick={onPrevWeek}
                    disabled={isBefore(currentWeekStart, startOfToday())}
                >
                    ←
                </NavigationButton>
                <WeekLabel>
                    {`${format(currentWeekStart, 'd')}–${format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'd')} ${format(currentWeekStart, 'MMMM', { locale: ru })}`}
                </WeekLabel>
                <NavigationButton onClick={onNextWeek}>
                    →
                </NavigationButton>
            </DateNavigationContainer>

            <DateSlider>
                {generateDateButtons()}
            </DateSlider>

            {error && (
                <div className="text-red-500 text-center mb-4 p-2 bg-red-50 rounded">
                    {error}
                </div>
            )}

            <CourtsGrid>
                {courts.map((court) => (
                    <CourtCard
                        key={court.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {court.name}
                            </h2>
                            <span className="text-lg font-medium text-gray-900 dark:text-white">
                                {court.price} ₽/час
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {court.description}
                        </p>
                        <div className="space-y-2">
                            {generateTimeSlots().map((time) => {
                                const { available, isTemporary } = isTimeSlotAvailable(court.id, time);
                                const isSelected = selectedCourt?.id === court.id && selectedTimeSlot === time.toString();

                                return (
                                    <div key={time}>
                                        <TimeSlot
                                            available={available}
                                            selected={isSelected}
                                            onClick={(e) => handleTimeSelect(court, time)}
                                            style={{
                                                background: isTemporary ? '#FCD34D' : available ? '#34d399' : '#ef4444'
                                            }}
                                        >
                                            <span>{`${time}:00`}</span>
                                            <span>
                                                {isTemporary ? 'Ожидает оплаты' : available ? 'Доступно' : 'Занято'}
                                            </span>
                                        </TimeSlot>
                                        {isSelected && (
                                            <PaymentButton
                                                onClick={handlePayment}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        Обработка...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        Перейти к оплате
                                                    </>
                                                )}
                                            </PaymentButton>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CourtCard>
                ))}
            </CourtsGrid>
        </>
    );
});

const TemporaryReservations = React.memo(({
    courts,
    onReservationsUpdate,
    temporaryReservations,
    onTemporaryReservationsUpdate
}: {
    courts: Court[];
    onReservationsUpdate: (reservations: Reservation[]) => void;
    temporaryReservations: Reservation[];
    onTemporaryReservationsUpdate: () => Promise<void>;
}) => {
    const [error, setError] = useState<string | null>(null);
    const [cancelingId, setCancelingId] = useState<number | null>(null);

    const handleCancelReservation = async (reservationId: number) => {
        setCancelingId(reservationId);
        setError(null);

        try {
            await api.delete(`/court_reservations/cancel/${reservationId}`);

            // Обновляем список временных броней
            await onTemporaryReservationsUpdate();

            // Обновляем основной список резерваций
            const date = temporaryReservations.find(r => r.id === reservationId)?.date;
            if (date) {
                const response = await api.get(`/court_reservations/all/${date}`);
                onReservationsUpdate(response.data.items);
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Произошла ошибка при отмене брони');
        } finally {
            setCancelingId(null);
        }
    };

    if (temporaryReservations.length === 0) {
        return null;
    }

    return (
        <TemporaryReservationsContainer>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Ожидают подтверждения оплаты
            </h2>
            {error && (
                <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    {error}
                </div>
            )}
            <div className="space-y-3">
                {temporaryReservations.map((reservation) => {
                    const court = courts.find(c => c.id === reservation.court_id);
                    const isProcessing = cancelingId === reservation.id;

                    return (
                        <TemporaryReservationCard key={reservation.id}>
                            <div className="flex flex-col gap-1">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {court?.name}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {format(new Date(reservation.date), 'd MMMM yyyy', { locale: ru })} в {reservation.time}:00
                                </div>
                                <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                    {court?.price} ₽
                                </div>
                            </div>
                            <ButtonGroup>
                                <CancelButton
                                    onClick={() => handleCancelReservation(reservation.id)}
                                    disabled={isProcessing}
                                >
                                    {cancelingId === reservation.id ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Отмена...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Отменить
                                        </>
                                    )}
                                </CancelButton>
                            </ButtonGroup>
                        </TemporaryReservationCard>
                    );
                })}
            </div>
        </TemporaryReservationsContainer>
    );
});

const Courts = () => {
    const { currentUser } = useAuth();
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [temporaryReservations, setTemporaryReservations] = useState<Reservation[]>([]);

    // Загрузка кортов и временных броней при монтировании
    useEffect(() => {
        let isMounted = true;

        const fetchInitialData = async () => {
            try {
                // Загружаем корты для всех пользователей
                const courtsResponse = await api.get('/courts/');

                if (isMounted) {
                    setCourts(courtsResponse.data.items);
                }

                // Загружаем временные брони только для авторизованных пользователей
                if (currentUser) {
                    const temporaryResponse = await api.get('/court_reservations/my_temporary_reservations');
                    if (isMounted) {
                        setTemporaryReservations(temporaryResponse.data.items);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    // Показываем ошибку только если не удалось загрузить корты
                    if (err.response?.status !== 401) {
                        setError('Не удалось загрузить информацию о кортах');
                        console.error('Error fetching initial data:', err);
                    }
                }
            }
        };

        fetchInitialData();

        return () => {
            isMounted = false;
        };
    }, [currentUser]); // Добавляем currentUser в зависимости

    // Загрузка резерваций - выполняется при изменении даты
    useEffect(() => {
        let isMounted = true;

        const fetchReservations = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/court_reservations/all/${format(selectedDate, 'yyyy-MM-dd')}`);
                if (isMounted) {
                    setReservations(response.data.items);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Не удалось загрузить информацию о бронированиях');
                    console.error('Error fetching reservations:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchReservations();

        return () => {
            isMounted = false;
        };
    }, [selectedDate]); // Зависимость только от выбранной даты

    const handlePrevWeek = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    }, [currentWeekStart]);

    const handleNextWeek = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    }, [currentWeekStart]);

    const handleDateSelect = useCallback((date: Date) => {
        setSelectedDate(date);
    }, []);

    const handleReservationsUpdate = useCallback((newReservations: Reservation[]) => {
        setReservations(newReservations);
    }, []);

    const handleTemporaryReservationsUpdate = useCallback(async () => {
        if (currentUser) {
            try {
                const response = await api.get('/court_reservations/my_temporary_reservations');
                setTemporaryReservations(response.data.items);
            } catch (err) {
                console.error('Error fetching temporary reservations:', err);
            }
        }
    }, [currentUser]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Загрузка...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <StaticHeader />
            <CourtContainer>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <CourtImage />
                </motion.div>

                <DynamicContent
                    currentWeekStart={currentWeekStart}
                    selectedDate={selectedDate}
                    courts={courts}
                    reservations={reservations}
                    currentUser={currentUser}
                    onDateSelect={handleDateSelect}
                    onPrevWeek={handlePrevWeek}
                    onNextWeek={handleNextWeek}
                    onReservationsUpdate={handleReservationsUpdate}
                    onTemporaryReservationsUpdate={handleTemporaryReservationsUpdate}
                />

                <TemporaryReservations
                    courts={courts}
                    onReservationsUpdate={handleReservationsUpdate}
                    temporaryReservations={temporaryReservations}
                    onTemporaryReservationsUpdate={handleTemporaryReservationsUpdate}
                />
            </CourtContainer>
        </div>
    );
};

export default Courts; 