import React, { useState } from 'react';
import styled from 'styled-components';

const CoworkingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    border-radius: 2px;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  background: linear-gradient(90deg, #1e293b, #334155);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  font-weight: 800;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PlacesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const PlaceCard = styled.div<{ isOccupied: boolean; isSelected?: boolean }>`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  ${props => props.isSelected && `
    border: 2px solid #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  `}

  ${props => props.isOccupied && `
    opacity: 0.7;
    pointer-events: none;
  `}
`;

const PlaceImage = styled.div<{ isOccupied: boolean }>`
  height: 160px;
  background: ${props => props.isOccupied ?
    'linear-gradient(45deg, #fee2e2 0%, #fecaca 100%)' :
    'linear-gradient(45deg, #e0e7ff 0%, #c7d2fe 100%)'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
`;

const PlaceStatus = styled.div<{ isOccupied: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => props.isOccupied ? '#fee2e2' : '#e0e7ff'};
  color: ${props => props.isOccupied ? '#ef4444' : '#6366f1'};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const PlaceContent = styled.div`
  padding: 1.5rem;
`;

const PlaceNumber = styled.h3`
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 24px;
    height: 24px;
    color: #6366f1;
  }
`;

const PlaceFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const PlaceFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;

  svg {
    width: 16px;
    height: 16px;
    color: #6366f1;
  }
`;

const BookingModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.875rem;
  background: linear-gradient(90deg, #1e293b, #334155);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const ModalDescription = styled.p`
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const Coworking: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const places = [
    { id: 1, isOccupied: Math.random() > 0.5 },
    { id: 2, isOccupied: Math.random() > 0.5 },
    { id: 3, isOccupied: Math.random() > 0.5 },
    { id: 4, isOccupied: Math.random() > 0.5 },
    { id: 5, isOccupied: Math.random() > 0.5 },
    { id: 6, isOccupied: Math.random() > 0.5 },
    { id: 7, isOccupied: Math.random() > 0.5 },
    { id: 8, isOccupied: Math.random() > 0.5 },
  ];

  const handlePlaceClick = (placeId: number) => {
    if (!places[placeId - 1].isOccupied) {
      setSelectedPlace(placeId);
      setIsModalOpen(true);
    }
  };

  return (
    <CoworkingContainer>
      <Header>
        <Title>Коворкинг</Title>
        <Subtitle>
          Выберите удобное рабочее место для продуктивной работы
        </Subtitle>
      </Header>

      <MainContent>
        <PlacesGrid>
          {places.map(place => (
            <PlaceCard
              key={place.id}
              isOccupied={place.isOccupied}
              isSelected={selectedPlace === place.id}
              onClick={() => handlePlaceClick(place.id)}
            >
              <PlaceImage isOccupied={place.isOccupied}>
                <PlaceStatus isOccupied={place.isOccupied}>
                  {place.isOccupied ? 'Занято' : 'Свободно'}
                </PlaceStatus>
              </PlaceImage>
              <PlaceContent>
                <PlaceNumber>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Место {place.id}
                </PlaceNumber>
                <PlaceFeatures>
                  <PlaceFeature>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Wi-Fi
                  </PlaceFeature>
                  <PlaceFeature>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Розетка
                  </PlaceFeature>
                  <PlaceFeature>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    24/7
                  </PlaceFeature>
                  <PlaceFeature>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Охрана
                  </PlaceFeature>
                </PlaceFeatures>
              </PlaceContent>
            </PlaceCard>
          ))}
        </PlacesGrid>
      </MainContent>

      <BookingModal isOpen={isModalOpen}>
        <ModalContent>
          <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
          <ModalTitle>Бронирование места {selectedPlace}</ModalTitle>
          <ModalDescription>
            Выберите удобное время для работы. Минимальное время бронирования - 1 час.
            При бронировании на весь день предоставляется скидка 20%.
          </ModalDescription>
          <Button onClick={() => setIsModalOpen(false)}>
            Продолжить бронирование
          </Button>
        </ModalContent>
      </BookingModal>
    </CoworkingContainer>
  );
};

export default Coworking; 