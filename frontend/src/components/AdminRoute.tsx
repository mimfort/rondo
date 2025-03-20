import React from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../api/services';
import LoadingSpinner from './LoadingSpinner';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { data: user, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await authService.getCurrentUser();
            return response.data;
        },
        retry: false,
    });

    if (isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!user || user.admin_status !== 'admin') {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export default AdminRoute; 