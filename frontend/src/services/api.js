import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  verify: () => apiClient.post('/api/auth/verify'),
};

export const residentsAPI = {
  getAll: (params) => apiClient.get('/api/residents', { params }),
  getById: (id) => apiClient.get(`/api/residents/${id}`),
  create: (data) => apiClient.post('/api/residents', data),
  update: (id, data) => apiClient.put(`/api/residents/${id}`, data),
  delete: (id) => apiClient.delete(`/api/residents/${id}`),
};

export const certificatesAPI = {
  getAll: (params) => apiClient.get('/api/certificates', { params }),
  getTypes: () => apiClient.get('/api/certificates/types'),
  getById: (id) => apiClient.get(`/api/certificates/${id}`),
  issue: (data) => apiClient.post('/api/certificates', data),
  updateStatus: (id, data) => apiClient.patch(`/api/certificates/${id}/status`, data),
};

export const requestsAPI = {
  getAll: (params) => apiClient.get('/api/requests', { params }),
  create: (data) => apiClient.post('/api/requests', data),
  updateStatus: (id, data) => apiClient.patch(`/api/requests/${id}/status`, data),
};

export const officialsAPI = {
  getCurrent: () => apiClient.get('/api/officials/current'),
  getAll: () => apiClient.get('/api/officials'),
  create: (data) => apiClient.post('/api/officials', data),
  update: (id, data) => apiClient.put(`/api/officials/${id}`, data),
  endTerm: (id, data) => apiClient.patch(`/api/officials/${id}/end-term`, data),
};

export const dashboardAPI = {
  getStats: () => apiClient.get('/api/dashboard/stats'),
  getActivities: (limit) => apiClient.get('/api/dashboard/activities', { params: { limit } }),
  getCertsByType: () => apiClient.get('/api/dashboard/certificates/by-type'),
  getCertTrends: () => apiClient.get('/api/dashboard/certificates/trends'),
};

export default apiClient;
