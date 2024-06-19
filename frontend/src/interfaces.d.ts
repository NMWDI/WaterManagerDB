import { SortDirection, MeterSortByField, WellSortByField } from 'enums'
import internal from 'stream'
import { ActivityType, MeterStatusNames } from './enums'
import { DateCalendarClassKey } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import exp from 'constants'

export interface ActivityForm {

    activity_details?: {
        meter_id?: number
        activity_type_id?: number
        user_id?: number
        date?: Dayjs
        start_time?: Dayjs
        end_time?: Dayjs
        share_ose: boolean
    }

    current_installation?: {
        contact_name?: string
        contact_phone?: string
        well_id?: number
        notes?: string
        water_users?: string
        meter_owner?: string
    }

    observations?: ObservationForm[]

    maintenance_repair?: {
        service_type_ids: number[]
        description: string
    }

    notes?: {
        working_on_arrival_slug: string
        selected_note_ids: number[]
    }

    part_used_ids?: number[]
}

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

export interface MeterActivity {
    id: int
    timestamp_start: Date
    timestamp_end: Date
    notes?: string
    submitting_user_id: int
    meter_id: int
    activity_type_id: int
    location_id: int

    submitting_user?: User
    meter?: Meter
    activity_type?: ActivityTypeLU
    location?: Location
    parts_used?: []
}

//This is designed to match the HistoryDetails form rather than the patch meter API
export interface PatchActivityForm {
    activity_id: int
    meter_id: int
    activity_date: dayjs.Dayjs
    activity_start_time: dayjs.Dayjs
    activity_end_time: dayjs.Dayjs
    activity_type: ActivityTypeLU
    submitting_user: User
    description: string

    well: Well | null
    water_users?: string

    notes?: NoteTypeLU[]
    services?: ServiceTypeLU[]
    parts_used?: Part[]

    ose_share: boolean
}

//This interface is designed to match the backend API patch endpoint
export interface PatchActivitySubmit {
    activity_id: int
    timestamp_start: string
    timestamp_end: string
    description: string
    submitting_user_id: int
    meter_id: int
    activity_type_id: int
    location_id: int | null
    ose_share: boolean
    water_users: string

    note_ids: int[] | null
    service_ids: int[] | null
    part_ids: int[] | null
}

//Designed for the HistoryDetails component, not the patch endpoint
export interface PatchObservationForm {
    observation_id: int
    submitting_user: User
    well: Well | null
    observation_date: dayjs.Dayjs
    observation_time: dayjs.Dayjs
    property_type: ObservedPropertyTypeLU
    unit: Unit
    value: number
    ose_share: boolean
    notes?: string
    meter_id: int
}

export interface PatchObservationSubmit {
    //Matches the backend API patch endpoint
    observation_id: int
    timestamp: string
    value: number
    notes: string | null
    submitting_user_id: int
    meter_id: int
    observed_property_type_id: int
    unit_id: int
    location_id: int | null
    ose_share: boolean
}

export interface ObservationForm {
    time: Dayjs
    reading: '' | number
    property_type_id: '' | number
    unit_id: '' | number
}

export interface WellUseLU {
    id: number
    use_type?: string
    code?: string
    description?: string
}

export interface PartTypeLU {
    id: int
    name: string
    description?: string
}

export interface Part {
    id: number
    part_number: string
    part_type_id: number
    vendor?: string
    note?: string
    description?: string
    count?: number
    in_use: boolean
    commonly_used: boolean

    part_type?: PartTypeLU
    meter_types?: MeterTypeLU[]

}

export interface PartAssociation {
    id: int
    meter_type_id: int
    part_id: int
    commonly_used: boolean
    part?: Part
}

export interface ServiceTypeLU {
    id: number
    service_name: string
    description?: string
}

export interface NoteTypeLU {
    id: number
    note: string
    details?: string
    slug?: string
    commonly_used: boolean
}

export interface WellUseLU {
    id: number
    use_type: string
    code: string
    description: string
}

export interface SubmitWellUpdate {
    id: number
    name: string
    ra_number: string
    owners: string
    osetag: string

    use_type: {
        id: number
    }

    location: {
        name: string,
        trss: string,
        longitude: float,
        latitude: float
    }
}

export interface SubmitWellCreate {
    name: string
    ra_number: string
    owners: string
    osetag: string

    use_type: {
        id: number
    }

    location: {
        name: string,
        trss: string,
        longitude: float,
        latitude: float
    }
}

export interface Well {
    id: int
    name?: string | null
    location_id?: number | null
    use_type_id?: number | null
    ra_number: string
    owners?: string | null
    osetag?: string | null

    use_type: WellUseLU | null
    location: Location | null
}

export interface MeterDetailsQueryParams {
    meter_id: number | undefined
}

export interface MeterPartParams {
    meter_id: number | undefined
}

export interface WellDetailsQueryParams {
    well_id: number | undefined
}

export interface WaterLevelQueryParams {
    well_id: number | undefined
}

export interface WellMergeParams {
    merge_well: string
    target_well: string
}

export interface ST2WaterLevelQueryParams {
    $filter: string
    $orderby: string
    datastreamID: number | undefined
}

export interface ActivityTypeLU {
    id: number
    name: string
    description: string
    permission: string
}

export interface ObservedPropertyTypeLU {
    id: number
    name: string
    description: string
    context: string

    units?: Unit[]
}

export interface Unit {
    id: number
    name: string
    name_short: string
    description: string
}

export interface MeterHistoryDTO {
    id: int
    history_type: string
    activity_type: string
    date: Date
    history_item: any
    location: Location
    well: Well | null
}

export interface MeterType {
    id?: int
    brand?: string
    series?: string
    model?: string
    size?: float
    description?: string
}

export interface MeterStatus {
    id: number
    status_name?: string
    description?: string
}

export interface LandOwner {
    id: number
    contact_name?: string
    land_owner_name?: string
    organization?: string
    phone?: string
    email?: string
    city?: string
}

export interface Location {
    name: string
    latitude: float
    longitude: float
    trss: string
    land_owner_id: number

    land_owner?: LandOwner
}

export interface MeterTypeLU {
    id: number
    brand: string
    series: string
    model: string
    size: number
    description: string
    in_use: boolean
}

export interface MeterDetails {
    id?: number | null
    serial_number?: string | null
    contact_name?: string | null
    contact_phone?: string | null
    water_users?: string | null
    meter_owner?: string | null
    ra_number?: string | null
    tag?: string | null
    well_distance_ft?: float | null
    notes?: string | null
    meter_type_id?: int | null
    well_id?: int | null

    meter_type: MeterType
    status: MeterStatus
    well: Well | null
    // Also has parts_associated?: List[Part]
}

export interface MeterListQueryParams {
    search_string?: string
    filter_by_status?: MeterStatusNames[]
    sort_by?: MeterSortByField
    sort_direction?: SortDirection
    limit?: number
    offset?: number
}

export interface MeterMapDTO {
    id: number
    serial_number: string
    well: {
        ra_number: string
        name: string
    }   
    location: {
        longitude: number
        latitude: number
    }
}

export interface Organization {
    organization_name: string
}

export interface Meter {
    id: number
    serial_number: string
    contact_name?: string
    contact_phone?: string
    notes?: string

    meter_type_id: number
    status_id?: number
    well_id: number
    location_id?: number

    meter_type?: MeterType
    status?: MeterStatus
    well?: Well
    location?: Location
}

export interface MeterListDTO {
    id: number
    serial_number: string
    status?: {status_name?: string}
    water_users: string
    location: {
        trss: string
        longitude: number
        latitude: number
    }
    well: {
        ra_number: string
        name: string
        owners: string
    }
}

interface WellListQueryParams {
    search_string?: string
    // sort_by?: WellSortByField
    sort_direction?: SortDirection
    limit?: number
    offset?: number
    exclude_inactive?: boolean
}

export interface Page<T> {
    items: T[]
    total: number
    limit: number
    offset: number
}

export interface MeterListQuery {
    search_string: string
    sort_by: MeterListSortBy
    sort_direction: SortDirection
    limit: number,
    offset: number
}

// Single manual measurement from a certain well
export interface WellMeasurementDTO {
    id: number
    timestamp: Date
    value: number
    submitting_user: {full_name: string}
}

// Single value from a NM ST2 endpoint, many other fields are returned, these are the only ones used at the moment
export interface ST2Measurement {
    result: number
    resultTime: Date
    phenomenonTime: Date
}

// Whole response returned from a NM ST2 endpoint
export interface ST2Response {
    "@iot.nextLink": string
    value: []
}

// The object that gets sent to the backend to add a new measurement
export interface NewWellMeasurement {
    well_id: number
    timestamp: Date
    value: number
    submitting_user_id: number
}

export interface PatchWellMeasurement {
    levelmeasurement_id: number
    submitting_user_id: number
    timestamp: dayjs.Dayjs
    value: number
}

export interface CreateUser {
    username: string
    full_name: string
    email: scope_string
    disabled: boolean
    user_role: {id: number}
    password: string
}

export interface UpdatedUserPassword {
    user_id: number
    new_password: string
}

export interface User {
    id: number
    username?: string
    full_name: string
    email?: scope_string
    disabled: boolean
    user_role_id?: number
    user_role?: UserRole

    password?: string
}

export interface NewUser {
    id: number
    username: string
    full_name: string
    email: scope_string
    disabled: boolean
    user_role_id: number
    password: string
}

export interface UserRole {
    id: number
    name: string
    security_scopes: SecurityScope[]
}

export interface SecurityScope {
    id: number
    scope_string: string
    description: string
}

export interface WorkOrder {
    work_order_id: number
    date_created: Date
    creator?: String 
    meter_serial: String
    title: String
    description: String
    status: String
    notes?: String
    assigned_user_id?: number
    assigned_user?: String
}

export interface NewWorkOrder {
    //Just the bare minimum to create a new work order
    //No work order ID since it is generated by the backend
    meter_id: number
    title: string
}

export interface PatchWorkOrder {
    // This is designed to match the backend API patch endpoint and is limited to the fields that can be updated
    work_order_id: number
    title?: string
    description?: string
    status?: string
    notes?: string
    assigned_user_id?: number
}
