# ===============================================================================
# FastAPI input and response schemas
# Meter related schemas
# ===============================================================================

from datetime import datetime
from typing import List, Optional, Union

from pydantic import BaseModel
from api.schemas.part_schemas import PartUsed
from api.schemas.well_schemas import Well, Location
from api.schemas.security_schemas import User

class ORMBase(BaseModel):
    id: Optional[int] = None

    class Config:
        orm_mode = True

class MeterMapDTO(ORMBase):
    class WellDTO(ORMBase):
        class MeterLocationDTO(ORMBase):
            longitude: Optional[float]
            latitude: Optional[float]
        location: Optional[MeterLocationDTO]


    id: int
    well: Optional[WellDTO]


class MeterTypeLU(ORMBase):
    id: int
    brand: Optional[str]
    series: Optional[str]
    model_number: str
    size: Optional[float]
    description: Optional[str]


# The minimal information used by the meters list
class MeterListDTO(ORMBase):

    class WellDTO(ORMBase):
        class LocationDTO(ORMBase):
            class LandOwnerDTO(ORMBase):
                contact_name: Optional[str]

            trss: Optional[str]
            land_owner: Optional[LandOwnerDTO]

        ra_number: Optional[str]
        location: Optional[LocationDTO]

    serial_number: str
    well: Optional[WellDTO]


class MeterStatusLU(ORMBase):
    status_name: Optional[str]
    description: Optional[str]


class Meter(ORMBase):
    serial_number: str
    contact_name: Optional[str]
    contact_phone: Optional[str]
    old_contact_name: Optional[str]
    tag: Optional[str]

    well_distance_ft: Optional[float]
    notes: Optional[str]

    meter_type_id: int
    status_id: Optional[int]
    well_id: Optional[str]

    meter_type: Optional[MeterTypeLU]
    status: Optional[MeterStatusLU]
    well: Optional[Well]

class Unit(ORMBase):
    """
    Describes Units
    """

    id: int
    name: Optional[str]
    name_short: Optional[str]
    description: Optional[str]


class ActivityTypeLU(ORMBase):
    """
    Details the type of activity
    """

    id: int
    name: Optional[str]
    description: Optional[str]


class MeterActivity(ORMBase):
    """
    Used in Maintenance schema
    """

    id: int
    timestamp_start: datetime
    timestamp_end: datetime
    notes: Optional[str]
    submitting_user_id: int
    meter_id: int
    activity_type_id: int
    location_id: int

    submitting_user: Optional[User]
    meter: Optional[Meter]
    activity_type: Optional[ActivityTypeLU]
    location: Optional[Location]
    parts_used: Optional[List[PartUsed]]


class ObservedPropertyTypeLU(ORMBase):
    """
    Details the type of observation
    """

    id: int
    name: Optional[str]
    description: Optional[str]
    context: Optional[str]


class MeterObservation(ORMBase):
    """
    Used in Maintenance schema
    """

    id: int
    timestamp: datetime
    value: float
    notes: Optional[str]

    submitting_user_id: int
    meter_id: int
    observed_property_type_id: int
    unit_id: int
    location_id: int

    submitting_user: Optional[User]
    meter: Optional[Meter]
    observed_property_type: Optional[ObservedPropertyTypeLU]
    unit: Optional[Unit]
    location: Optional[Unit]


# Not used? This is represented as a MeterActivity now
# class InstallationUpdate(ORMBase):
#     """
#     Used in Maintenance
#     """

#     contact_name: Optional[str]
#     contact_phone: Optional[PhoneConstr]
#     land_owner_id: Optional[int]
#     ra_number: Optional[str]
#     well_distance_ft: Optional[float]
#     tag: Optional[str]
#     latitude: Optional[float]
#     longitude: Optional[float]
#     trss: Optional[str]
#     notes: Optional[str]


# Not used? These come from seperate endpoints now
# class ActivitiesFormOptions(ORMBase):
#     """
#     Details available options to be used in activities form
#     """

#     serial_numbers: List[str]
#     activity_types: List[ActivityType]
#     observed_properties: List[ObservationType]
#     users: List[User]
#     land_owners: List[LandOwner]


# Not used? Represented as a MeterActivity now
# class Maintenance(ORMBase):
#     """
#     Data associated with maintenance
#     """

#     meter_id: int
#     activity: Activity
#     installation_update: Optional[InstallationUpdate]
#     observations: Optional[List[Observation]]
#     parts: Optional[List[PartUsed]]
