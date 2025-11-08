"""Test run related API routes."""

from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/test-runs", tags=["Test Runs"])


def _parse_date(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date format.") from exc


@router.get("", response_model=schemas.PaginatedTestRuns)
def list_test_runs(
    status_filter: Optional[str] = Query(None, alias="status"),
    suite_id: Optional[UUID] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    q: Optional[str] = Query(None, description="Search by run ID or suite name"),
    db: Session = Depends(get_db),
) -> schemas.PaginatedTestRuns:
    """List paginated test runs."""
    runs, total = crud.list_test_runs(
        db,
        status=status_filter,
        suite_id=suite_id,
        limit=limit,
        offset=offset,
        start_date=_parse_date(start_date),
        end_date=_parse_date(end_date),
        search=q,
    )
    return schemas.PaginatedTestRuns(
        data=[crud.serialize_run(run) for run in runs],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/{run_id}", response_model=schemas.TestRunDetail)
def get_test_run(run_id: UUID, db: Session = Depends(get_db)) -> schemas.TestRunDetail:
    """Return run detail with test cases."""
    run = crud.get_test_run(db, run_id)
    if not run:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")
    return crud.serialize_run_detail(run)


@router.post("", response_model=schemas.TestRunDetail, status_code=status.HTTP_201_CREATED)
def trigger_test_run(payload: schemas.CreateTestRunRequest, db: Session = Depends(get_db)) -> schemas.TestRunDetail:
    """Trigger a new mock AI test run."""
    try:
        run = crud.create_test_run(db, payload.suite_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return crud.serialize_run_detail(run)
