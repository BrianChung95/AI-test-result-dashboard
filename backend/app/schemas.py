"""Pydantic schemas for the API."""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class TestCase(BaseModel):
    """Represents a single test case result."""

    id: UUID
    name: str
    description: Optional[str]
    status: str
    execution_time_ms: int
    ai_insight: Optional[str]
    error_message: Optional[str]
    stack_trace: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class TestRunBase(BaseModel):
    """Shared fields for test runs."""

    id: UUID
    suite_id: UUID
    suite_name: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime]
    duration_ms: Optional[int]
    total_tests: int
    passed_tests: int
    failed_tests: int

    class Config:
        from_attributes = True


class TestRunSummary(TestRunBase):
    """Test run summary for listings."""


class TestRunDetail(TestRunBase):
    """Detailed test run including test cases."""

    test_cases: List[TestCase]


class PaginatedTestRuns(BaseModel):
    """Paginated response for test runs."""

    data: List[TestRunSummary]
    total: int
    limit: int
    offset: int


class CreateTestRunRequest(BaseModel):
    """Payload for starting a new test run."""

    suite_id: UUID = Field(..., description="Test suite ID to execute")


class TestSuite(BaseModel):
    """Basic test suite representation."""

    id: UUID
    name: str
    description: Optional[str]
    target_url: Optional[str]
    created_at: datetime
    last_run_status: Optional[str] = None
    last_run_at: Optional[datetime] = None
    total_tests: Optional[int] = None

    class Config:
        from_attributes = True


class TestSuiteDetail(TestSuite):
    """Detailed suite response with recent runs."""

    recent_runs: List[TestRunSummary]


class DashboardStats(BaseModel):
    """Top level dashboard metrics."""

    total_runs: int
    pass_rate: float
    failed_tests: int
    avg_duration_ms: float
    total_tests: int


class DashboardTrends(BaseModel):
    """Trend dataset for charts."""

    dates: List[str]
    passed: List[int]
    failed: List[int]

