"""Dashboard analytics endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=schemas.DashboardStats)
def get_stats(db: Session = Depends(get_db)) -> schemas.DashboardStats:
    """Return aggregate dashboard metrics."""
    return crud.get_dashboard_stats(db)


@router.get("/trends", response_model=schemas.DashboardTrends)
def get_trends(days: int = Query(7, ge=1, le=30), db: Session = Depends(get_db)) -> schemas.DashboardTrends:
    """Return trend data for charts."""
    return crud.get_dashboard_trends(db, days=days)

