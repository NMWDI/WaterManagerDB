export enum SortDirection {
    Ascending = 'asc',
    Descending = 'desc'
}

export enum MeterSortByField {
    SerialNumber = 'serial_number',
    RANumber = 'ra_number',
    LandOwner = 'land_owner_name',
    TRSS = 'trss'
}

export enum WellSortByField {
    Name = 'name',
    RANumber = 'ra_number',
    OSEPod = 'osepod',
    UseType = 'use_type',
    Location = 'location'
}

export enum MeterHistoryType {
    Activity = 'Activity',
    Observation = 'Observation'
}

export enum ActivityType {
    Install = 'Install',
    Uninstall = 'Uninstall',
    GeneralMaintenance = 'General Maintenance',
    PreventativeMaintenance = 'Preventative Maintenance',
    Repair = 'Repair',
    RateMeter = 'Rate Meter',
    Sell = 'Sell',
    Scrap = 'Scrap'
}

export enum WorkingOnArrivalValue {
    NotChecked = 'not-checked',
    NotWorking = 'not-working',
    Working = 'working'
}
