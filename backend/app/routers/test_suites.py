"""Test suite endpoints."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/test-suites", tags=["Test Suites"])


@router.get("", response_model=list[schemas.TestSuite])
def list_suites(db: Session = Depends(get_db)) -> list[schemas.TestSuite]:
    """Return all test suites."""
    return crud.list_test_suites(db)


@router.get("/{suite_id}", response_model=schemas.TestSuiteDetail)
def get_suite(suite_id: UUID, db: Session = Depends(get_db)) -> schemas.TestSuiteDetail:
    """Return suite detail."""
    suite = crud.get_test_suite_detail(db, suite_id)
    if not suite:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Suite not found")
    return suite

