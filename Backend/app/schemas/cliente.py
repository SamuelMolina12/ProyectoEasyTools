from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ClienteCreate(BaseModel):
    nombre: str
    telefono: Optional[str] = None
    correo: Optional[str] = None
    genero: Optional[str] = None   # masculino, femenino, otro, no_especificado
    direccion: Optional[str] = None


class ClienteUpdate(BaseModel):
    nombre: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[str] = None
    genero: Optional[str] = None
    direccion: Optional[str] = None
    activo: Optional[bool] = None


class ClienteResponse(BaseModel):
    id: int
    negocio_id: int
    nombre: str
    telefono: Optional[str] = None
    correo: Optional[str] = None
    genero: Optional[str] = None
    direccion: Optional[str] = None
    activo: bool
    fecha_creacion: datetime

    model_config = ConfigDict(from_attributes=True)
