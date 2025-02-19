export interface PatchActivitySubmit {
  activity_id: number;
  timestamp_start: string;
  timestamp_end: string;
  description: string;
  submitting_user_id: number;
  meter_id?: number | null;
  activity_type_id: number;
  location_id?: number;
  ose_share: boolean;
  water_users: string;

  note_ids?: number[];
  service_ids?: number[];
  part_ids?: number[];
}
