import { MediaContainer } from "./common";

/**
 * /devices
 */
export type DevicesContainer = MediaContainer<Devices>;

export interface Devices {
  identifier: string;
  size: number;
  Device: Device[];
}

export interface Device {
  createdAt: number;
  id: number;
  name: string;
  platform: string;
}
