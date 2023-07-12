"""
FastAPI input and response schemas related to PVACD activities
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, constr

from api.schemas.part_schemas import PartUsed

# Define a phone number - nnn-nnn-nnnn
PhoneConstr = constr(
    strip_whitespace=True,
    regex="\d{3}-\d{3}-\d{4}",
)


class LandOwner(BaseModel):
    id: int
    contact_name: Optional[str]
    land_owner_name: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    city: Optional[str]

    class Config:
        orm_mode = True


class Technician(BaseModel):
    """
    Details technician information
    """

    technician_id: int
    technician_name: str


class Unit(BaseModel):
    """
    Describes Units
    """

    unit_id: int
    unit_name: str


class ActivityType(BaseModel):
    """
    Details the type of activity
    """

    activity_id: int
    activity_name: str


class Activity(BaseModel):
    """
    Used in Maintenance schema
    """

    timestamp_start: datetime
    timestamp_end: datetime
    activity_id: int  # Type ID
    technician_id: int
    notes: Optional[str]
    activity_type: Optional[ActivityType]


class Observation(BaseModel):
    """
    Used in Maintenance schema
    """

    timestamp: datetime
    value: float
    observed_property_id: int
    unit_id: int
    notes: Optional[str]
    technician_id: int


class ObservationType(BaseModel):
    """
    Details the type of observation
    """

    observed_property_id: int
    observed_property_name: str
    observed_property_units: List[Unit]


class InstallationUpdate(BaseModel):
    """
    Used in Maintenance
    """

    contact_name: Optional[str]
    contact_phone: Optional[PhoneConstr]
    land_owner_id: Optional[int]
    ra_number: Optional[str]
    well_distance_ft: Optional[float]
    tag: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    trss: Optional[str]
    notes: Optional[str]


class ActivitiesFormOptions(BaseModel):
    """
    Details available options to be used in activities form
    """

    serial_numbers: List[str]
    activity_types: List[ActivityType]
    observed_properties: List[ObservationType]
    technicians: List[Technician]
    land_owners: List[LandOwner]


class Maintenance(BaseModel):
    """
    Data associated with maintenance
    """

    meter_id: int
    activity: Activity
    installation_update: Optional[InstallationUpdate]
    observations: Optional[List[Observation]]
    parts: Optional[List[PartUsed]]
