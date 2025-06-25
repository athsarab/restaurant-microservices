import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Set up axios interceptors for JWT
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Handle 401 responses
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axios.get(`${API_URL}/users/profile`);
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await axios.put(`${API_URL}/users/profile`, userData);
    return response.data;
  }
};

export const menuService = {
  getCategories: async () => {
    const response = await axios.get(`${API_URL}/menu/categories`);
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await axios.get(`${API_URL}/menu/categories/${id}`);
    return response.data;
  },

  getAllDishes: async () => {
    const response = await axios.get(`${API_URL}/menu/dishes`);
    return response.data;
  },
  
  getDishById: async (id) => {
    const response = await axios.get(`${API_URL}/menu/dishes/${id}`);
    return response.data;
  },
  
  getDishesByCategory: async (categoryId) => {
    const response = await axios.get(`${API_URL}/menu/dishes/category/${categoryId}`);
    return response.data;
  }
};

export const orderService = {
  createOrder: async (orderData) => {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  },
  
  getUserOrders: async () => {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  },
  
  getOrderById: async (id) => {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  }
};

export const reviewService = {
  getDishReviews: async (dishId) => {
    const response = await axios.get(`${API_URL}/reviews/dish/${dishId}`);
    return response.data;
  },

  createReview: async (reviewData) => {
    const response = await axios.post(`${API_URL}/reviews`, reviewData);
    return response.data;
  },

  getUserReviews: async () => {
    const response = await axios.get(`${API_URL}/reviews/user`);
    return response.data;
  }
};
