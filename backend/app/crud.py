"""Database operations and seeding utilities."""

from __future__ import annotations

import random
from datetime import datetime, timedelta
from typing import Iterable, List, Sequence, Tuple
from uuid import UUID

from sqlalchemy import String, desc, func, or_
from sqlalchemy.orm import Session, joinedload

from . import models
from .schemas import DashboardStats, DashboardTrends, TestRunDetail, TestRunSummary, TestSuite, TestSuiteDetail
from .utils import mock_ai

SUITE_SEED_DATA = [
    {
        "name": "E-commerce Checkout Flow",
        "description": "Tests covering the complete purchase journey from cart to confirmation",
        "target_url": "https://demo-shop.example.com",
    },
    {
        "name": "User Authentication System",
        "description": "Comprehensive tests for login, registration, and password reset flows",
        "target_url": "https://auth.example.com",
    },
    {
        "name": "API Integration Tests",
        "description": "Validates REST API endpoints for data consistency and performance",
        "target_url": "https://api.example.com/v1",
    },
    {
        "name": "Accessibility Compliance",
        "description": "Automated WCAG 2.1 accessibility checks across main user flows",
        "target_url": "https://app.example.com",
    },
]


def seed_database(db: Session) -> None:
    """Seed suites and historical runs if they do not exist."""
    if db.query(models.TestSuite).count() == 0:
        suites = [models.TestSuite(**suite) for suite in SUITE_SEED_DATA]
        db.add_all(suites)
        db.flush()
    else:
        suites = db.query(models.TestSuite).all()

    if db.query(models.TestRun).count() >= 20:
        return

    for _ in range(random.randint(20, 30)):
        suite = random.choice(suites)
        start_time = datetime.utcnow() - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
        mock_ai.generate_historical_run(db, suite, started_at=start_time)


def list_test_runs(
    db: Session,
    *,
    status: str | None = None,
    suite_id: UUID | None = None,
    limit: int = 20,
    offset: int = 0,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    search: str | None = None,
) -> Tuple[List[models.TestRun], int]:
    """Return filtered test runs."""
    query = db.query(models.TestRun).join(models.TestSuite)

    if status:
        query = query.filter(models.TestRun.status == status)
    if suite_id:
        query = query.filter(models.TestRun.suite_id == str(suite_id))
    if start_date:
        query = query.filter(models.TestRun.started_at >= start_date)
    if end_date:
        query = query.filter(models.TestRun.started_at <= end_date)
    if search:
        ilike = f"%{search}%"
        query = query.filter(
            or_(models.TestSuite.name.ilike(ilike), func.cast(models.TestRun.id, String).ilike(ilike))
        )

    total = query.count()
    data = (
        query.options(joinedload(models.TestRun.suite))
        .order_by(desc(models.TestRun.started_at))
        .limit(limit)
        .offset(offset)
        .all()
    )
    return data, total


def get_test_run(db: Session, run_id: UUID) -> models.TestRun | None:
    """Fetch a single test run."""
    return (
        db.query(models.TestRun)
        .options(joinedload(models.TestRun.suite), joinedload(models.TestRun.test_cases))
        .filter(models.TestRun.id == str(run_id))
        .first()
    )


def create_test_run(db: Session, suite_id: UUID) -> models.TestRun:
    """Create and populate a new test run."""
    suite = db.query(models.TestSuite).filter(models.TestSuite.id == str(suite_id)).first()
    if not suite:
        raise ValueError("Test suite not found")

    run = mock_ai.start_run(db, suite)
    mock_ai.complete_run_with_results(db, run)
    db.flush()
    return get_test_run(db, run.id)


def list_test_suites(db: Session) -> List[TestSuite]:
    """Return test suites with latest run metadata."""
    suites = db.query(models.TestSuite).options(joinedload(models.TestSuite.runs)).all()
    result: List[TestSuite] = []
    for suite in suites:
        last_run = max(suite.runs, key=lambda r: r.started_at) if suite.runs else None
        total_tests = sum(run.total_tests for run in suite.runs)
        result.append(
            TestSuite(
                id=suite.id,
                name=suite.name,
                description=suite.description,
                target_url=suite.target_url,
                created_at=suite.created_at,
                last_run_status=last_run.status if last_run else None,
                last_run_at=last_run.started_at if last_run else None,
                total_tests=total_tests,
            )
        )
    return result


def get_test_suite_detail(db: Session, suite_id: UUID) -> TestSuiteDetail | None:
    """Return suite detail with recent runs."""
    suite = (
        db.query(models.TestSuite)
        .options(joinedload(models.TestSuite.runs))
        .filter(models.TestSuite.id == str(suite_id))
        .first()
    )
    if not suite:
        return None

    sorted_runs = sorted(suite.runs, key=lambda r: r.started_at, reverse=True)
    summaries = [serialize_run(run) for run in sorted_runs[:5]]

    return TestSuiteDetail(
        id=suite.id,
        name=suite.name,
        description=suite.description,
        target_url=suite.target_url,
        created_at=suite.created_at,
        last_run_status=sorted_runs[0].status if sorted_runs else None,
        last_run_at=sorted_runs[0].started_at if sorted_runs else None,
        total_tests=sum(run.total_tests for run in suite.runs),
        recent_runs=summaries,
    )


def serialize_run(run: models.TestRun) -> TestRunSummary:
    """Serialize a TestRun ORM model."""
    return TestRunSummary(
        id=run.id,
        suite_id=run.suite_id,
        suite_name=run.suite.name if run.suite else "",
        status=run.status,
        started_at=run.started_at,
        completed_at=run.completed_at,
        duration_ms=run.duration_ms,
        total_tests=run.total_tests,
        passed_tests=run.passed_tests,
        failed_tests=run.failed_tests,
    )


def serialize_run_detail(run: models.TestRun) -> TestRunDetail:
    """Serialize a TestRun with cases."""
    base = serialize_run(run).model_dump()
    return TestRunDetail(**base, test_cases=run.test_cases)


def get_dashboard_stats(db: Session) -> DashboardStats:
    """Aggregate dashboard metrics."""
    total_runs = db.query(func.count(models.TestRun.id)).scalar() or 0
    total_tests = db.query(func.coalesce(func.sum(models.TestRun.total_tests), 0)).scalar() or 0
    failed_tests = db.query(func.coalesce(func.sum(models.TestRun.failed_tests), 0)).scalar() or 0
    avg_duration = db.query(func.coalesce(func.avg(models.TestRun.duration_ms), 0)).scalar() or 0.0
    passed_tests = total_tests - failed_tests
    pass_rate = (passed_tests / total_tests * 100) if total_tests else 0.0

    return DashboardStats(
        total_runs=total_runs,
        pass_rate=round(pass_rate, 2),
        failed_tests=failed_tests,
        avg_duration_ms=float(round(avg_duration, 2)),
        total_tests=total_tests,
    )


def get_dashboard_trends(db: Session, *, days: int = 7) -> DashboardTrends:
    """Return counts per day."""
    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=days - 1)

    rows = (
        db.query(
            func.date(models.TestRun.started_at).label("day"),
            func.sum(models.TestRun.passed_tests).label("passed"),
            func.sum(models.TestRun.failed_tests).label("failed"),
        )
        .filter(models.TestRun.started_at >= start_date)
        .group_by("day")
        .order_by("day")
        .all()
    )

    day_map = {row.day: row for row in rows}
    dates: List[str] = []
    passed_counts: List[int] = []
    failed_counts: List[int] = []

    for i in range(days):
        current = start_date + timedelta(days=i)
        row = day_map.get(current)
        dates.append(current.isoformat())
        passed_counts.append(int(row.passed) if row else 0)
        failed_counts.append(int(row.failed) if row else 0)

    return DashboardTrends(dates=dates, passed=passed_counts, failed=failed_counts)
