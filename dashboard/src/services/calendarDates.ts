import axios from '../utils/axios';
import { CalendarDate, PaginatedResponse } from '../types/gtfs';

export const calendarDatesService = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<CalendarDate>> => {
    const response = await axios.get('/gtfs/calendar_dates', {
      params: { page, limit },
    });
    return response.data;
  },

  getByServiceId: async (serviceId: string): Promise<CalendarDate[]> => {
    const response = await axios.get(`/gtfs/calendar_dates/${serviceId}`);
    return response.data;
  },

  create: async (calendarDateData: CalendarDate): Promise<CalendarDate> => {
    const response = await axios.post('/gtfs/calendar_dates', calendarDateData);
    return response.data;
  },

  update: async (
    serviceId: string,
    date: string,
    calendarDateData: CalendarDate
  ): Promise<CalendarDate> => {
    const response = await axios.put(`/gtfs/calendar_dates/${serviceId}/${date}`, calendarDateData);
    return response.data;
  },

  delete: async (serviceId: string, date: string): Promise<void> => {
    const response = await axios.delete(`/gtfs/calendar_dates/${serviceId}/${date}`);
    return response.data;
  },
};
