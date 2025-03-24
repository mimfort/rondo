import axios from 'axios';
import toast from 'react-hot-toast';

export const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Обработка ошибок аутентификации
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Если пользователь не авторизован, перенаправляем на страницу входа
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 