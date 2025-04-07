import api from './config';
import type {
    Event,
    LoginForm,
    RegisterForm,
    EventForm,
    Registration,
    User,
    Tag,
    TagCreate,
    EventTag,
    Coworking,
    CoworkingReservation
} from '../types';
import axios from 'axios';

const BASE_URL = '/api';

export const authService = {
    login: (data: LoginForm) => api.post('/users/auth', data),
    register: (data: RegisterForm) => api.post('/users/registration', data),
    getCurrentUser: () => api.get<User>('/users/me'),
    setAuthToken: (token: string) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    removeAuthToken: () => {
        delete api.defaults.headers.common['Authorization'];
    },
    logout: async () => {
        try {
            const response = await api.get('/users/quit');
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            return response;
        } catch (error) {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            throw error;
        }
    },
    checkAuth: () => api.get('/users/me'),
    forgotPassword: async (data: { email: string }) => {
        return await api.post('/users/forgot_password', data);
    },
    resetPassword: async (data: { token: string; new_password: string }) => {
        return await api.post('/users/reset-password', data);
    },
    updateProfile: (data: { first_name: string; last_name: string }) => api.post('/users/update-profile', data),
};

export const eventService = {
    getAllEvents: async () => {
        const response = await api.get<Event[]>('/events/');
        // Преобразуем URL изображений
        const events = response.data.map(event => ({
            ...event,
            media_url: event.media_url ? (
                event.media_url.startsWith('http') ?
                    new URL(event.media_url).pathname :
                    event.media_url
            ) : null
        }));
        return { data: events };
    },
    getEventById: async (id: number) => {
        const response = await api.get<Event>(`/events/${id}`);
        // Преобразуем URL изображения
        const event = {
            ...response.data,
            media_url: response.data.media_url ? (
                response.data.media_url.startsWith('http') ?
                    new URL(response.data.media_url).pathname :
                    response.data.media_url
            ) : null
        };
        return { data: event };
    },
    getUploadedImages: async () => {
        try {
            console.log('Запрашиваем загруженные изображения...');
            const response = await api.get<{ images: string[] }>('/events/uploads');
            console.log('Ответ с изображениями:', response.data);
            // Возвращаем пути к изображениям как есть
            return response.data.images.map(image => {
                // Если путь уже начинается с /uploads, возвращаем как есть
                if (image.startsWith('/uploads/')) {
                    return image;
                }
                // Иначе добавляем /uploads/
                return `/uploads/${image}`;
            });
        } catch (error) {
            console.error('Ошибка при получении изображений:', error);
            throw error;
        }
    },
    createEvent: async (data: FormData) => {
        console.log('Создание события с данными:', Object.fromEntries(data.entries()));
        try {
            const response = await api.post<Event>('/events/admin_create', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Преобразуем URL изображения если оно есть
            const event = {
                ...response.data,
                media_url: response.data.media_url ? (
                    response.data.media_url.startsWith('http') ?
                        new URL(response.data.media_url).pathname :
                        response.data.media_url
                ) : null
            };
            return { data: event };
        } catch (error) {
            console.error('Ошибка при создании события:', error);
            throw error;
        }
    },
    deleteEvent: (id: number) => api.delete(`/events/${id}`),
    sendNotification: async (eventId: number) => {
        const response = await api.post(`/events/notification/${eventId}`);
        return response.data;
    },
    getEvents: () => api.get<Event[]>('/events/'),
    registerForEvent: (eventId: number) => api.post<Registration>(`/users/registration/${eventId}`),
    unregisterFromEvent: (eventId: number) => api.post(`/events/${eventId}/unregister`),
    getEventRegistrations: (eventId: number) => api.get(`/events/${eventId}/registrations`),
};

export const registrationService = {
    getUserRegistrations: () => api.get<Registration[]>('/users/registration/my_registration/info'),
    cancelRegistration: (eventId: number) => api.post(`/users/registration/disregistration/${eventId}`),
};

export const tagService = {
    getAllTags: () => api.get<{ tags: Tag[] }>('/tags/all'),
    getTagById: (id: number) => api.get<Tag>(`/tags/${id}`),
    createTag: (data: TagCreate) =>
        api.post<Tag>('/tags/create', null, {
            params: {
                name: data.name,
                description: data.description,
            },
        }),
    updateTag: (id: number, data: TagCreate) => api.put<Tag>(`/tags/update/${id}`, null, {
        params: {
            name: data.name,
            description: data.description
        }
    }),
    deleteTag: (id: number) => api.delete(`/tags/delete/${id}`),
    addTagToEvent: (eventId: number, tagId: number) =>
        api.post<EventTag>(`/events/${eventId}/tags/${tagId}`, { event_id: eventId, tag_id: tagId }),
    removeTagFromEvent: (eventId: number, tagId: number) =>
        api.delete(`/events/${eventId}/tags/${tagId}`),
    getEventTags: (eventId: number) =>
        api.get<{ event_tags: EventTag[] }>(`/events/${eventId}/tags`),
    getEventsByTag: (tagId: number) =>
        api.get<{ events: EventTag[] }>(`/tags/${tagId}/events`),
};

export const coworkingService = {
    getAllCoworking: () => api.get<{ items: Coworking[] }>('/coworking/get_all_coworking'),
    getCoworkingById: (id: number) => api.get<Coworking>(`/coworking/${id}`),
    createCoworking: (data: { name: string; description: string; is_available: boolean }) =>
        api.post<Coworking>('/coworking', data),
    updateCoworking: (id: number, data: { name: string; description: string; is_available: boolean }) =>
        api.put<Coworking>(`/coworking/${id}`, data),
    deleteCoworking: (id: number) => api.delete(`/coworking/${id}`),
    getActiveReservationsAdmin: () => api.get<{ items: CoworkingReservation[] }>('/coworking_reservations/get_all_reservations_active_admin'),
    closeReservationAdmin: (data: { coworking_id: number }) =>
        api.post<CoworkingReservation>('/coworking_reservations/close_admin', data),
    createReservation: (data: { coworking_id: number }) =>
        api.post<CoworkingReservation>('/coworking_reservations', data),
    closeReservation: (coworking_id: number) =>
        api.post<CoworkingReservation>('/coworking_reservations/close', coworking_id),
    getActiveReservations: () =>
        api.get<{ items: CoworkingReservation[] }>('/coworking_reservations/get_all_reservations_active_by_user'),
    getAllReservations: () =>
        api.get<{ items: CoworkingReservation[] }>('/coworking_reservations/get_all_reservations_by_user'),
}; 