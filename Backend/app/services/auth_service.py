from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from app.models.usuario import Usuario
from app.models.negocio import Negocio
from app.schemas.auth import LoginRequest, RegisterRequest
from app.schemas.usuario import UsuarioPublic
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.database.session import get_db
from app.services.negocio_service import get_negocio_by_id, verify_codigo_negocio

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def authenticate_user(db: Session, creds: LoginRequest) -> Usuario:
    """Valida correo y contraseña personal del usuario (incluyendo SuperAdmin)."""
    usuario = db.query(Usuario).filter(Usuario.correo == creds.correo.strip().lower()).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas. Verifica tu correo y contraseña.",
        )
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Este usuario se encuentra desactivado. Contacta al administrador.",
        )
    if not verify_password(creds.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas. Verifica tu correo y contraseña.",
        )
    # Para usuarios de negocio (no SuperAdmin), verificar que el negocio esté activo
    if usuario.rol != "superadmin" and usuario.negocio_id is not None:
        if usuario.negocio and not usuario.negocio.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El negocio asociado a esta cuenta se encuentra inactivo.",
            )
    return usuario


def register_user(db: Session, data: RegisterRequest) -> Usuario:
    """Registra un nuevo usuario validando existencia y clave del negocio.
    Si es el primer usuario del negocio, se le asigna rol 'dueno'."""
    # 1. Validar negocio
    negocio = get_negocio_by_id(db, data.negocio_id)
    if not negocio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El negocio seleccionado no existe.",
        )
    if not negocio.activo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El negocio seleccionado no está activo actualmente.",
        )

    # 2. Validar contraseña/código del negocio
    if not verify_codigo_negocio(negocio, data.codigo_negocio):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="La contraseña del negocio no es correcta. Solicítala al propietario o administrador.",
        )

    # 3. Validar correo único
    normalized_email = data.correo.strip().lower()
    existing_user = db.query(Usuario).filter(Usuario.correo == normalized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una cuenta registrada con este correo electrónico.",
        )

    # 4. Validar contraseña mínima
    if len(data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña personal debe tener al menos 6 caracteres.",
        )

    # 5. Determinar rol: el PRIMER usuario de un negocio es automáticamente Dueño
    usuarios_negocio = db.query(Usuario).filter(
        Usuario.negocio_id == negocio.id,
        Usuario.activo == True,
    ).count()
    rol = "dueno" if usuarios_negocio == 0 else "empleado"

    # 6. Crear usuario
    usuario = Usuario(
        negocio_id=negocio.id,
        nombre=data.nombre.strip(),
        correo=normalized_email,
        password_hash=hash_password(data.password),
        rol=rol,
        activo=True,
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Usuario:
    """Dependency para proteger endpoints: extrae el usuario autenticado desde el JWT."""
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesión expirada o token inválido.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token no contiene identidad de usuario.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    usuario = db.query(Usuario).filter(Usuario.id == int(user_id)).first()
    if not usuario or not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado o inactivo.",
        )
    return usuario


def build_usuario_public(usuario: Usuario) -> UsuarioPublic:
    """Construye el DTO público con el nombre del negocio incluido."""
    return UsuarioPublic(
        id=usuario.id,
        negocio_id=usuario.negocio_id,  # Puede ser None para SuperAdmin
        nombre=usuario.nombre,
        correo=usuario.correo,
        rol=usuario.rol,
        activo=usuario.activo,
        negocio_nombre=usuario.negocio.nombre if usuario.negocio else None
    )


def seed_superadmin(db: Session) -> None:
    """
    Crea el usuario SuperAdmin inicial si aún no existe en la BD.
    Credenciales iniciales: superadmin@easytool.com / 123
    Usa bcrypt exactamente igual que el resto de usuarios del sistema.
    """
    existing = db.query(Usuario).filter(Usuario.rol == "superadmin").first()
    if existing:
        return  # Ya existe, no crear duplicado

    superadmin = Usuario(
        negocio_id=None,                        # El SuperAdmin NO pertenece a ningún negocio
        nombre="Super Administrador",
        correo="superadmin@easytool.com",
        password_hash=hash_password("123"),     # Hash bcrypt real, igual que cualquier usuario
        rol="superadmin",
        activo=True,
    )
    db.add(superadmin)
    db.commit()
