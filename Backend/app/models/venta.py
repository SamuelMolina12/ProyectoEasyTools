from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.base import Base

class Venta(Base):
    __tablename__ = "ventas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    negocio_id = Column(Integer, ForeignKey("negocios.id"), nullable=False, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=True, index=True)  # Nullable: clientes se agregan manualmente en Sprint 1
    total = Column(Numeric(12, 2), nullable=False)
    estado = Column(String(20), default="completada", nullable=False)  # completada, anulada
    motivo_anulacion = Column(String(255), nullable=True)
    fecha_venta = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relaciones
    negocio = relationship("Negocio", back_populates="ventas")
    usuario = relationship("Usuario", back_populates="ventas")
    cliente = relationship("Cliente", back_populates="ventas")
    detalles = relationship("DetalleVenta", back_populates="venta", cascade="all, delete-orphan")

class DetalleVenta(Base):
    __tablename__ = "detalles_venta"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    venta_id = Column(Integer, ForeignKey("ventas.id"), nullable=False, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False, index=True)
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Numeric(12, 2), nullable=False)
    subtotal = Column(Numeric(12, 2), nullable=False)

    # Relaciones
    venta = relationship("Venta", back_populates="detalles")
    producto = relationship("Producto", back_populates="detalles_venta")

class MovimientoInventario(Base):
    __tablename__ = "movimientos_inventario"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    negocio_id = Column(Integer, ForeignKey("negocios.id"), nullable=False, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    tipo = Column(String(20), nullable=False)  # 'entrada', 'salida_venta', 'ajuste', 'anulacion'
    cantidad = Column(Integer, nullable=False)
    stock_anterior = Column(Integer, nullable=False)
    stock_nuevo = Column(Integer, nullable=False)
    motivo = Column(String(255), nullable=True)
    fecha = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relaciones
    negocio = relationship("Negocio", back_populates="movimientos_inventario")
    producto = relationship("Producto", back_populates="movimientos_inventario")
    usuario = relationship("Usuario", back_populates="movimientos_inventario")
