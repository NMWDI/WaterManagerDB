import type { Dayjs } from "dayjs";
import {
  MeterListDTO,
  ActivityTypeLU,
  User,
  MeterDetails,
  Unit,
  ObservedPropertyTypeLU,
  Well,
} from "../interfaces";

export interface ActivityFormControl {
  activity_details: {
    selected_meter?: Partial<MeterListDTO> | null;
    activity_type?: Partial<ActivityTypeLU>;
    user?: Partial<User>;
    date: Dayjs;
    start_time: Dayjs;
    end_time: Dayjs;
    share_ose: boolean;
    work_order_id?: number | null;
  };
  current_installation: {
    meter?: Partial<MeterDetails>;
    well?: Partial<Well>;
  };
  observations: Array<{
    time: Dayjs;
    reading: number | string;
    property_type?: Partial<ObservedPropertyTypeLU>;
    unit?: Partial<Unit>;
  }>;
  maintenance_repair?: {
    service_type_ids?: number[];
    description: string;
  };
  notes: {
    working_on_arrival_slug: string;
    selected_note_ids?: number[];
  };
  part_used_ids?: number[];
}
