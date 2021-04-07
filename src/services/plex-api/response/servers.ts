import { MediaContainer } from "./common";

/**
 * /servers
 */
export type ServersContainer = MediaContainer<Servers>;

export interface Servers {
  size: number;
  Server: Server[];
}

export interface Server {
  name: string;
  host: string;
  address: string;
  port: number;
  machineIdentifier: string;
  version: string;
}
