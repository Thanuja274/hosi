// src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Main API object
export const api = {
    // Test backend connection
    testConnection: async() => {
        try {
            const response = await fetch(`${API_BASE_URL}`);
            return response.json();
        } catch (error) {
            console.error('Backend connection failed:', error);
            return { message: 'Backend connection failed' };
        }
    },

    // Health check
    healthCheck: async() => {
        try {
            const response = await fetch(`http://localhost:8080/health`);
            return response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            return { status: 'Error' };
        }
    },

    // 🔥 FIXED: Auth routes - changed from /api/auth/login to /api/login
    login: async(credentials) => {
        try {
            console.log('🔐 Frontend: Calling login endpoint:', `${API_BASE_URL}/login`);
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, message: 'Login failed - network error' };
        }
    },

    register: async(userData) => {
        try {
            console.log('🔐 Frontend: Calling register endpoint:', `${API_BASE_URL}/register`);
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('Registration failed:', error);
            return { success: false, message: 'Registration failed - network error' };
        }
    },

    getCurrentUser: async() => {
        try {
            const token = getAuthToken();
            if (!token) {
                return { success: false, message: 'No token found' };
            }

            // Note: This endpoint might not exist in your current backend
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            return response.json();
        } catch (error) {
            console.error('Get current user failed:', error);
            return { success: false, message: 'Failed to get user data' };
        }
    },

    logout: async() => {
        try {
            // Remove token from localStorage (client-side logout)
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            console.error('Logout failed:', error);
            // Still remove token from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { success: true, message: 'Logged out locally' };
        }
    },

    // Appointments
    getAppointments: async() => {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
            return [];
        }
    },

    createAppointment: async(appointmentData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(appointmentData),
            });
            return response.json();
        } catch (error) {
            console.error('Failed to create appointment:', error);
            return { error: 'Failed to create appointment' };
        }
    },

    // Users
    getUsers: async() => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Failed to fetch users:', error);
            return [];
        }
    },

    // Doctors
    getDoctors: async() => {
        try {
            const response = await fetch(`${API_BASE_URL}/doctors`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
            return [];
        }
    },

    // Pharmacy - if you want to add pharmacy-specific API calls
    getMedicines: async() => {
        try {
            const response = await fetch(`${API_BASE_URL}/medicines`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Failed to fetch medicines:', error);
            return [];
        }
    },

    createOrder: async(orderData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(orderData),
            });
            return response.json();
        } catch (error) {
            console.error('Failed to create order:', error);
            return { error: 'Failed to create order' };
        }
    }
};

// Alternative export for authAPI (for your existing components)
export const authAPI = {
    login: async(credentials) => {
        return api.login(credentials);
    },
    register: async(userData) => {
        return api.register(userData);
    },
    getCurrentUser: async() => {
        return api.getCurrentUser();
    },
    logout: async() => {
        return api.logout();
    }
};

// Default export
export default api;