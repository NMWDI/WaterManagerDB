import { SortDirection, MeterSortByField } from 'enums'
import internal from 'stream'

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
        working_on_arrival: boolean
        selected_note_ids: number[]
    }

    part_used_ids?: number[]
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
    id: number // Just used for tracking them in the UI
    time: Dayjs
    reading: '' | number
    property_type_id: '' | number
    unit_id: '' | number
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

    part_type?: PartTypeLU
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
}

export interface Well {
    id: int
    name?: string
    location_id?: number
    ra_number?: string
    osepod?: string
    well_distance_ft?: number
    location: Location
}

export interface MeterDetailsQueryParams {
    meter_id: number | undefined
}

export interface WellDetailsQueryParams {
    well_id: number | undefined
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
}

export interface MeterDetails {
    id?: number
    serial_number?: string
    contact_name?: string
    contact_phone?: string
    old_contact_name?: string
    old_contact_phone?: string
    ra_number?: string
    tag?: string
    well_distance_ft?: float
    notes?: string
    meter_type_id?: int
    well_id?: int

    meter_type: MeterType
    status: MeterStatus
    well: Well
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
    well: {
        location: {
            longitude: number
            latitude: number
        }
    }
}

export interface MeterType {
    brand: string
}

export interface Organization {
    organization_name: string
}

export interface Meter {
    serial_number: string
    contact_name?: string
    contact_phone?: string
    old_contact_name?: string
    tag?: string

    well_distance_ft?: float
    notes?: string

    meter_type_id?: number
    status_id?: number
    well_id?: number

    meter_type?: MeterType
    status?: MeterStatus
    well?: Well
}

export interface MeterListDTO {
    id: number
    serial_number: string
    status?: {status_name?: string}
    well: {
        ra_number: string
        location: {
            trss: string
            land_owner: {
                organization: string
            }
        }
    }
}

interface WellSearchQueryParams {
    search_string: string
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
export interface ManualWaterLevelMeasurement {
    id: number
    well_id: number
    timestamp: Date
    value: number
    technician: string
}

// Single measurement from the ST2 endpoint
export interface ST2WaterLevelMeasurement {
    result: number
    resultTime: Date
}

// The object that gets sent to the backend to add a new measurement
export interface CreateManualWaterLevelMeasurement {
    well_id: number
    timestamp: Date
    value: number
    observed_property_id: number
    submitting_user_id: number
    unit_id: number
}

export interface User {
    username: string,
    full_name: string,
    email: scope_string
    disabled: boolean
    user_role_id: number
    user_role: UserRole
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
