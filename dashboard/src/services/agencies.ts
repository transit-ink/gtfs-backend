import axios from '../utils/axios';
import { Agency, PaginationParams, PaginatedResponse } from '../types/gtfs';

export const agenciesService = {
  getAll: async (page = 1, limit = 10): Promise<Agency[]> => {
    const response = await axios.get('/gtfs/agency', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Agency> => {
    const response = await axios.get(`/gtfs/agency/${id}`);
    return response.data;
  },

  create: async (agencyData: Agency): Promise<Agency> => {
    const response = await axios.post('/gtfs/agency', agencyData);
    return response.data;
  },

  update: async (id: string, agencyData: Agency): Promise<Agency> => {
    const response = await axios.put(`/gtfs/agency/${id}`, agencyData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await axios.delete(`/gtfs/agency/${id}`);
    return response.data;
  },
};
