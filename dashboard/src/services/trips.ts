import { PaginatedResponse, Trip } from '../types/gtfs';
import axios from '../utils/axios';

export const tripsService = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Trip>> => {
    const response = await axios.get('/gtfs/trips', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Trip> => {
    const response = await axios.get(`/gtfs/trips/${id}`);
    return response.data;
  },

  create: async (tripData: Trip): Promise<Trip> => {
    const response = await axios.post('/gtfs/trips', tripData);
    return response.data;
  },

  update: async (id: string, tripData: Trip): Promise<Trip> => {
    const response = await axios.put(`/gtfs/trips/${id}`, tripData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await axios.delete(`/gtfs/trips/${id}`);
    return response.data;
  },
};
