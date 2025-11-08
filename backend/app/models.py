"""SQLAlchemy ORM models."""

from __future__ import annotations

from datetime import datetime
from typing import List
from uuid import uuid4

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class TestSuite(Base):
    """Collection of related test cases."""

    __tablename__ = "test_suites"

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    target_url: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    runs: Mapped[List["TestRun"]] = relationship("TestRun", back_populates="suite", cascade="all, delete")


class TestRun(Base):
    """Represents a single execution of a test suite."""

    __tablename__ = "test_runs"
    __table_args__ = (
        UniqueConstraint("id", name="uq_test_runs_id"),
    )

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    suite_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("test_suites.id", ondelete="CASCADE"), index=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    duration_ms: Mapped[int | None] = mapped_column(Integer)
    total_tests: Mapped[int] = mapped_column(Integer, default=0)
    passed_tests: Mapped[int] = mapped_column(Integer, default=0)
    failed_tests: Mapped[int] = mapped_column(Integer, default=0)

    suite: Mapped["TestSuite"] = relationship("TestSuite", back_populates="runs")
    test_cases: Mapped[List["TestCase"]] = relationship("TestCase", back_populates="run", cascade="all, delete-orphan")


class TestCase(Base):
    """Individual test case result."""

    __tablename__ = "test_cases"

    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    run_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("test_runs.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    execution_time_ms: Mapped[int] = mapped_column(Integer)
    ai_insight: Mapped[str | None] = mapped_column(Text)
    error_message: Mapped[str | None] = mapped_column(Text)
    stack_trace: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    run: Mapped["TestRun"] = relationship("TestRun", back_populates="test_cases")

