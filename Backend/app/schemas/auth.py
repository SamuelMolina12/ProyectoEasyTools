from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.usuario import UsuarioPublic

class LoginRequest(BaseModel):
    correo: str
    password: str

class RegisterRequest(BaseModel):
    nombre: str
    correo: str
    password: str
    negocio_id: int
    codigo_negocio: str  # Clave secreta del negocio para validar pertenencia

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UsuarioPublic
