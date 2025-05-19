import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
`;

const CourtsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const CourtCard = styled(motion.div)`
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  padding: 2rem;
  position: relative;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CourtImage = styled.div<{ image: string }>`
  width: 100%;
  height: 300px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  border-radius: 1rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
    border-radius: 1rem;
  }
`;

const CourtInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CourtHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CourtName = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const CourtPrice = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: #4f46e5;
`;

const TimeSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TimeSlot = styled.div<{ available: boolean; selected: boolean }>`
  background: ${({ available, selected }) =>
        selected ? '#4f46e5' : available ? '#f3f4f6' : '#fee2e2'};
  color: ${({ available, selected }) =>
        selected ? 'white' : available ? '#1a1a1a' : '#ef4444'};
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
  cursor: ${({ available }) => (available ? 'pointer' : 'not-allowed')};
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    transform: ${({ available }) => (available ? 'scale(1.05)' : 'none')};
  }
`;

const ReservationButton = styled(motion.button)`
  background: #4f46e5;
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  width: 100%;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: #4338ca;
  }
`;

const Courts3 = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedCourt, setSelectedCourt] = useState<number | null>(null);

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
        <PageContainer>
            <Header>
                <Title>Теннисные корты</Title>
                <Subtitle>Выберите удобное время для игры</Subtitle>
            </Header>

            <CourtsContainer>
                {courts.map((court) => (
                    <CourtCard
                        key={court.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: court.id * 0.1 }}
                    >
                        <CourtImage image={court.image} />
                        <CourtInfo>
                            <CourtHeader>
                                <CourtName>{court.name}</CourtName>
                                <CourtPrice>{court.price} ₽/час</CourtPrice>
                            </CourtHeader>

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
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Забронировать на {selectedTime}
                                </ReservationButton>
                            )}
                        </CourtInfo>
                    </CourtCard>
                ))}
            </CourtsContainer>
        </PageContainer>
    );
};

export default Courts3; 