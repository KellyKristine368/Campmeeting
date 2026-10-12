import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ----------------------------------------------------------------
// Request interceptor — attach access token to every request
// ----------------------------------------------------------------
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ----------------------------------------------------------------
// Response interceptor — if access token expired (401),
// silently refresh it and retry the original request
// ----------------------------------------------------------------
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    // No refresh token — force logout
                    _forceLogout();
                    return Promise.reject(error);
                }

                // Ask Django for a new access token
                const response = await axios.post(
                    'http://127.0.0.1:8000/api/auth/token/refresh/',
                    { refresh: refreshToken }
                );

                const newAccessToken = response.data.access;

                // Save new token
                localStorage.setItem('access_token', newAccessToken);

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return API(originalRequest);

            } catch (refreshError) {
                // Refresh token also expired — force logout
                _forceLogout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// ----------------------------------------------------------------
// Force logout — clears tokens and sends user to login page
// ----------------------------------------------------------------
function _forceLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
}

export default API;