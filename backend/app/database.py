"""Database configuration and initialization helpers."""

from __future__ import annotations

import os
from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, scoped_session, sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:postgres@postgres:5432/postgres",
)

engine = create_engine(DATABASE_URL, future=True)
SessionLocal = scoped_session(sessionmaker(bind=engine, autoflush=False, autocommit=False))
Base = declarative_base()


@contextmanager
def session_scope() -> Generator:
    """Provide a transactional scope around a series of operations."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def get_db() -> Generator:
    """FastAPI dependency that yields a session."""
    with session_scope() as db:
        yield db


def init_db(seed_callback) -> None:
    """Create tables and seed initial data."""
    from . import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    with session_scope() as db:
        seed_callback(db)
