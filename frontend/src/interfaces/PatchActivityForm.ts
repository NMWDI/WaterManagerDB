import type { Dayjs } from "dayjs";
import {
  User,
  Well,
  ActivityTypeLU,
  NoteTypeLU,
  ServiceTypeLU,
  Part,
} from "./models";

export interface PatchActivityForm {
  activity_id: number;
  meter_id?: number | null;
  activity_date: Dayjs;
  activity_start_time: Dayjs;
  activity_end_time: Dayjs;
  activity_type: ActivityTypeLU;
  submitting_user: User;
  description: string;

  well?: Well;
  water_users?: string;

  notes?: NoteTypeLU[];
  services?: ServiceTypeLU[];
  parts_used?: Part[];

  ose_share: boolean;
}
