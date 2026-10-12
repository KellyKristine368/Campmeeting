import { createContext, useContext, useEffect, useReducer } from 'react';
import { saveTokens, clearTokens, isLoggedIn } from '../utils/tokens';
import API from '../api';

// ----------------------------------------------------------------
// Initial state
// ----------------------------------------------------------------
const initialState = {
    user:          null,
    isAuthenticated: false,
    isLoading:     true,   // true on first load while we check tokens
};

// ----------------------------------------------------------------
// Reducer
// ----------------------------------------------------------------
function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user:            action.payload,
                isAuthenticated: true,
                isLoading:       false,
            };
        case 'LOGOUT':
            return {
                ...state,
                user:            null,
                isAuthenticated: false,
                isLoading:       false,
            };
        case 'STOP_LOADING':
            return { ...state, isLoading: false };
        default:
            return state;
    }
}

// ----------------------------------------------------------------
// Context
// ----------------------------------------------------------------
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // On first load — check if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            if (!isLoggedIn()) {
                dispatch({ type: 'STOP_LOADING' });
                return;
            }
            try {
                // Fetch profile using stored token
                const response = await API.get('auth/profile/');
                dispatch({ type: 'LOGIN', payload: response.data });
            } catch {
                // Token invalid or expired beyond refresh
                clearTokens();
                dispatch({ type: 'STOP_LOADING' });
            }
        };
        checkAuth();
    }, []);

    // ----------------------------------------------------------------
    // Auth actions used by pages
    // ----------------------------------------------------------------
    const login = (userData, tokens) => {
        saveTokens(tokens.access, tokens.refresh);
        dispatch({ type: 'LOGIN', payload: userData });
    };

    const logout = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            await API.post('auth/logout/', { refresh });
        } catch {
            // Proceed with logout even if API call fails
        } finally {
            clearTokens();
            dispatch({ type: 'LOGOUT' });
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;