from typing import List, Optional
from pydantic import BaseModel

class ORMBase(BaseModel):
    id: Optional[int] = None

    class Config:
        orm_mode = True


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

    part_type_id: int

    # part_type: Optional[PartTypeLU]
    # meter_types: Optional[List[any]] # MeterTypeLU, but cant import bc of circular imports


class PartUsed(ORMBase):
    part_id: int
    meter_id: int
