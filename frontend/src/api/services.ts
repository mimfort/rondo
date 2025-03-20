import api from './config';
import type { Event, LoginForm, RegisterForm, EventForm, Registration, User } from '../types';
import axios from 'axios';

export const authService = {
    login: (data: LoginForm) => api.post('/users/auth', data),
    register: (data: RegisterForm) => api.post('/users/register', data),
    getCurrentUser: () => api.get<User>('/users/me'),
    setAuthToken: (token: string) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
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
        return response;
    },
    createEvent: async (data: FormData) => {
        console.log('Создание события с данными:', Object.fromEntries(data.entries()));
        try {
            const response = await api.post<Event>('/events/admin_create', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Ответ на создание события:', response);
            return response;
        } catch (error) {
            console.error('Ошибка при создании события:', error);
            if (axios.isAxiosError(error)) {
                console.error('Детали ошибки:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers,
                });
            }
            throw error;
        }
    },
    deleteEvent: (id: number) => api.delete(`/events/${id}`),
};

export const registrationService = {
    registerForEvent: (eventId: number) => api.post<Registration>(`/users/registration/${eventId}`),
    getUserRegistrations: () => api.get<Registration[]>('/users/registration/my_registration/info'),
    cancelRegistration: (eventId: number) => api.post(`/users/registration/disregistration/${eventId}`),
}; 