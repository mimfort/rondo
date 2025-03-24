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
        // Проверяем наличие сообщения о неправильном токене
        if (error.response?.data?.detail === "Неправильный токен") {
            // Удаляем токен из localStorage
            localStorage.removeItem('token');
            // Удаляем токен из заголовков
            delete api.defaults.headers.common['Authorization'];
            // Показываем уведомление пользователю
            toast.error('Время сессии истекло. Пожалуйста, войдите в аккаунт заново', {
                duration: 5000,
                position: 'top-center'
            });
            // Перенаправляем на страницу входа
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // Обработка других ошибок
        if (error.response?.status === 401) {
            // Если пользователь не авторизован, перенаправляем на страницу входа
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 