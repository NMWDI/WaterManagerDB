from pydantic import BaseModel
from typing import Optional


class ORMBase(BaseModel):
    id: Optional[int] = None  # TODO: not optional

    class Config:
        from_attributes = True
