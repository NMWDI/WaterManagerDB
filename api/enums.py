from enum import Enum
from api.security import scoped_user

class MeterSortByField(Enum):
    SerialNumber = "serial_number"
    RANumber = "ra_number"
    LandOwnerName = "land_owner_name"
    TRSS = "trss"


class WellSortByField(Enum):
    Name = 'name'
    RANumber = 'ra_number'
    OSEPod = 'osepod'
    UseType = 'use_type'
    Location = 'location'


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
