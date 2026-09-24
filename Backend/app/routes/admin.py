"""
routes/admin.py
Panel de administración exclusivo del SuperAdmin.
Gestión de negocios y usuarios desde la perspectiva global de la plataforma.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from app.database.session import get_db
from app.models.negocio import Negocio
from app.models.usuario import Usuario
from app.schemas.negocio import NegocioCreate, NegocioPublic
from app.services.negocio_service import create_negocio, get_negocio_by_id
from app.core.permissions import require_superadmin
from app.core.security import hash_password


# ─── Schemas locales para respuestas enriquecidas ───────────────────────────

class NegocioDetalle(BaseModel):
    id: int
    nombre: str
    telefono: Optional[str] = None
    actividad: Optional[str] = None
    direccion: Optional[str] = None
    dueno: Optional[str] = None
    correo: Optional[str] = None
    activo: bool
    fecha_creacion: datetime
    total_usuarios: int = 0

    model_config = ConfigDict(from_attributes=True)


class NegocioUpdate(BaseModel):
    nombre: Optional[str] = None
    telefono: Optional[str] = None
    actividad: Optional[str] = None
    direccion: Optional[str] = None
    dueno: Optional[str] = None
    correo: Optional[str] = None
    activo: Optional[bool] = None
    codigo_acceso: Optional[str] = None  # Permite cambiar la clave del negocio


class UsuarioAdminResponse(BaseModel):
    id: int
    negocio_id: Optional[int] = None
    nombre: str
    correo: str
    rol: str
    activo: bool
    fecha_creacion: datetime
    negocio_nombre: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class UsuarioAdminUpdate(BaseModel):
    nombre: Optional[str] = None
    rol: Optional[str] = None
    activo: Optional[bool] = None


# ─── Router ─────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/admin", tags=["SuperAdmin"])


# === NEGOCIOS ===

@router.get("/negocios", response_model=List[NegocioDetalle])
def listar_todos_negocios(
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(require_superadmin),
):
    """Lista TODOS los negocios de la plataforma (activos e inactivos)."""
    negocios = db.query(Negocio).order_by(Negocio.nombre).all()
    result = []
    for n in negocios:
        total_usuarios = db.query(Usuario).filter(
            Usuario.negocio_id == n.id,
            Usuario.activo == True,
        ).count()
        result.append(NegocioDetalle(
            id=n.id,
            nombre=n.nombre,
            telefono=n.telefono,
            actividad=n.actividad,
            direccion=n.direccion,
            dueno=n.dueno,
            correo=n.correo,
            activo=n.activo,
            fecha_creacion=n.fecha_creacion,
            total_usuarios=total_usuarios,
        ))
    return result


@router.post("/negocios", response_model=NegocioPublic, status_code=status.HTTP_201_CREATED)
def crear_negocio_admin(
    data: NegocioCreate,
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(require_superadmin),
):
    """Crea un nuevo negocio en la plataforma. Solo SuperAdmin."""
    return create_negocio(db, data)


@router.get("/negocios/{negocio_id}", response_model=NegocioDetalle)
def obtener_negocio(
    negocio_id: int,
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(require_superadmin),
):
    """Obtiene detalle de un negocio."""
    negocio = get_negocio_by_id(db, negocio_id)
    if not negocio:
        raise HTTPException(status_code=404, detail="Negocio no encontrado.")
    total_usuarios = db.query(Usuario).filter(
        Usuario.negocio_id == negocio.id,
        Usuario.activo == True,
    ).count()
    return NegocioDetalle(
        id=negocio.id,
        nombre=negocio.nombre,
        telefono=negocio.telefono,
        actividad=negocio.actividad,
        direccion=negocio.direccion,
        dueno=negocio.dueno,
        correo=negocio.correo,
        activo=negocio.activo,
        fecha_creacion=negocio.fecha_creacion,
        total_usuarios=total_usuarios,
    )


@router.put("/negocios/{negocio_id}", response_model=NegocioPublic)
def actualizar_negocio(
    negocio_id: int,
    data: NegocioUpdate,
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(require_superadmin),
):
    """Actualiza información de un negocio. Solo SuperAdmin."""
    negocio = get_negocio_by_id(db, negocio_id)
    if not negocio:
        raise HTTPException(status_code=404, detail="Negocio no encontrado.")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "codigo_acceso":
            negocio.codigo_acceso_hash = hash_password(value)
        elif hasattr(negocio, field):
            setattr(negocio, field, value)

    db.commit()
    db.refresh(negocio)
    return negocio


@router.patch("/negocios/{negocio_id}/toggle", response_model=NegocioPublic)
def toggle_negocio_activo(
    negocio_id: int,
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(require_superadmin),
):
    """Activa o desactiva un negocio."""
    negocio = get_negocio_by_id(db, negocio_id)
    if not negocio:
        raise HTTPException(status_code=404, detail="Negocio no encontrado.")
    negocio.activo = not negocio.activo
    db.commit()
    db.refresh(negocio)
    return negocio


# === USUARIOS (desde perspectiva SuperAdmin) ===

@router.get("/negocios/{negocio_id}/usuarios", response_model=List[UsuarioAdminResponse])
def listar_usuarios_negocio(
    negocio_id: int,
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(require_superadmin),
):
    """Lista todos los usuarios de un negocio específico."""
    negocio = get_negocio_by_id(db, negocio_id)
    if not negocio:
        raise HTTPException(status_code=404, detail="Negocio no encontrado.")
    usuarios = db.query(Usuario).filter(Usuario.negocio_id == negocio_id).all()
    return [
        UsuarioAdminResponse(
            id=u.id,
            negocio_id=u.negocio_id,
            nombre=u.nombre,
            correo=u.correo,
            rol=u.rol,
            activo=u.activo,
            fecha_creacion=u.fecha_creacion,
            negocio_nombre=negocio.nombre,
        )
        for u in usuarios
    ]


@router.put("/usuarios/{usuario_id}", response_model=UsuarioAdminResponse)
def actualizar_usuario_admin(
    usuario_id: int,
    data: UsuarioAdminUpdate,
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(require_superadmin),
):
    """Modifica nombre, rol o estado activo de cualquier usuario. Solo SuperAdmin."""
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    # No permitir modificar otro SuperAdmin
    if usuario.rol == "superadmin":
        raise HTTPException(
            status_code=403,
            detail="No se puede modificar la cuenta SuperAdmin desde este endpoint.",
        )
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(usuario, field, value)
    db.commit()
    db.refresh(usuario)
    return UsuarioAdminResponse(
        id=usuario.id,
        negocio_id=usuario.negocio_id,
        nombre=usuario.nombre,
        correo=usuario.correo,
        rol=usuario.rol,
        activo=usuario.activo,
        fecha_creacion=usuario.fecha_creacion,
        negocio_nombre=usuario.negocio.nombre if usuario.negocio else None,
    )
