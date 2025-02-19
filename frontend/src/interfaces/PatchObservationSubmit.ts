export interface PatchObservationSubmit {
  observation_id: number;
  timestamp: string;
  value: number;
  notes?: string;
  submitting_user_id: number;
  meter_id: number;
  observed_property_type_id: number;
  unit_id: number;
  location_id?: number;
  ose_share: boolean;
}
