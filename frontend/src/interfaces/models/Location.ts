import { LandOwner } from "../models";

export interface Location {
  name: string;
  latitude?: number;
  longitude?: number;
  trss: string;
  land_owner_id: number;
  land_owner?: LandOwner;
}
