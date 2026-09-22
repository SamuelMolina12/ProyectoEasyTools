from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from app.core.config import settings

# Engine configurado para Microsoft SQL Server con pyodbc
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    """Dependency para inyectar la sesión de base de datos en las rutas de FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
