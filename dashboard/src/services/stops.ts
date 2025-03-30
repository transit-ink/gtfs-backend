import axios from '../utils/axios';
import { Stop, PaginationParams, PaginatedResponse } from '../types/gtfs';

export const stopsService = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Stop>> => {
    const response = await axios.get('/gtfs/stops', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Stop> => {
    const response = await axios.get(`/gtfs/stops/${id}`);
    return response.data;
  },

  create: async (stopData: Stop): Promise<Stop> => {
    const response = await axios.post('/gtfs/stops', stopData);
    return response.data;
  },

  update: async (id: string, stopData: Stop): Promise<Stop> => {
    const response = await axios.put(`/gtfs/stops/${id}`, stopData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await axios.delete(`/gtfs/stops/${id}`);
    return response.data;
  },
};
