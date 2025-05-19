import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  max-width: 100%;
  margin: 0;
  padding: 0;
  background: #0f172a;
  min-height: 100vh;
  color: #f8fafc;
`;

const Header = styled.div`
  position: relative;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)),
                url('https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
    background-size: cover;
    background-position: center;
    filter: blur(2px);
    transform: scale(1.1);
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 0 2rem;
`;

const Title = styled.h1`
  font-size: 5rem;
  font-weight: 900;
  color: #f8fafc;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #e2e8f0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CourtsContainer = styled.div`
  max-width: 1400px;
  margin: -5rem auto 0;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const CourtsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const CourtCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6);
  }
`;

const CourtImage = styled.div<{ image: string }>`
  width: 100%;
  height: 250px;
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
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
  }
`;

const CourtInfo = styled.div`
  padding: 2rem;
`;

const CourtName = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.5rem;
`;

const CourtPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 1.5rem;
`;

const TimeSlotsContainer = styled.div`
  margin-top: 1.5rem;
`;

const TimeSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 0.75rem;
`;

const TimeSlot = styled(motion.div) <{ available: boolean; selected: boolean }>`
  background: ${({ available, selected }) =>
        selected ? '#10b981' : available ? 'rgba(255, 255, 255, 0.1)' : 'rgba(239, 68, 68, 0.2)'};
  color: ${({ available, selected }) =>
        selected ? '#f8fafc' : available ? '#e2e8f0' : '#f87171'};
  padding: 0.75rem;
  border-radius: 0.75rem;
  text-align: center;
  cursor: ${({ available }) => (available ? 'pointer' : 'not-allowed')};
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid ${({ available, selected }) =>
        selected ? '#10b981' : available ? 'rgba(255, 255, 255, 0.1)' : 'rgba(239, 68, 68, 0.3)'};
  
  &:hover {
    transform: ${({ available }) => (available ? 'scale(1.05)' : 'none')};
    background: ${({ available, selected }) =>
        selected ? '#10b981' : available ? 'rgba(255, 255, 255, 0.15)' : 'rgba(239, 68, 68, 0.2)'};
  }
`;

const ReservationButton = styled(motion.button)`
  background: #10b981;
  color: #f8fafc;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  width: 100%;
  margin-top: 2rem;
  transition: all 0.2s ease;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  
  &:hover {
    background: #059669;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const StatusLegend = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const LegendText = styled.span`
  font-size: 0.875rem;
  color: #e2e8f0;
`;

const Courts6 = () => {
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
                <HeaderContent>
                    <Title>Теннисные корты</Title>
                    <Subtitle>Выберите удобное время для игры в теннис</Subtitle>
                </HeaderContent>
            </Header>

            <CourtsContainer>
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
                        <LegendColor color="rgba(255, 255, 255, 0.1)" />
                        <LegendText>Свободно</LegendText>
                    </LegendItem>
                    <LegendItem>
                        <LegendColor color="rgba(239, 68, 68, 0.2)" />
                        <LegendText>Занято</LegendText>
                    </LegendItem>
                    <LegendItem>
                        <LegendColor color="#10b981" />
                        <LegendText>Выбрано</LegendText>
                    </LegendItem>
                </StatusLegend>
            </CourtsContainer>
        </PageContainer>
    );
};

export default Courts6; 