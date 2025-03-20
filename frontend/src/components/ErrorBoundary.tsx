import React, { Component } from 'react';
import { withRouter } from '../hoc/withRouter';
import type { NavigateFunction } from 'react-router-dom';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    navigate: NavigateFunction;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleGoBack = (): void => {
        this.props.navigate(-1);
        this.setState({ hasError: false, error: null });
    };

    handleGoHome = (): void => {
        this.props.navigate('/');
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8 text-center">
                        <div className="rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Упс! Что-то пошло не так
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Произошла ошибка при загрузке страницы. Пожалуйста, попробуйте снова или вернитесь на главную.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={this.handleGoBack}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    Назад
                                </button>
                                <button
                                    onClick={this.handleGoHome}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                                >
                                    На главную
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default withRouter(ErrorBoundary); 