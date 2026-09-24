from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.base import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    negocio_id = Column(Integer, ForeignKey("negocios.id", ondelete="CASCADE"), nullable=False, index=True)
    nombre = Column(String(150), nullable=False, index=True)
    telefono = Column(String(30), nullable=True)
    correo = Column(String(150), nullable=True)
    genero = Column(String(20), nullable=True)  # masculino, femenino, otro, no_especificado
    direccion = Column(String(255), nullable=True)
    activo = Column(Boolean, default=True, nullable=False)
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    fecha_actualizacion = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relaciones
    negocio = relationship("Negocio", back_populates="clientes")
    ventas = relationship("Venta", back_populates="cliente")
