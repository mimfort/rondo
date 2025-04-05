import { api } from '../api';
import type { AxiosResponse } from 'axios';
import type { Coworking, CoworkingReservation } from '../../types';

interface CoworkingResponse {
    items: Coworking[];
}

interface CoworkingHistoryResponse {
    items: CoworkingReservation[];
}

export const coworkingService = {
    getAllCoworking: () => {
        return api.get<CoworkingResponse>('/coworking');
    },

    getCoworkingById: (id: number) => {
        return api.get<Coworking>(`/coworking/${id}`);
    },

    createCoworking: (data: { name: string; description: string; is_available: boolean }) => {
        return api.post('/coworking', data);
    },

    updateCoworking: (id: number, data: { name: string; description: string; is_available: boolean }) => {
        return api.put(`/coworking/${id}`, data);
    },

    deleteCoworking: (id: number) => {
        return api.delete(`/coworking/${id}`);
    },

    createReservation: (data: { coworking_id: number }) => {
        return api.post('/coworking_reservations', data);
    },

    closeReservation: (data: { coworking_id: number }) => {
        return api.post('/coworking_reservations/close', data);
    },

    closeReservationAdmin: (data: { coworking_id: number }) => {
        return api.post('/coworking_reservations/close_admin', data);
    },

    getActiveReservations: () => {
        return api.get('/coworking_reservations/active');
    },

    getActiveReservationsAdmin: () => {
        return api.get('/coworking_reservations/active_admin');
    },

    getAllReservations: () => {
        return api.get('/coworking_reservations');
    },

    getAllReservationsByUser: () => {
        return api.get<CoworkingHistoryResponse>('/coworking_reservations/get_all_reservations_by_user');
    }
}; 