from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from decimal import Decimal
from datetime import datetime

class ProductoBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=150)
    descripcion: Optional[str] = None
    categoria: str = Field(..., min_length=2, max_length=50)
    precio: Decimal = Field(..., gt=0)
    stock: int = Field(default=0, ge=0)
    stock_minimo: int = Field(default=5, ge=0)

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=150)
    descripcion: Optional[str] = None
    categoria: Optional[str] = None
    precio: Optional[Decimal] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    stock_minimo: Optional[int] = Field(None, ge=0)
    activo: Optional[bool] = None

class ProductoResponse(ProductoBase):
    id: int
    negocio_id: int
    activo: bool
    fecha_creacion: datetime

    model_config = ConfigDict(from_attributes=True)

class ProductoListResponse(BaseModel):
    items: List[ProductoResponse]
    total: int
    page: int
    pageSize: int
    totalPages: int
