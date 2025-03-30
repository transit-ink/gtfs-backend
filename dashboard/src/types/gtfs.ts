export enum LocationType {
  STOP = 0,
  STATION = 1,
  ENTRANCE_EXIT = 2,
  GENERIC_NODE = 3,
  BOARDING_AREA = 4,
}

export enum WheelchairBoarding {
  NO_INFO = 0,
  ACCESSIBLE = 1,
  NOT_ACCESSIBLE = 2,
}

export enum RouteType {
  TRAM = 0,
  SUBWAY = 1,
  RAIL = 2,
  BUS = 3,
  FERRY = 4,
  CABLE_TRAM = 5,
  AERIAL_LIFT = 6,
  FUNICULAR = 7,
  TROLLEYBUS = 800,
  MONORAIL = 900,
}

export enum WheelchairAccessible {
  NO_INFO = 0,
  ACCESSIBLE = 1,
  NOT_ACCESSIBLE = 2,
}

export enum BikesAllowed {
  NO_INFO = 0,
  ALLOWED = 1,
  NOT_ALLOWED = 2,
}

export enum PickupType {
  REGULAR = 0,
  NOT_AVAILABLE = 1,
  PHONE_AGENCY = 2,
  COORDINATE_WITH_DRIVER = 3,
}

export enum DropOffType {
  REGULAR = 0,
  NOT_AVAILABLE = 1,
  PHONE_AGENCY = 2,
  COORDINATE_WITH_DRIVER = 3,
}

export interface Agency {
  agency_id: string;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
  agency_lang?: string;
  agency_phone?: string;
  agency_fare_url?: string;
  agency_email?: string;
}

export interface Stop {
  stop_id: string;
  stop_code?: string;
  stop_name: string;
  tts_stop_name?: string;
  stop_desc?: string;
  stop_lat: number;
  stop_lon: number;
  zone_id?: string;
  stop_url?: string;
  location_type?: LocationType;
  parent_station?: string;
  stop_timezone?: string;
  wheelchair_boarding?: WheelchairBoarding;
  level_id?: string;
  platform_code?: string;
}

export interface Route {
  route_id: string;
  agency_id: string;
  route_short_name: string;
  route_long_name: string;
  route_desc?: string;
  route_type: RouteType;
  route_url?: string;
  route_color?: string;
  route_text_color?: string;
  route_sort_order?: number;
  continuous_pickup?: string;
  continuous_drop_off?: string;
  network_id?: string;
}

export interface Trip {
  trip_id: string;
  route_id: string;
  service_id: string;
  trip_headsign?: string;
  trip_short_name?: string;
  direction_id?: boolean;
  block_id?: string;
  shape_id?: string;
  wheelchair_accessible?: WheelchairAccessible;
  bikes_allowed?: BikesAllowed;
}

export interface StopTime {
  trip_id: string;
  arrival_time?: string;
  departure_time?: string;
  stop_id: string;
  stop_sequence: number;
  stop_headsign?: string;
  stop_tts_headsign?: string;
  pickup_type?: PickupType;
  drop_off_type?: DropOffType;
  continuous_pickup?: string;
  continuous_drop_off?: string;
  shape_dist_traveled?: number;
  timepoint?: boolean;
}

export interface Calendar {
  service_id: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  start_date: string;
  end_date: string;
}

export interface CalendarDate {
  service_id: string;
  date: string;
  exception_type: number;
}

export interface Shape {
  shape_id: string;
  shape_pt_lat: number;
  shape_pt_lon: number;
  shape_pt_sequence: number;
  shape_dist_traveled?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
