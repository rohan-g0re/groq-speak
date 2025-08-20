import axios from 'axios';
import { DefinitionRequest, DefinitionResponse } from '@/types/api';
import { supabase } from '@/lib_supa/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to sign in
      await supabase.auth.signOut();
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const dictionaryApi = {
  defineText: async (request: DefinitionRequest): Promise<DefinitionResponse> => {
    const response = await api.post<DefinitionResponse>('/define', request);
    return response.data;
  },

  healthCheck: async (): Promise<{ status: string; service: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export const jokesApi = {
  generateJoke: async (prompt: string): Promise<{ joke: string }> => {
    const response = await api.post('/jokes/generate', { prompt });
    return response.data;
  },
};

export const captionsApi = {
  generateCaption: async (prompt: string): Promise<{ caption: string }> => {
    const response = await api.post('/captions/generate', { prompt });
    return response.data;
  },
};

export default api;
