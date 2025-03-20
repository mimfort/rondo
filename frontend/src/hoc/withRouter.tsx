import React from 'react';
import { useNavigate } from 'react-router-dom';

export const withRouter = <P extends object>(
    Component: React.ComponentType<P & { navigate: ReturnType<typeof useNavigate> }>
) => {
    return (props: P) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}; 