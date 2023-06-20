"""
FastAPI input and response schemas related to PVACD parts
"""

from typing import List, Optional
from pydantic import BaseModel


class Part(BaseModel):
    """
    Complete description of a part
    """

    part_id: int
    part_number: str
    description: str
    part_type: str
    commonly_used: bool


class PartUsed(BaseModel):
    """
    Describes quantity used of a given part number
    """

    part_id: int
    count: int
