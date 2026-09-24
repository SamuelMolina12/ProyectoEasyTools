from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from decimal import Decimal
from datetime import datetime


# === Detalle de venta (un ítem del carrito) ===

class DetalleVentaCreate(BaseModel):
    producto_id: int = Field(..., gt=0)
    cantidad: int = Field(..., gt=0, description="Cantidad debe ser mayor a 0")


class DetalleVentaResponse(BaseModel):
    id: int
    producto_id: int
    producto_nombre: Optional[str] = None
    cantidad: int
    precio_unitario: Decimal
    subtotal: Decimal

    model_config = ConfigDict(from_attributes=True)


# === Venta ===

class VentaCreate(BaseModel):
    detalles: List[DetalleVentaCreate] = Field(
        ..., min_length=1, description="Debe incluir al menos un producto"
    )
    cliente_id: Optional[int] = None  # Opcional: venta puede no estar asociada a un cliente


class VentaResponse(BaseModel):
    id: int
    negocio_id: int
    usuario_id: int
    cliente_id: Optional[int] = None
    total: Decimal
    estado: str
    fecha_venta: datetime
    detalles: List[DetalleVentaResponse] = []

    model_config = ConfigDict(from_attributes=True)


class VentaListResponse(BaseModel):
    items: List[VentaResponse]
    total: int
    page: int
    pageSize: int
    totalPages: int
