import { WellUseLU, WaterSource, WellStatus } from "./models";
import { BaseWell } from "./BaseWell";

export interface WellUpdate extends BaseWell {
  use_type: WellUseLU;
  water_source: WaterSource;
  location: Location;
  well_status: WellStatus;
}
