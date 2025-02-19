import { WaterSource } from "./models";

export interface SubmitWellCreate {
  name: string;
  ra_number: string;
  owners: string;
  osetag: string;
  water_source?: WaterSource;

  use_type: {
    id: number;
  };

  location: {
    name: string;
    trss: string;
    longitude: number;
    latitude: number;
  };
}
