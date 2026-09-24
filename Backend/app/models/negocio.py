from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.base import Base

class Negocio(Base):
    __tablename__ = "negocios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(150), nullable=False, index=True)
    telefono = Column(String(30), nullable=True)
    codigo_acceso_hash = Column(String(255), nullable=False)  # Hash de la clave/código del negocio
    actividad = Column(String(150), nullable=True)            # Ej. Tienda de abarrotes, papelería
    direccion = Column(String(255), nullable=True)
    dueno = Column(String(150), nullable=True)                # Nombre del propietario inicial
    correo = Column(String(150), nullable=True)
    activo = Column(Boolean, default=True, nullable=False)
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    fecha_actualizacion = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relaciones
    usuarios = relationship("Usuario", back_populates="negocio", cascade="all, delete-orphan")
    productos = relationship("Producto", back_populates="negocio", cascade="all, delete-orphan")
    clientes = relationship("Cliente", back_populates="negocio", cascade="all, delete-orphan")
    ventas = relationship("Venta", back_populates="negocio", cascade="all, delete-orphan")
    movimientos_inventario = relationship("MovimientoInventario", back_populates="negocio", cascade="all, delete-orphan")
