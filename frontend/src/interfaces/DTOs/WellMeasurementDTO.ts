export interface WellMeasurementDTO {
  id: number;
  timestamp: Date;
  value: number;
  submitting_user: { full_name: string };
}
