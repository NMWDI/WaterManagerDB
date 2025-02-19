import { MeterTypeLU, MeterStatus, MeterRegister, Well } from "../models";

export interface MeterDetails {
  id?: number;
  serial_number?: string;
  contact_name?: string;
  contact_phone?: string;
  water_users?: string;
  meter_owner?: string;
  ra_number?: string;
  tag?: string;
  well_distance_ft?: number;
  notes?: string;
  meter_type_id?: number;
  well_id?: number;

  meter_type: MeterTypeLU;
  status: MeterStatus;
  well?: Well;
  meter_register?: MeterRegister;
}
