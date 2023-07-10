import { SortDirection, MeterSortByField } from 'enums'

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
    contact_name?: string
    land_owner_name?: string
    phone?: string
    email?: string
    city?: string
}

export interface MeterLocation {
    name?: string
    latitude?: float
    longitude?: float
    trss?: string

    land_owner?: LandOwner

    // Also has land owner
}

export interface MeterDetails {
    id?: number
    serial_number?: string
    contact_name?: string
    contact_phone?: string
    ra_number?: string
    tag?: string
    well_distance_ft?: float
    notes?: string

    meter_type?: MeterType
    status?: MeterStatus
    meter_location?: MeterLocation
    // Also has parts_associated?: List[Part]
}

export interface MeterListQueryParams {
    search_string: string
    sort_by: MeterSortByField
    sort_direction: SortDirection
    limit: number
    offset: number
}

export interface MeterMapDTO {
    id: number
    meter_location: {longitude: number, latitude: number}
}

export interface MeterType {
    brand: string
}

export interface Organization {
    organization_name: string
}

export interface Meter {
    id: number
    serial_number: string
    meter_type: MeterType
    organization: Organization
    ra_number: string
}

export interface MeterListDTO {
    id: number
    serial_number: string
    trss: string
    meter_location: {land_owner: {land_owner_name: string}}
    ra_number: string
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
    technician_id: number
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
