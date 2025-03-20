import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

const ErrorPage: React.FC = () => {
    const navigate = useNavigate();
    const error = useRouteError();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Упс! Что-то пошло не так
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {error instanceof Error ? error.message : 'Произошла ошибка при загрузке страницы'}
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleGoBack}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            Назад
                        </button>
                        <button
                            onClick={handleGoHome}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                        >
                            На главную
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage; 