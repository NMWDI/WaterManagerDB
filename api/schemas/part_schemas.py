from typing import List, Optional, Any
from api.schemas.base import ORMBase


class PartTypeLU(ORMBase):
    name: Optional[str]
    description: Optional[str]


class Part(ORMBase):
    part_number: str
    description: Optional[str]
    vendor: Optional[str]
    count: int
    note: Optional[str]
    in_use: bool
    commonly_used: bool

    part_type_id: Optional[int]

    part_type: Optional[Any]
    meter_types: Optional[List[Any]] # MeterTypeLU, but cant import bc of circular imports


class PartUsed(ORMBase):
    part_id: int
    meter_id: int
