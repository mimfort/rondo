import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import { format, addDays, isBefore, startOfToday, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import image1 from '../assets/photoCourts/1.jpg';
import image2 from '../assets/photoCourts/2.jpg';
import image3 from '../assets/photoCourts/3.jpg';
import image4 from '../assets/photoCourts/4.jpg';
import image5 from '../assets/photoCourts/5.jpg';
import image6 from '../assets/photoCourts/6.jpg';
import TelegramDarkLightIcon from '../assets/icons/telegram-dark-light.svg';

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
  background: var(--card-background);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);

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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  font-size: 1rem;

  &:hover {
    background: ${({ isSelected }) => (isSelected ? '#6d4aff' : '#e5e7eb')};
    transform: translateY(-2px);
  }

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
  box-shadow: 0 6px 10px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Добавлена тень */
`;

const CourtImage = styled.div`
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center;
  border-radius: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    height: 200px;
    border-radius: 0.75rem;
  }
`;

const CarouselContainer = styled.div`
  margin-top: 2rem;
  .swiper {
    width: 100%;
    height: 300px;
  }
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1rem;
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
  font-size: 1.1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.25rem;
    font-size: 1rem;
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

const TelegramLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: var(--text-color);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-color);
  }

  img {
    width: 24px;
    height: 24px;
    filter: invert(0); /* Светлая тема */
  }

  @media (prefers-color-scheme: dark) {
    img {
      filter: invert(1); /* Тёмная тема */
    }
  }
`;

const AdminContact = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--text-color);
  text-align: center;

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: var(--primary-hover-color);
    }
  }
`;

const Footer = styled.footer`
  margin-top: 2rem;
  padding: 1rem;
  text-align: center;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  color: var(--text-color);
  background-color: var(--background-color);

  @media (max-width: 768px) {
    font-size: 0.8rem;
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
    is_social?: boolean;
}

const StaticHeader = React.memo(() => {
    const [selectedImage, setSelectedImage] = useState(image1);
    const images = [image1, image2, image3, image4, image5, image6];

    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedImage((prevImage) => {
                const currentIndex = images.indexOf(prevImage);
                const nextIndex = (currentIndex + 1) % images.length;
                return images[nextIndex];
            });
        }, 3000); // Меняем изображение каждые 3 секунды

        return () => clearInterval(interval);
    }, [images]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
        >
            <h1 className="text-6xl font-extrabold text-[#6D4AFF] mb-4">
                КОРТЫ
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
                Аренда теннисных кортов
            </p>
            <div className="mt-8">
                <div className="flex justify-center mb-4">
                    <img
                        src={selectedImage}
                        alt="Выбранное изображение"
                        className="rounded-lg shadow-lg w-full max-w-3xl h-auto object-cover"
                    />
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            className="focus:outline-none"
                            onClick={() => setSelectedImage(image)}
                        >
                            <img
                                src={image}
                                alt={`Корт ${index}`}
                                className={`rounded-lg shadow-md w-20 h-20 object-cover transition-transform duration-300 ${selectedImage === image ? 'ring-4 ring-indigo-500 scale-105' : ''}`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
});

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
            const maxDate = addDays(today, 7); // Максимальная дата - через неделю от сегодня
            const isDisabled = isBefore(date, today) || isBefore(maxDate, date); // Отключаем даты в прошлом и за пределами недели

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
        for (let hour = 9; hour <= 20; hour++) {
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
                isTemporary: !reservation.is_confirmed,
                isSocial: reservation.is_social === true
            };
        }

        return {
            available: true,
            isTemporary: false,
            isSocial: false
        };
    };

    const handleTimeSelect = (court: Court, time: number) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (!court.is_available) {
            toast.error('Этот корт недоступен для бронирования.');
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

        } catch (error: any) {
            console.error('Ошибка при создании временной брони:', error);
            if (error.response?.data?.detail === 'Укажите имя и фамилию в профиле') {
                toast.error('Пожалуйста, укажите имя и фамилию в вашем профиле.');
            } else {
                toast.error('Не удалось создать временную бронь');
            }
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
                                const { available, isTemporary, isSocial } = isTimeSlotAvailable(court.id, time);
                                const isSelected = selectedCourt?.id === court.id && selectedTimeSlot === time.toString();

                                return (
                                    <div key={time}>
                                        <TimeSlot
                                            available={available}
                                            selected={isSelected}
                                            onClick={(e) => handleTimeSelect(court, time)}
                                            style={{
                                                background: isSocial ? '#3B82F6' : isTemporary ? '#FCD34D' : available ? '#34d399' : '#ef4444'
                                            }}
                                        >
                                            <span>{`${time}:00`}</span>
                                            <span>
                                                {isSocial ? 'Секция' : isTemporary ? 'Ожидает оплаты' : available ? 'Доступно' : 'Занято'}
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
            <Footer>
                <TelegramLink href="https://t.me/courtsnd" target="_blank" rel="noopener noreferrer">
                    <img src={TelegramDarkLightIcon} alt="Telegram" />
                    Подписывайтесь на наш Telegram-канал
                </TelegramLink>
                <AdminContact>
                    Администратор: <br />
                    Телефон: +7 812 750-79-05 <br />
                    ТГ: <a href="https://t.me/tennisnd" target="_blank" rel="noopener noreferrer">@tennisnd</a>
                </AdminContact>
            </Footer>
        </div>
    );
};

export default Courts;