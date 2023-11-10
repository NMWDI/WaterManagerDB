import { SortDirection, MeterSortByField, WellSortByField } from 'enums'
import internal from 'stream'
import { ActivityType } from './enums'

export interface ActivityForm {

    activity_details?: {
        meter_id?: number
        activity_type_id?: number
        user_id?: number
        date?: Dayjs
        start_time?: Dayjs
        end_time?: Dayjs
    }

    current_installation?: {
        contact_name?: string
        contact_phone?: string
        well_id?: number
        well_distance_ft?: number
        notes?: string
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
    meter_type_associations?: {
        id: number
        part_id: number
        meter_type_id: number
        commonly_used: boolean
        associated_meter_type: MeterTypeLU
    }[]
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
    well_distance_ft?: number | null
    use_type_id?: number | null
    ra_number?: string | null
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
    activity_type?: string
    date: Date
    history_item: any
}

export interface MeterType {
    id?: int
    brand?: string
    series?: string
    model_number?: string
    size?: float
    description?: string
}

export interface MeterStatus {
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
    model_number: string
    size: number
    description: string
    in_use: boolean
}

export interface MeterDetails {
    id?: number | null
    serial_number?: string | null
    contact_name?: string | null
    contact_phone?: string | null
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
    sort_by?: MeterSortByField
    sort_direction?: SortDirection
    limit?: number
    offset?: number
    exclude_inactive?: boolean
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
    well_distance_ft?: number
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
