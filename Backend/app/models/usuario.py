from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.base import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    negocio_id = Column(Integer, ForeignKey("negocios.id", ondelete="SET NULL"), nullable=True, index=True)  # NULL para SuperAdmin
    nombre = Column(String(150), nullable=False)
    correo = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol = Column(String(30), default="empleado", nullable=False)  # superadmin, dueno, empleado
    activo = Column(Boolean, default=True, nullable=False)
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    fecha_actualizacion = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relaciones
    negocio = relationship("Negocio", back_populates="usuarios")
    ventas = relationship("Venta", back_populates="usuario")
    movimientos_inventario = relationship("MovimientoInventario", back_populates="usuario")
