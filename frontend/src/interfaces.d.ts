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
    worker_id: number
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
