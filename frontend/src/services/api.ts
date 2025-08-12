import axios from 'axios';
import { DefinitionRequest, DefinitionResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;
