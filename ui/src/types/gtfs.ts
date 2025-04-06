// GTFS Interfaces
export interface Agency {
  agency_id: string;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
}

export interface Calendar {
  service_id: string;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
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
}

export interface Stop {
  stop_id: string;
  stop_code?: string;
  stop_name: string;
  stop_desc?: string;
  stop_lat: number;
  stop_lon: number;
  location_type?: number;
  parent_station?: string;
}

export interface StopTime {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: number;
  pickup_type?: number;
  drop_off_type?: number;
}

export interface Trip {
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign?: string;
  direction_id?: number;
  shape_id?: string;
}

export interface Route {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_desc?: string;
  route_type: number;
  route_url?: string;
  route_color?: string;
  route_text_color?: string;
}
