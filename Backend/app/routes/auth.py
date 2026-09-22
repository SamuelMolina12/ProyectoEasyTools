from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.usuario import UsuarioPublic
from app.models.usuario import Usuario
from app.services.auth_service import authenticate_user, register_user, get_current_user, build_usuario_public
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/login", response_model=TokenResponse)
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    """Inicia sesión con correo y contraseña. Retorna token JWT y perfil del usuario."""
    usuario = authenticate_user(db, creds)
    access_token = create_access_token(subject=usuario.id)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=build_usuario_public(usuario)
    )

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """Registra un nuevo usuario validando la clave del negocio. Retorna token JWT inmediato."""
    usuario = register_user(db, data)
    access_token = create_access_token(subject=usuario.id)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=build_usuario_public(usuario)
    )

@router.get("/me", response_model=UsuarioPublic)
def get_profile(current_user: Usuario = Depends(get_current_user)):
    """Obtiene los datos del usuario autenticado actual."""
    return build_usuario_public(current_user)
