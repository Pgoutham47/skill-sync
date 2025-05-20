
import axios from 'axios';

// API base URL from environment variable or default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create API instance with default configurations
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("skillsync_token");
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("skillsync_token");
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) => 
    api.post('/auth/register', userData),
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  getCurrentUser: () => 
    api.get('/auth/me'),
};

export const userAPI = {
  getProfile: () => 
    api.get('/users/profile'),
  updateProfile: (profileData: any) => 
    api.put('/users/profile', profileData),
  getSkills: () => 
    api.get('/users/skills'),
  createSkillAssessment: (skillsData: { skills: any[] }) => 
    api.post('/users/skills', skillsData),
  getLearningPaths: () => 
    api.get('/users/learning-paths'),
  createLearningPath: (pathData: any) => 
    api.post('/users/learning-paths', pathData),
};

export default api;
