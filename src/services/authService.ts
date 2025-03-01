import axios from 'axios';
import type { AuthUser } from '../data/pages/authUser.ts';

const API_URL = 'http://localhost:9321/api';

export const login = async (email: string, password: string): Promise<{ token: string; user: AuthUser }> => {
  try {
    const response = await axios.post(`http://localhost:9321/Auth`, { email, password });
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const getUser = (): AuthUser | null => {
  return JSON.parse(localStorage.getItem('user') || 'null');
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};
