"""
FastAPI input and response schemas related to PVACD parts
"""

from typing import List, Optional, Any
from pydantic import BaseModel


class ORMBase(BaseModel):
    id: Optional[int] = None

    class Config:
        orm_mode = True


class Part(ORMBase):
    """
    Complete description of a part
    """

    part_number: str
    part_type_id: int
    description: Optional[str]
    vendor: Optional[str]
    count: Optional[int]
    note: Optional[str]

class PartForm(ORMBase):
    """
    Part fields submitted to create or update a part
    """

    part_number: str
    part_type_id: int
    description: Optional[str]
    vendor: Optional[str]
    count: Optional[int]
    note: Optional[str]
    associated_meter_types: Optional[List[Any]]


class PartUsed(ORMBase):
    """
    Describes quantity used of a given part number
    """

    part_id: int
    meter_id: int
    count: int
