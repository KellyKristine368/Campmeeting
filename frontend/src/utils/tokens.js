// Save tokens after login or registration
export const saveTokens = (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
};

// Clear tokens on logout
export const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

// Get current access token
export const getAccessToken = () => {
    return localStorage.getItem('access_token');
};

// Check if user is logged in (has a token)
export const isLoggedIn = () => {
    return !!localStorage.getItem('access_token');
};