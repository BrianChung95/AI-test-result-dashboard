"""FastAPI application entrypoint."""

from __future__ import annotations

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import crud
from .database import init_db
from .routers import dashboard, test_runs, test_suites

app = FastAPI(
    title="AI Test Results Dashboard API",
    version="1.0.0",
    description="Mock AI-powered software testing platform backend.",
)

origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test_runs.router)
app.include_router(test_suites.router)
app.include_router(dashboard.router)


@app.on_event("startup")
def on_startup() -> None:
    """Initialize database and seed data."""
    init_db(crud.seed_database)


@app.get("/")
def root() -> dict[str, str]:
    """Simple health endpoint."""
    return {"message": "AI Test Results Dashboard API"}

