import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../ui/Spinner';

const FullScreenSpinner: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <Spinner size={48} />
    </div>
);


const Redirect: React.FC<{ to: string }> = ({ to }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => navigate(to, { replace: true }), 0);
        return () => clearTimeout(timer);
    }, [navigate, to]);
    return <FullScreenSpinner />;
};

export default Redirect;
