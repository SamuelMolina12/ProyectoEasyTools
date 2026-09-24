from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class UsuarioPublic(BaseModel):
    id: int
    negocio_id: Optional[int] = None   # None para SuperAdmin
    nombre: str
    correo: str
    rol: str
    activo: bool
    negocio_nombre: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
