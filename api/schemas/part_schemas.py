'''
FastAPI input and response schemas related to PVACD parts
'''

from typing import List, Optional
from pydantic import BaseModel


class ORMBase(BaseModel):
    id: Optional[int] = None

    class Config:
        orm_mode = True

class Part(BaseModel):
    '''
    Used in Maintenance
    '''
    part_id: int
    count: int

class PartTypeLU(ORMBase):
    name: str
    description: str
