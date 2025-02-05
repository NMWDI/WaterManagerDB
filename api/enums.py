from enum import Enum
from api.security import scoped_user


class MeterSortByField(Enum):
    SerialNumber = "serial_number"
    RANumber = "ra_number"
    WaterUsers = "water_users"
    TRSS = "trss"


class WellSortByField(Enum):
    Name = "name"
    RANumber = "ra_number"
    OSETag = "osetag"
    UseType = "use_type"
    Location = "location"

class MeterStatus(Enum):
    #Status can be: Installed, Warehouse, Scrapped, Returned, Sold, or Unknown
    Installed = "Installed"
    Warehouse = "Warehouse"
    Scrapped = "Scrapped"
    Returned = "Returned"
    Sold = "Sold"
    Unknown = "Unknown"
    OnHold = "On Hold"

class SortDirection(Enum):
    Ascending = "asc"
    Descending = "desc"


class ScopedUser(Enum):
    Read = scoped_user(["read"])
    Admin = scoped_user(["admin"])
    OSE = scoped_user(["ose"])
    ActivityWrite = scoped_user(["activities:write"])
    WellMeasurementWrite = scoped_user(["well_measurement:write"])
    MeterWrite = scoped_user(["meters:write"])
    WellWrite = scoped_user(["well:write"])

class WorkOrderStatus(Enum):
    Open = "Open"
    Closed = "Closed"
    Review = "Review"
