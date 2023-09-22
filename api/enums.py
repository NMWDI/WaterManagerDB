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
    MeterWrite = scoped_user(["meters:write"])
    Read = scoped_user(["read"])
    Admin = scoped_user(["admin"])
