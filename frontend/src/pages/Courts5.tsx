import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6B7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const CourtsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const CourtCard = styled(motion.div)`
  background: #F9FAFB;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const CourtImage = styled.div<{ image: string }>`
  width: 100%;
  height: 300px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%);
  }
`;

const CourtInfo = styled.div`
  padding: 2rem;
`;

const CourtName = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const CourtPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #059669;
  margin-bottom: 1.5rem;
`;

const TimeSlotsContainer = styled.div`
  margin-top: 1.5rem;
`;

const TimeSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
`;

const TimeSlot = styled(motion.div) <{ available: boolean; selected: boolean }>`
  background: ${({ available, selected }) =>
        selected ? '#059669' : available ? '#F3F4F6' : '#FEE2E2'};
  color: ${({ available, selected }) =>
        selected ? 'white' : available ? '#374151' : '#DC2626'};
  padding: 0.75rem;
  border-radius: 0.75rem;
  text-align: center;
  cursor: ${({ available }) => (available ? 'pointer' : 'not-allowed')};
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    transform: ${({ available }) => (available ? 'scale(1.05)' : 'none')};
  }
`;

const ReservationButton = styled(motion.button)`
  background: #059669;
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  width: 100%;
  margin-top: 2rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #047857;
  }
`;

const StatusLegend = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: #F9FAFB;
  border-radius: 0.75rem;
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
  color: #6B7280;
`;

const Courts5 = () => {
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
                <Subtitle>Выберите удобное время для игры в теннис</Subtitle>
            </Header>

            <CourtsGrid>
                {courts.map((court) => (
                    <CourtCard
                        key={court.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: court.id * 0.1 }}
                    >
                        <CourtImage image={court.image} />
                        <CourtInfo>
                            <CourtName>{court.name}</CourtName>
                            <CourtPrice>{court.price} ₽/час</CourtPrice>

                            <TimeSlotsContainer>
                                <TimeSlotsGrid>
                                    {generateTimeSlots().map((time) => (
                                        <TimeSlot
                                            key={time}
                                            available={isTimeSlotAvailable(court.id, time)}
                                            selected={selectedCourt === court.id && selectedTime === time}
                                            onClick={() => handleTimeSelect(court.id, time)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {time}
                                        </TimeSlot>
                                    ))}
                                </TimeSlotsGrid>
                            </TimeSlotsContainer>

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
            </CourtsGrid>

            <StatusLegend>
                <LegendItem>
                    <LegendColor color="#F3F4F6" />
                    <LegendText>Свободно</LegendText>
                </LegendItem>
                <LegendItem>
                    <LegendColor color="#FEE2E2" />
                    <LegendText>Занято</LegendText>
                </LegendItem>
                <LegendItem>
                    <LegendColor color="#059669" />
                    <LegendText>Выбрано</LegendText>
                </LegendItem>
            </StatusLegend>
        </PageContainer>
    );
};

export default Courts5; 