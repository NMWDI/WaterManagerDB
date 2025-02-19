import type { Dayjs } from "dayjs";
import { User, Well, Unit, ObservedPropertyTypeLU } from "./index";

export interface PatchObservationForm {
  observation_id: number;
  submitting_user: User;
  well?: Well;
  observation_date: Dayjs;
  observation_time: Dayjs;
  property_type: ObservedPropertyTypeLU;
  unit: Unit;
  value: number;
  ose_share: boolean;
  notes?: string;
  meter_id: number;
}
