import { BaseWell } from "../BaseWell";
import { WellUseLU, WaterSource, WellStatus, Location } from "../models";

export interface Well extends BaseWell {
  use_type?: WellUseLU;
  water_source?: WaterSource;
  location?: Location;
  well_status?: WellStatus;

  meters: [
    {
      id: number;
      serial_number: string;
      water_users?: string;
    },
  ];
}
