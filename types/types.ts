import type { Schema } from "../amplify/data/resource";

export type todoType = Schema['Todo']['type'];
export type vehicleType = Schema['Vehicle']['type'];
export interface Vehicle {
    imei: string;
    name: string;
    trader: string;
}

export interface GpsItem {
  imei: string;
  latitude: number;
  longitude: number;
  datetime: string;
  name: string;
  trader: string;
}