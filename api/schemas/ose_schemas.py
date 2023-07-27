# ===============================================================================
# OSE Related Schemas
# Some of these schemas as similar to meter_schemas but are simplified
# ===============================================================================

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class WellActivity(BaseModel):
    """
    Describes an activity performed at a well
    """

    timestamp_start: datetime
    timestamp_end: datetime
    meter_sn: str
    activity_type: str
    activity_description: Optional[str]
    services: Optional[List[str]]
    notes: Optional[List[str]]
    
class MeterReading(BaseModel):
    """
    Describes water meter or energy meter readings at a well
    """

    timestamp: datetime
    meter_sn: str
    reading_type: str
    value: float
    units: str
    notes: Optional[List[str]]

class WellActivities(BaseModel):
    '''
    Describes all the activities associated with a well
    '''
    ra_number: str
    activities: List[WellActivity]
    meter_readings: List[MeterReading]