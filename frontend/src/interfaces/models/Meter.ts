import { Well, MeterRegister, MeterTypeLU, MeterStatus } from "../models";

export interface Meter {
  id: number;
  serial_number: string;
  contact_name?: string;
  contact_phone?: string;
  notes?: string;

  meter_type_id: number;
  status_id?: number;
  well_id: number;
  location_id?: number;

  meter_register?: MeterRegister;
  meter_type?: MeterTypeLU;
  status?: MeterStatus;
  well?: Well;
  location?: Location;
}
