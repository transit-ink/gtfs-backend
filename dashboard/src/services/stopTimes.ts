import axios from '../utils/axios';
import { StopTime, PaginationParams, PaginatedResponse } from '../types/gtfs';

export const stopTimesService = {
  getAll: async (tripId: string, page = 1, limit = 10): Promise<PaginatedResponse<StopTime>> => {
    const response = await axios.get('/gtfs/stop_times', {
      params: { tripId, page, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<StopTime> => {
    const response = await axios.get(`/gtfs/stop_times/${id}`);
    return response.data;
  },

  create: async (stopTimeData: StopTime): Promise<StopTime> => {
    const response = await axios.post('/gtfs/stop_times', stopTimeData);
    return response.data;
  },

  update: async (id: string, stopTimeData: StopTime): Promise<StopTime> => {
    const response = await axios.put(`/gtfs/stop_times/${id}`, stopTimeData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await axios.delete(`/gtfs/stop_times/${id}`);
    return response.data;
  },
};
