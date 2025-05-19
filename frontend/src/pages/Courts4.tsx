import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #f6f8fd 0%, #f1f4f9 100%);
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #4f46e5, #818cf8);
    border-radius: 2px;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(90deg, #1a1a1a, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const CourtsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const CourtCard = styled(motion.div)`
  background: white;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }
`;

const CourtImageContainer = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;
`;

const CourtImage = styled.div<{ image: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
`;

const CourtOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  color: white;
`;

const CourtName = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const CourtPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #4f46e5;
  background: rgba(255,255,255,0.9);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  display: inline-block;
  margin-top: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const CourtContent = styled.div`
  padding: 2rem;
`;

const TimeSlotsContainer = styled.div`
  margin-top: 1.5rem;
`;

const TimeSlotsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TimeSlotsTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const TimeSlotsLegend = styled.div`
  display: flex;
  gap: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const TimeSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
`;

const TimeSlot = styled.div<{ available: boolean; selected: boolean }>`
  background: ${({ available, selected }) =>
    selected ? '#4f46e5' : available ? '#f3f4f6' : '#fee2e2'};
  color: ${({ available, selected }) =>
    selected ? 'white' : available ? '#1a1a1a' : '#ef4444'};
  padding: 0.75rem;
  border-radius: 0.75rem;
  text-align: center;
  cursor: ${({ available }) => (available ? 'pointer' : 'not-allowed')};
  transition: all 0.2s ease;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: ${({ available }) => (available ? 'scale(1.05)' : 'none')};
  }
`;

const ReservationButton = styled(motion.button)`
  background: linear-gradient(90deg, #4f46e5, #818cf8);
  color: white;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-weight: 600;
  width: 100%;
  margin-top: 2rem;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(79,70,229,0.3);
  }
`;

const Courts4 = () => {
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

  const handleCourtHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const image = e.currentTarget.querySelector('div[class*="CourtImage"]') as HTMLElement;
    if (image) {
      image.style.transform = 'scale(1.05)';
    }
  };

  const handleCourtLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const image = e.currentTarget.querySelector('div[class*="CourtImage"]') as HTMLElement;
    if (image) {
      image.style.transform = 'scale(1)';
    }
  };

  return (
    <PageContainer>
      <Header>
        <Title>Теннисные корты</Title>
        <Subtitle>Выберите удобное время для игры в теннис</Subtitle>
      </Header>

      <CourtsContainer>
        {courts.map((court) => (
          <CourtCard
            key={court.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: court.id * 0.1 }}
            onMouseEnter={handleCourtHover}
            onMouseLeave={handleCourtLeave}
          >
            <CourtImageContainer>
              <CourtImage image={court.image} />
              <CourtOverlay>
                <CourtName>{court.name}</CourtName>
                <CourtPrice>{court.price} ₽/час</CourtPrice>
              </CourtOverlay>
            </CourtImageContainer>

            <CourtContent>
              <TimeSlotsContainer>
                <TimeSlotsHeader>
                  <TimeSlotsTitle>Доступное время</TimeSlotsTitle>
                  <TimeSlotsLegend>
                    <LegendItem>
                      <LegendColor color="#f3f4f6" />
                      <span>Свободно</span>
                    </LegendItem>
                    <LegendItem>
                      <LegendColor color="#ef4444" />
                      <span>Занято</span>
                    </LegendItem>
                    <LegendItem>
                      <LegendColor color="#4f46e5" />
                      <span>Выбрано</span>
                    </LegendItem>
                  </TimeSlotsLegend>
                </TimeSlotsHeader>

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
            </CourtContent>
          </CourtCard>
        ))}
      </CourtsContainer>
    </PageContainer>
  );
};

export default Courts4; 