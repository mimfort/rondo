import api from './config';
import type { Event, LoginForm, RegisterForm, EventForm, Registration } from '../types';
import axios from 'axios';

interface User {
    id: number;
    username: string;
    email: string;
    avatar_url: string | null;
    created_at: string;
}

export const authService = {
    login: (data: LoginForm) => api.post('/users/auth', data),
    register: (data: RegisterForm) => api.post('/users/register', data),
    getCurrentUser: () => api.get<User>('/users/me'),
    logout: async () => {
        console.log('Starting logout process...');
        try {
            console.log('Sending quit request to /users/quit...');
            const response = await api.get('/users/quit');
            console.log('Quit response:', response);

            console.log('Clearing local storage...');
            localStorage.clear();
            sessionStorage.clear();

            console.log('Removing Authorization header...');
            delete api.defaults.headers.common['Authorization'];

            console.log('Redirecting to home page...');
            window.location.replace('/');
        } catch (error) {
            console.error('Error during logout:', error);
            // В случае ошибки все равно очищаем все данные
            localStorage.clear();
            sessionStorage.clear();
            delete api.defaults.headers.common['Authorization'];
            window.location.replace('/');
        }
    }
};

export const eventService = {
    getAllEvents: async () => {
        const response = await api.get<Event[]>('/events/');
        console.log('All events response:', response.data);
        return response;
    },
    getEventById: async (id: number) => {
        const response = await api.get<Event>(`/events/${id}`);
        console.log('Full response:', response);
        console.log('Response data:', response.data);
        console.log('Event date:', response.data.date);
        console.log('Event spots:', {
            available: response.data.available_spots,
            total: response.data.total_spots
        });
        return response;
    },
    createEvent: (data: EventForm) => api.post<Event>('/events/admin_create', data),
    deleteEvent: (id: number) => api.delete(`/events/${id}`),
};

export const registrationService = {
    registerForEvent: (eventId: number) => api.post<Registration>(`/events/registration/${eventId}`),
    getUserRegistrations: () => api.get<Registration[]>('/events/my_registration/info'),
}; 