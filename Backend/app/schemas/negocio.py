from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class NegocioBase(BaseModel):
    nombre: str
    telefono: Optional[str] = None
    actividad: Optional[str] = None
    direccion: Optional[str] = None
    dueno: Optional[str] = None
    correo: Optional[str] = None

class NegocioCreate(NegocioBase):
    codigo_acceso: str  # Contraseña requerida para afiliar usuarios al negocio

class NegocioPublic(BaseModel):
    id: int
    nombre: str
    actividad: Optional[str] = None
    direccion: Optional[str] = None
    dueno: Optional[str] = None
    activo: bool

    model_config = ConfigDict(from_attributes=True)
