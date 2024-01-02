from typing import List
from api.schemas.base import ORMBase
from api.schemas.meter_schemas import MeterTypeLU


class PartTypeLU(ORMBase):
    name: str | None
    description: str | None


class Part(ORMBase):
    part_number: str
    description: str | None
    vendor: str | None
    count: int
    note: str | None
    in_use: bool
    commonly_used: bool

    part_type_id: int
    part_type: PartTypeLU | None

    meter_types: List[MeterTypeLU] | None


class PartUsed(ORMBase):
    part_id: int
    meter_id: int
