'''
Routes related to OSE reporting and work requests
'''
from typing import List
from datetime import datetime

from fastapi import Depends, APIRouter
from sqlalchemy import select
from sqlalchemy.orm import Session


from api.schemas import ose_schemas
from api.models.main_models import (
    Meters,
    MeterActivities,
    MeterObservations,
    Wells
)

from api.security import scoped_user
from api.session import get_db

ose_router = APIRouter()
ose_user = scoped_user(["read", "admin", "ose"])

@ose_router.get(
        "/ose_well_history",
        response_model=List[ose_schemas.WellActivities],
        tags=["OSE"]
    )
def get_ose_history(start_date: datetime, end_date: datetime,db: Session = Depends(get_db)):
    '''
    Returns activities and meter readings for each OSE well over input date range
    '''

    return 0
