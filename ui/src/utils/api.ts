import axios, { AxiosResponse } from 'axios';
import { Agency, Calendar, CalendarDate, Route, Shape, Stop, StopTime, Trip } from '../types/gtfs';
import { BACKEND_HOST } from './constants';

export interface SearchResult {
  type: string;
  name: string;
  id: string;
}

interface ApiResponse<T> {
  data: T;
}

// GTFS API Endpoints
export const getSearchResultsApi = (
  searchText: string
): Promise<AxiosResponse<ApiResponse<SearchResult[]>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/search?q=${searchText}`);

export const getAgenciesApi = (): Promise<AxiosResponse<ApiResponse<Agency[]>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/agency`);

export const getAgencyApi = (id: string): Promise<AxiosResponse<ApiResponse<Agency>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/agency/${id}`);

export const getCalendarsApi = (): Promise<AxiosResponse<ApiResponse<Calendar[]>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/calendar`);

export const getCalendarApi = (id: string): Promise<AxiosResponse<ApiResponse<Calendar>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/calendar/${id}`);

export const getCalendarDatesApi = (): Promise<AxiosResponse<ApiResponse<CalendarDate[]>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/calendar-dates`);

export const getCalendarDateApi = (
  serviceId: string
): Promise<AxiosResponse<ApiResponse<CalendarDate>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/calendar-dates/${serviceId}`);

export const getShapesApi = (): Promise<AxiosResponse<ApiResponse<Shape[]>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/shapes`);

export const getShapesBulkApi = (ids: string[]): Promise<AxiosResponse<ApiResponse<Shape[]>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/shapes/bulk?ids=${ids.join(',')}`);

export const getShapeApi = (id: string): Promise<AxiosResponse<ApiResponse<Shape>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/shapes/${id}`);

export const getStopsApi = (): Promise<AxiosResponse<ApiResponse<Stop[]>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/stops`);

export const getStopApi = (id: string): Promise<AxiosResponse<ApiResponse<Stop>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/stops/${id}`);

export const getStopsBulkApi = (ids: string[]): Promise<AxiosResponse<ApiResponse<Stop[]>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/stops/bulk?ids=${ids.join(',')}`);

export const getNearbyStopsApi = (
  lat: number,
  lon: number,
  radius?: number
): Promise<AxiosResponse<ApiResponse<Stop[]>>> =>
  axios.get(
    `${BACKEND_HOST}/gtfs/stops/nearby?lat=${lat}&lon=${lon}${radius ? `&radius=${radius}` : ''}`
  );

export const getStopTimesApi = ({
  tripIds,
  stopIds,
}: {
  tripIds?: string[];
  stopIds?: string[];
}): Promise<AxiosResponse<ApiResponse<StopTime[]>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/stop_times`, {
    params: {
      tripId: tripIds?.join(','),
      stopId: stopIds?.join(','),
      limit: 10000,
    },
  });

export const getStopTimeApi = (id: string): Promise<AxiosResponse<ApiResponse<StopTime>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/stop_times/${id}`);

export const getTripsApi = (routeId: string): Promise<AxiosResponse<ApiResponse<Trip[]>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/trips?routeId=${routeId}&page=1&limit=1000`);

export const getTripApi = (id: string): Promise<AxiosResponse<ApiResponse<Trip>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/trips/${id}`);

export const getTripsBulkApi = (ids: string[]): Promise<AxiosResponse<ApiResponse<Trip[]>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/trips/bulk?ids=${ids.join(',')}`);

export const getRouteApi = (id: string): Promise<AxiosResponse<ApiResponse<Route>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/routes/${id}`);

export const getRoutesBulkApi = (ids: string[]): Promise<AxiosResponse<ApiResponse<Route[]>>> =>
  axios.get(`${BACKEND_HOST}/gtfs/routes/bulk?ids=${ids.join(',')}`);
