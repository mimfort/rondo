import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const CourtContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
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
  height: 200px;
  background-image: url('https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Courts2 = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedCourt, setSelectedCourt] = useState<number | null>(null);

    // Моковые данные для двух кортов
    const courts = [
        {
            id: 1,
            name: "Корт №1",
            price: 1000,
            is_available: true,
            image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 2,
            name: "Корт №2",
            price: 1000,
            is_available: true,
            image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        }
    ];

    // Моковые данные для занятых слотов
    const occupiedSlots: Record<number, string[]> = {
        1: ["14:00", "15:00", "16:00"],
        2: ["12:00", "13:00", "19:00", "20:00"]
    };

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

    const isTimeSlotAvailable = (courtId: number, time: string) => {
        return !occupiedSlots[courtId]?.includes(time);
    };

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
                {courts.map((court) => (
                    <CourtCard
                        key={court.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: court.id * 0.1 }}
                    >
                        <CourtImage />
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {court.name}
                            </h2>
                            <span className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                                {court.price} ₽/час
                            </span>
                        </div>

                        <div className="space-y-2">
                            {generateTimeSlots().map((time) => (
                                <TimeSlot
                                    key={time}
                                    available={isTimeSlotAvailable(court.id, time)}
                                    selected={selectedCourt === court.id && selectedTime === time}
                                    onClick={() => handleTimeSelect(court.id, time)}
                                >
                                    <span>{time}</span>
                                    {isTimeSlotAvailable(court.id, time) ? (
                                        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Свободно</span>
                                    ) : (
                                        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Занято</span>
                                    )}
                                </TimeSlot>
                            ))}
                        </div>

                        {selectedCourt === court.id && selectedTime && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4"
                            >
                                <button
                                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
                                >
                                    Забронировать
                                </button>
                            </motion.div>
                        )}
                    </CourtCard>
                ))}
            </CourtContainer>
        </div>
    );
};

export default Courts2; 