from pydantic import BaseModel


class ORMBase(BaseModel):
    id: int

    class Config:
        from_attributes = True
