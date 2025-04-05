import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            <AdminSidebar />
            <div className="flex-1 md:ml-64 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 