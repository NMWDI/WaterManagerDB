from pydantic import BaseModel


class ORMBase(BaseModel):
    id: int | None = None

    class Config:
        from_attributes = True
