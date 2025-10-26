import api from './api';

export const adminAuthService = {
  login: async (email, password) => {
    try {
      console.log('Making login API call to /admin/login');
      const response = await api.post('/admin/login', { email, password });
      console.log('API response received:', response);
      
      // Store token and admin data
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminData', JSON.stringify(response.data.admin));
        console.log('Token and admin data stored in localStorage');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);
      
      if (error.response) {
        // Server responded with error status
        const message = error.response?.data?.message || error.response?.data?.error || 'Login failed';
        console.error('Error message:', message);
        throw new Error(message);
      } else if (error.request) {
        // Request made but no response
        console.error('No response from server. Check if backend is running.');
        throw new Error('Network error. Please check if the backend server is running on port 9000');
      } else {
        // Error in request setup
        console.error('Error in request setup:', error.message);
        throw new Error(error.message || 'Login failed');
      }
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  },

  getCurrentAdmin: () => {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  },

  getToken: () => {
    return localStorage.getItem('adminToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
};

export default adminAuthService;

