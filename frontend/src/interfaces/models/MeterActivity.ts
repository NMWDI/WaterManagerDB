import { User, Meter, ActivityTypeLU } from "./index";

export interface MeterActivity {
  id: number;
  timestamp_start: Date;
  timestamp_end: Date;
  notes?: string;
  submitting_user_id: number;
  meter_id: number;
  activity_type_id: number;
  location_id: number;

  submitting_user?: User;
  meter?: Meter;
  activity_type?: ActivityTypeLU;
  location?: Location;
  parts_used?: [];
}
