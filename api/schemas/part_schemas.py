from api.schemas.base import ORMBase
from api.schemas.meter_schemas import MeterTypeLU


class PartTypeLU(ORMBase):
    name: str | None = None
    description: str | None = None


class Part(ORMBase):
    part_number: str
    description: str | None = None
    vendor: str | None = None
    count: int
    note: str | None = None
    in_use: bool
    commonly_used: bool
    price: float | None = None
    part_type_id: int

    part_type: PartTypeLU | None = None
    meter_types: list[MeterTypeLU] | None = None


class PartUsed(ORMBase):
    part_id: int
    meter_id: int
