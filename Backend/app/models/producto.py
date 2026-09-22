from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.base import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    negocio_id = Column(Integer, ForeignKey("negocios.id", ondelete="CASCADE"), nullable=False, index=True)
    nombre = Column(String(150), nullable=False, index=True)
    descripcion = Column(String(500), nullable=True)
    categoria = Column(String(50), nullable=False, index=True)
    precio = Column(Numeric(12, 2), nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    stock_minimo = Column(Integer, default=5, nullable=False)
    activo = Column(Boolean, default=True, nullable=False)
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    fecha_actualizacion = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relaciones
    negocio = relationship("Negocio", back_populates="productos")
    detalles_venta = relationship("DetalleVenta", back_populates="producto")
    movimientos_inventario = relationship("MovimientoInventario", back_populates="producto")
