import axios from '../utils/axios';
import { Shape, PaginationParams, PaginatedResponse } from '../types/gtfs';

export const shapesService = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Shape>> => {
    const response = await axios.get('/gtfs/shapes', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Shape[]> => {
    const response = await axios.get(`/gtfs/shapes/${id}`);
    return response.data;
  },

  create: async (shapeData: Shape): Promise<Shape> => {
    const response = await axios.post('/gtfs/shapes', shapeData);
    return response.data;
  },

  update: async (id: string, shapeData: Shape): Promise<Shape> => {
    const response = await axios.put(`/gtfs/shapes/${id}`, shapeData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await axios.delete(`/gtfs/shapes/${id}`);
    return response.data;
  },
};
