import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';

const CourtContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CourtsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const CourtCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
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

  &:hover {
    transform: ${({ available }) => available ? 'scale(1.02)' : 'none'};
  }
`;

const CourtImage = styled.div`
  width: 100%;
  height: 400px;
  background-image: url('https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
`;

interface Court {
    id: number;
    name: string;
    description: string;
    price: number;
    is_available: boolean;
    not_available_dates: string[];
}

const Courts = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const response = await api.get('/courts/');
                setCourts(response.data.items);
            } catch (err) {
                setError('Не удалось загрузить информацию о кортах');
                console.error('Error fetching courts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourts();
    }, []);

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 10; hour <= 21; hour++) {
            slots.push(`${hour}:00`);
        }
        return slots;
    };

    const handleTimeSelect = (courtId: number, time: string) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setSelectedCourt(courtId);
        setSelectedTime(time);
    };

    const isTimeSlotAvailable = (court: Court, time: string) => {
        if (!court.is_available) return false;

        const today = new Date();
        const [hours] = time.split(':').map(Number);
        const slotDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours);
        const dateString = slotDate.toISOString().split('T')[0];

        return !court.not_available_dates?.includes(dateString);
    };

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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Теннисные корты
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Забронируйте время для игры
                </p>
            </motion.div>

            <CourtContainer>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <CourtImage />
                </motion.div>

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
                                {generateTimeSlots().map((time) => (
                                    <TimeSlot
                                        key={time}
                                        available={isTimeSlotAvailable(court, time)}
                                        selected={selectedCourt === court.id && selectedTime === time}
                                        onClick={() => handleTimeSelect(court.id, time)}
                                    >
                                        <span>{time}</span>
                                        <span>
                                            {isTimeSlotAvailable(court, time) ? 'Доступно' : 'Занято'}
                                        </span>
                                    </TimeSlot>
                                ))}
                            </div>
                        </CourtCard>
                    ))}
                </CourtsGrid>
            </CourtContainer>
        </div>
    );
};

export default Courts; 