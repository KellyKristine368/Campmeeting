import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// Clean hook — any component can call useAuth() to get user info
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside an AuthProvider');
    }
    return context;
};

export default useAuth;