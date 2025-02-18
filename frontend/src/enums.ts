export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  LOGIN_TIMEOUT = 440,
  INTERNAL_SERVER_ERROR = 500,
}

export enum SortDirection {
  Ascending = "asc",
  Descending = "desc",
}

export enum GCSdimension {
  Latitude = "latitude",
  Longitude = "longitude",
}

export enum MeterSortByField {
  SerialNumber = "serial_number",
  RANumber = "ra_number",
  LandOwner = "land_owner_name",
  TRSS = "trss",
}

export enum MeterStatusNames {
  Installed = "Installed",
  Warehouse = "Warehouse",
  Scrapped = "Scrapped",
  Returned = "Returned",
  Sold = "Sold",
  Unknown = "Unknown",
}

export enum WellSortByField {
  Name = "name",
  RANumber = "ra_number",
  OSEPod = "osepod",
  UseType = "use_type",
  Location = "location",
}

export enum MeterHistoryType {
  Activity = "Activity",
  Observation = "Observation",
}

export enum ActivityType {
  Install = "Install",
  Uninstall = "Uninstall",
  GeneralMaintenance = "General Maintenance",
  PreventativeMaintenance = "Preventative Maintenance",
  Repair = "Repair",
  RateMeter = "Rate Meter",
  Sell = "Sell",
  Scrap = "Scrap",
  ChangeWaterUsers = "Change Water Users",
}

export enum WorkingOnArrivalValue {
  NotChecked = "not-checked",
  NotWorking = "not-working",
  Working = "working",
}

export enum WorkOrderStatus {
  Open = "Open",
  Closed = "Closed",
  Review = "Review",
}
