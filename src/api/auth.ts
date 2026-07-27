import { API_CONFIG } from '../config/api';
import { AuthResponse, LoginCredentials, User } from '../types';
import { apiRequest, setToken, clearToken } from './client';
import { mockLogin, mockGetProfile } from './mockData';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (API_CONFIG.USE_MOCK) {
      const response = await mockLogin(credentials.email, credentials.password);
      await setToken(response.token);
      return response;
    }

    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
      auth: false,
    });
    await setToken(response.token);
    return response;
  },

  logout: async (): Promise<void> => {
    await clearToken();
  },

  getProfile: async (): Promise<User> => {
    if (API_CONFIG.USE_MOCK) {
      return mockGetProfile();
    }
    return apiRequest<User>('/auth/profile');
  },
};
