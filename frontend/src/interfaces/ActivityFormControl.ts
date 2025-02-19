import type { Dayjs } from "dayjs";
import {
  MeterListDTO,
  ActivityTypeLU,
  User,
  MeterDetails,
  Units,
  ObservedPropertyTypeLU,
  Well
} from "./index";

// This might could be the full things that are selected, but for now its only the things that are submitted/validated
// These need to be the actual interfaces eventually, meter -> MeterListDTO
export interface ActivityFormControl {
    activity_details: {
        selected_meter: Partial<MeterListDTO> | null
        activity_type: Partial<ActivityTypeLU> | null
        user: Partial<User> | null
        date: Dayjs
        start_time: Dayjs
        end_time: Dayjs
        share_ose: boolean = false
        work_order_id: number | null
    },
    current_installation: {
        meter: Partial<MeterDetails> | null
        well: Partial<Well> | null
    },
    observations: Array<{
        time: Dayjs
        reading: '' | number
        property_type: Partial<ObservedPropertyTypeLU> | null
        unit: Partial<Units> | null
    }>,
    maintenance_repair?: {
        service_type_ids: number[] | null,
        description: string
    },
    notes: {
        working_on_arrival_slug: string,
        selected_note_ids: number[] | null
    },
    part_used_ids?: []
}

