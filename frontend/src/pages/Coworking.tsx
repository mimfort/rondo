import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import toast from 'react-hot-toast';
import { coworkingService } from '../api/services';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface CoworkingPlace {
  id: number;
  name: string;
  is_available: boolean;
}

interface CoworkingReservation {
  id: number;
  coworking_id: number;
  coworking: {
    name: string;
  };
  start_time: string;
}

interface PlaceProps {
  available: boolean;
  selected: boolean;
  position: {
    x: number;
    y: number;
  };
}

// Styled components для 3D карты
const Room = styled.div`
    position: relative;
    width: 800px;
    height: 600px;
    margin: 2rem auto;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: #f8fafc;
    padding: 2rem;
    padding-bottom: 3rem;
    
    @media (max-width: 868px) {
        width: 100%;
        height: 500px;
        padding: 1rem;
        padding-bottom: 2.5rem;
        margin: 1rem auto;
    }

    @media (max-width: 480px) {
        height: 400px;
        padding: 0.5rem;
        padding-bottom: 2rem;
    }

    .dark & {
        background: #1f2937;
        border-color: #374151;
    }
`;

const Windows = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 20px;
    display: flex;
    justify-content: space-around;
    padding: 0 100px;

    @media (max-width: 868px) {
        padding: 0 50px;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        background: #e5e7eb;

        .dark & {
            background: #374151;
        }
    }
`;

const Window = styled.div`
    width: 80px;
    height: 100%;
    background: #93c5fd;
    position: relative;
    z-index: 1;

    @media (max-width: 868px) {
        width: 40px;
    }

    .dark & {
        background: #60a5fa;
    }
`;

const Divider = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 2px;
    background: #e5e7eb;

    .dark & {
        background: #374151;
    }
`;

const Place = styled.div<PlaceProps>`
    position: absolute;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: ${({ selected, available }) =>
    selected ? '#818cf8' :
      available ? '#34d399' : '#ef4444'};
    cursor: ${({ available }) => available ? 'pointer' : 'default'};
    opacity: ${({ available }) => available ? 1 : 0.6};
    left: ${({ position }) => (position?.x || 0)}px;
    top: ${({ position }) => (position?.y || 0)}px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 500;
    z-index: 2;

    @media (max-width: 868px) {
        width: 40px;
        height: 40px;
        font-size: 12px;
    }

    @media (max-width: 480px) {
        width: 35px;
        height: 35px;
        font-size: 11px;
    }

    &:hover {
        transform: ${({ available }) => available ? 'scale(1.1)' : 'none'};
    }

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);

        @media (max-width: 868px) {
            width: 30px;
            height: 30px;
        }

        @media (max-width: 480px) {
            width: 25px;
            height: 25px;
        }

        .dark & {
            background: rgba(255, 255, 255, 0.1);
        }
    }

    .dark & {
        background: ${({ selected, available }) =>
    selected ? '#6366f1' :
      available ? '#059669' : '#dc2626'};
    }
`;

const Entrance = styled.div`
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: #4b5563;
    font-size: 14px;
    font-weight: 500;
    padding: 4px 8px;
    background: #f3f4f6;
    border-radius: 4px;
    
    @media (max-width: 868px) {
        font-size: 12px;
        padding: 3px 6px;
    }
    
    @media (max-width: 480px) {
        font-size: 11px;
        padding: 2px 4px;
    }

    .dark & {
        color: #d1d5db;
        background: #374151;
    }
`;

const Coworking = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);

  // Функция для расчета позиций мест на основе их количества
  const calculatePositions = (places: CoworkingPlace[] | undefined) => {
    if (!places) return {};

    const positions: Record<number, { x: number; y: number }> = {};
    const totalPlaces = places.length;
    const placesPerRow = Math.ceil(totalPlaces / 2);

    const getLayoutConfig = () => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 868;
      if (width <= 480) {
        return {
          containerWidth: width - 20,
          topY: 80,
          bottomY: 320,
          sideMargin: 25,
          placeSize: 35
        };
      } else if (width <= 868) {
        return {
          containerWidth: width - 40,
          topY: 120,
          bottomY: 380,
          sideMargin: 35,
          placeSize: 40
        };
      }
      return {
        containerWidth: 700,
        topY: 120,
        bottomY: 380,
        sideMargin: 60,
        placeSize: 60
      };
    };

    places.forEach((place, index) => {
      const isTopRow = index < placesPerRow;
      const positionInRow = isTopRow ? index : index - placesPerRow;
      const config = getLayoutConfig();

      // Вычисляем доступную ширину для размещения мест с учетом размера мест
      const availableWidth = config.containerWidth - (2 * config.sideMargin) - config.placeSize;
      // Расстояние между местами (с учетом размера места)
      const spacing = availableWidth / (placesPerRow - 1);

      // Вычисляем x-координату с учетом размера места
      let x;
      if (positionInRow === 0) {
        x = config.sideMargin;
      } else if (positionInRow === placesPerRow - 1) {
        x = config.containerWidth - config.sideMargin - config.placeSize;
      } else {
        x = config.sideMargin + (spacing * positionInRow);
      }

      positions[place.id] = {
        x,
        y: isTopRow ? config.topY : config.bottomY
      };
    });

    return positions;
  };

  const { data: places } = useQuery({
    queryKey: ['coworking'],
    queryFn: async () => {
      const response = await coworkingService.getAllCoworking();
      const data = response.data as { items: CoworkingPlace[] };
      // Сортируем места по ID, чтобы сохранить порядок после бронирования
      data.items = data.items.sort((a, b) => a.id - b.id);
      return data;
    }
  });

  const placePositions = calculatePositions(places?.items);

  const { data: activeReservation } = useQuery({
    queryKey: ['activeReservations'],
    queryFn: async () => {
      const response = await coworkingService.getActiveReservations();
      return response.data as { items: CoworkingReservation[] };
    },
    enabled: !!currentUser
  });

  const createReservationMutation = useMutation({
    mutationFn: (coworking_id: number) => coworkingService.createReservation({ coworking_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coworking'] });
      queryClient.invalidateQueries({ queryKey: ['activeReservations'] });
      toast.success('Место успешно забронировано');
      setSelectedPlace(null);
    },
    onError: () => {
      toast.error('Ошибка при бронировании места');
    }
  });

  const closeReservationMutation = useMutation({
    mutationFn: (coworking_id: number) => coworkingService.closeReservation({ coworking_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coworking'] });
      queryClient.invalidateQueries({ queryKey: ['activeReservations'] });
      toast.success('Бронь успешно закрыта');
    },
    onError: () => {
      toast.error('Ошибка при закрытии брони');
    }
  });

  const handlePlaceClick = (place: any) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!place.is_available) return;
    setSelectedPlace(selectedPlace === place.id ? null : place.id);
  };

  const handleReservation = () => {
    if (!selectedPlace) return;
    createReservationMutation.mutate(selectedPlace);
  };

  const handleCloseReservation = (coworking_id: number) => {
    closeReservationMutation.mutate(coworking_id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Коворкинг
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Выберите удобное место для работы
        </p>
      </motion.div>

      {/* 3D карта коворкинга */}
      <div className="overflow-x-hidden">
        <Room>
          <Windows>
            <Window />
            <Window />
            <Window />
          </Windows>
          <Divider />
          {places?.items.map((place: CoworkingPlace) => (
            <Place
              key={place.id}
              available={place.is_available}
              selected={selectedPlace === place.id}
              position={placePositions[place.id]}
              onClick={() => handlePlaceClick(place)}
            >
              <span className="text-white font-medium">
                {place.name}
              </span>
            </Place>
          ))}
          <Entrance>Вход</Entrance>
        </Room>
      </div>

      {/* Информация о выбранном месте и активной брони */}
      <div className="max-w-2xl mx-auto mt-8">
        {selectedPlace && places?.items && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Забронировать место
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Вы выбрали место {places.items.find((p) => p.id === selectedPlace)?.name}
            </p>
            <button
              onClick={handleReservation}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
            >
              Забронировать
            </button>
          </motion.div>
        )}

        {activeReservation?.items && activeReservation.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Ваша активная бронь
            </h2>
            {activeReservation.items.map((reservation) => (
              <div key={reservation.id} className="flex justify-between items-center">
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {reservation.coworking.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Начало: {new Date(reservation.start_time).toLocaleString('ru-RU')}
                  </p>
                </div>
                <button
                  onClick={() => handleCloseReservation(reservation.coworking_id)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                >
                  Завершить
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Coworking; 