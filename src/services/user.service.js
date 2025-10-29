import api from './api';

export const userService = {
  getAllUsers: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/admin/users', {
        params: { page, limit }
      });
      const data = response.data || {};
      const totalUsers = data.totalUsers ?? data.pagination?.totalCount ?? 0;
      return { ...data, totalUsers };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  deleteUser: async (userId) => {
    try {
      console.log('Making delete API call to:', `/admin/users/${userId}`);
      const response = await api.delete(`/admin/users/${userId}`);
      console.log('Delete API response:', response);
      return response.data;
    } catch (error) {
      console.error('Delete API error:', error);
      if (error.response?.status === 404) {
        throw new Error('User not found');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('You do not have permission to delete this user');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  getAdminProfile: async () => {
    try {
      const response = await api.get('/admin/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch admin profile');
    }
  },

  updateAdminProfile: async (adminData) => {
    try {
      const response = await api.put('/admin/profile', adminData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update admin profile');
    }
  },
};

export const jobService = {
  getAllJobs: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/job/postings', {
        params: { page, limit, ...filters }
      });
      const data = response.data || {};
      const totalJobs = response.data.data.count;
      return { ...data, totalJobs };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch jobs');
    }
  },

  getJobById: async (jobId) => {
    try {
      const response = await api.get(`/job/postings/${jobId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch job');
    }
  },

  createJob: async (jobData) => {
    try {
      const response = await api.post('/job/postings', jobData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create job');
    }
  },

  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.put(`/job/postings/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update job');
    }
  },

  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/job/postings/${jobId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete job');
    }
  },
};

export default userService;

