export interface PatchWorkOrder {
  work_order_id: number;
  title?: string;
  description?: string;
  status?: string;
  notes?: string;
  assigned_user_id?: number;
}
