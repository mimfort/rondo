import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #4a5568;
`;

const CourtsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CourtSection = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
`;

const CourtHeader = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
`;

const CourtImage = styled.div<{ image: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  filter: brightness(0.8);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const CourtInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CourtName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const CourtPrice = styled.span`
  font-size: 1.25rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
`;

const TimeSlotsContainer = styled.div`
  padding: 1.5rem;
`;

const TimeSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
`;

const TimeSlot = styled.div<{ available: boolean; selected: boolean }>`
  background: ${({ available, selected }) =>
        selected ? '#4f46e5' : available ? '#f3f4f6' : '#fee2e2'};
  color: ${({ available, selected }) =>
        selected ? 'white' : available ? '#1f2937' : '#ef4444'};
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 500;
  cursor: ${({ available }) => available ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: ${({ available }) => available ? 'translateY(-2px)' : 'none'};
    box-shadow: ${({ available }) => available ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0.5rem;
    border: 2px solid ${({ selected }) => selected ? '#4f46e5' : 'transparent'};
  }
`;

const ReservationButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #4338ca;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const StatusLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  background: ${props => props.color};
`;

const LegendText = styled.span`
  font-size: 0.875rem;
  color: #4b5563;
`;

const Courts = () => {
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
            image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 2,
            name: "Корт №2",
            price: 1000,
            is_available: true,
            image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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

    const handleReservation = () => {
        if (!selectedCourt || !selectedTime) return;
        // Здесь будет логика бронирования
        console.log(`Бронирование корта ${selectedCourt} на время ${selectedTime}`);
    };

    return (
        <PageContainer>
            <Header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Title>Теннисные корты</Title>
                <Subtitle>Выберите удобное время для игры</Subtitle>
            </Header>

            <CourtsGrid>
                {courts.map((court, index) => (
                    <CourtSection
                        key={court.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <CourtHeader>
                            <CourtImage image={court.image} />
                            <CourtInfo>
                                <CourtName>{court.name}</CourtName>
                                <CourtPrice>{court.price} ₽/час</CourtPrice>
                            </CourtInfo>
                        </CourtHeader>

                        <TimeSlotsContainer>
                            <TimeSlotsGrid>
                                {generateTimeSlots().map((time) => (
                                    <TimeSlot
                                        key={time}
                                        available={isTimeSlotAvailable(court.id, time)}
                                        selected={selectedCourt === court.id && selectedTime === time}
                                        onClick={() => handleTimeSelect(court.id, time)}
                                    >
                                        {time}
                                    </TimeSlot>
                                ))}
                            </TimeSlotsGrid>

                            {selectedCourt === court.id && selectedTime && (
                                <ReservationButton
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={handleReservation}
                                >
                                    Забронировать на {selectedTime}
                                </ReservationButton>
                            )}
                        </TimeSlotsContainer>
                    </CourtSection>
                ))}
            </CourtsGrid>

            <StatusLegend>
                <LegendItem>
                    <LegendColor color="#f3f4f6" />
                    <LegendText>Свободно</LegendText>
                </LegendItem>
                <LegendItem>
                    <LegendColor color="#4f46e5" />
                    <LegendText>Выбрано</LegendText>
                </LegendItem>
                <LegendItem>
                    <LegendColor color="#fee2e2" />
                    <LegendText>Занято</LegendText>
                </LegendItem>
            </StatusLegend>
        </PageContainer>
    );
};

export default Courts; 