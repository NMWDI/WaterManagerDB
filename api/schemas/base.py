from pydantic import BaseModel
from typing import Optional


class ORMBase(BaseModel):
    id: Optional[int] = None  # TODO: not optional

    class Config:
        orm_mode = True
