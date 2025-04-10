import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  max-width: 100%;
  margin: 0;
  padding: 0;
  background: #000;
  min-height: 100vh;
  color: #fff;
  position: relative;
  overflow: hidden;
  perspective: 1000px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Header = styled.div`
  position: relative;
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  padding: 0 2rem;
  transform-style: preserve-3d;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 0, 255, 0.2), rgba(0, 255, 255, 0.2));
    filter: blur(100px);
    transform: translateZ(-100px);
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  transform-style: preserve-3d;
`;

const Title = styled(motion.h1)`
  font-size: 5rem;
  font-weight: 900;
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
  text-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
  transform: translateZ(50px);
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: #fff;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transform: translateZ(30px);
  
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
  transform-style: preserve-3d;
`;

const CourtsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  perspective: 1000px;
`;

const CourtCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform-style: preserve-3d;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px) rotateX(5deg);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.4),
      inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }
`;

const CourtImage = styled.div<{ image: string }>`
  width: 100%;
  height: 250px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  position: relative;
  transform-style: preserve-3d;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 0, 255, 0.2), rgba(0, 255, 255, 0.2));
    transform: translateZ(-1px);
  }
`;

const CourtInfo = styled.div`
  padding: 2rem;
  transform-style: preserve-3d;
`;

const CourtName = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  transform: translateZ(20px);
`;

const CourtPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #00ffff;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  transform: translateZ(20px);
`;

const TimeSlotsContainer = styled.div`
  margin-top: 1.5rem;
  transform-style: preserve-3d;
`;

const TimeSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 0.75rem;
  transform-style: preserve-3d;
`;

const TimeSlot = styled(motion.div) <{ available: boolean; selected: boolean }>`
  background: ${({ available, selected }) =>
        selected ? 'linear-gradient(45deg, #ff00ff, #00ffff)' :
            available ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 0, 0, 0.1)'};
  color: ${({ available, selected }) =>
        selected ? '#fff' : available ? '#fff' : '#ff6b6b'};
  padding: 0.75rem;
  border-radius: 1rem;
  text-align: center;
  cursor: ${({ available }) => (available ? 'pointer' : 'not-allowed')};
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid ${({ available, selected }) =>
        selected ? 'transparent' : available ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0, 0, 0.2)'};
  transform-style: preserve-3d;
  
  &:hover {
    transform: ${({ available }) => (available ? 'scale(1.05) translateZ(10px)' : 'none')};
    box-shadow: ${({ available }) =>
        available ? '0 0 15px rgba(255, 0, 255, 0.3)' : 'none'};
  }
`;

const ReservationButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-weight: 600;
  width: 100%;
  margin-top: 2rem;
  transition: all 0.2s ease;
  border: none;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
  transform-style: preserve-3d;
  
  &:hover {
    box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
    transform: translateY(-2px) translateZ(20px);
  }
`;

const StatusLegend = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform-style: preserve-3d;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transform-style: preserve-3d;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  background: ${props => props.color};
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateZ(10px);
`;

const LegendText = styled.span`
  font-size: 0.875rem;
  color: #fff;
  transform: translateZ(10px);
`;

const Courts8 = () => {
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
                    <Title
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Теннисные корты
                    </Title>
                    <Subtitle
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Выберите удобное время для игры в теннис
                    </Subtitle>
                </HeaderContent>
            </Header>

            <CourtsContainer>
                <CourtsGrid>
                    {courts.map((court) => (
                        <CourtCard
                            key={court.id}
                            initial={{ opacity: 0, y: 20, rotateX: -15 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
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
                                                whileHover={{ scale: 1.05, translateZ: 10 }}
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
                                        whileHover={{ scale: 1.02, translateZ: 20 }}
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
                        <LegendColor color="rgba(255, 255, 255, 0.05)" />
                        <LegendText>Свободно</LegendText>
                    </LegendItem>
                    <LegendItem>
                        <LegendColor color="rgba(255, 0, 0, 0.1)" />
                        <LegendText>Занято</LegendText>
                    </LegendItem>
                    <LegendItem>
                        <LegendColor color="linear-gradient(45deg, #ff00ff, #00ffff)" />
                        <LegendText>Выбрано</LegendText>
                    </LegendItem>
                </StatusLegend>
            </CourtsContainer>
        </PageContainer>
    );
};

export default Courts8; 