import axios from '../utils/axios';
import { Calendar, PaginatedResponse } from '../types/gtfs';

export const calendarService = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Calendar>> => {
    const response = await axios.get('/gtfs/calendar', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Calendar> => {
    const response = await axios.get(`/gtfs/calendar/${id}`);
    return response.data;
  },

  create: async (calendarData: Calendar): Promise<Calendar> => {
    const response = await axios.post('/gtfs/calendar', calendarData);
    return response.data;
  },

  update: async (id: string, calendarData: Calendar): Promise<Calendar> => {
    const response = await axios.put(`/gtfs/calendar/${id}`, calendarData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await axios.delete(`/gtfs/calendar/${id}`);
    return response.data;
  },
};
