import axios from '../utils/axios';
import { Route, PaginationParams, PaginatedResponse } from '../types/gtfs';

export const routesService = {
  getAll: async (agencyId: string, page = 1, limit = 10): Promise<PaginatedResponse<Route>> => {
    const response = await axios.get('/gtfs/routes', {
      params: { agencyId, page, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Route> => {
    const response = await axios.get(`/gtfs/routes/${id}`);
    return response.data;
  },

  create: async (routeData: Route): Promise<Route> => {
    const response = await axios.post('/gtfs/routes', routeData);
    return response.data;
  },

  update: async (id: string, routeData: Route): Promise<Route> => {
    const response = await axios.put(`/gtfs/routes/${id}`, routeData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await axios.delete(`/gtfs/routes/${id}`);
    return response.data;
  },
};
