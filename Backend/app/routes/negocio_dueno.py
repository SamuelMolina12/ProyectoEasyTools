"""
routes/negocio_dueno.py
Endpoints para que el Dueño gestione su propio negocio y los empleados de su negocio.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from app.database.session import get_db
from app.models.usuario import Usuario
from app.models.negocio import Negocio
from app.core.permissions import require_dueno_o_superior
from app.core.security import hash_password

router = APIRouter(prefix="/mi-negocio", tags=["Mi Negocio (Dueño)"])


# ─── Schemas ────────────────────────────────────────────────────────────────

class NegocioPropio(BaseModel):
    id: int
    nombre: str
    telefono: Optional[str] = None
    actividad: Optional[str] = None
    direccion: Optional[str] = None
    dueno: Optional[str] = None
    correo: Optional[str] = None
    activo: bool
    fecha_creacion: datetime
    model_config = ConfigDict(from_attributes=True)


class NegocioPropioUpdate(BaseModel):
    nombre: Optional[str] = None
    telefono: Optional[str] = None
    actividad: Optional[str] = None
    direccion: Optional[str] = None
    correo: Optional[str] = None
    codigo_acceso: Optional[str] = None   # Permite cambiar la clave de acceso del negocio


class EmpleadoResponse(BaseModel):
    id: int
    nombre: str
    correo: str
    rol: str
    activo: bool
    fecha_creacion: datetime
    model_config = ConfigDict(from_attributes=True)


class EmpleadoUpdate(BaseModel):
    nombre: Optional[str] = None
    activo: Optional[bool] = None
    rol: Optional[str] = None   # Solo puede cambiar entre 'dueno' y 'empleado'


# ─── Endpoints ──────────────────────────────────────────────────────────────

@router.get("", response_model=NegocioPropio)
def obtener_mi_negocio(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_dueno_o_superior),
):
    """Obtiene la información del negocio del Dueño autenticado."""
    negocio = db.query(Negocio).filter(Negocio.id == current_user.negocio_id).first()
    if not negocio:
        raise HTTPException(status_code=404, detail="Negocio no encontrado.")
    return negocio


@router.put("", response_model=NegocioPropio)
def actualizar_mi_negocio(
    data: NegocioPropioUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_dueno_o_superior),
):
    """El Dueño actualiza la información de su propio negocio."""
    negocio = db.query(Negocio).filter(Negocio.id == current_user.negocio_id).first()
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


@router.get("/empleados", response_model=List[EmpleadoResponse])
def listar_empleados(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_dueno_o_superior),
):
    """Lista todos los usuarios del negocio del Dueño (incluyendo inactivos)."""
    empleados = db.query(Usuario).filter(
        Usuario.negocio_id == current_user.negocio_id,
        Usuario.id != current_user.id,   # Excluir al propio Dueño de la lista
    ).order_by(Usuario.nombre).all()
    return empleados


@router.put("/empleados/{empleado_id}", response_model=EmpleadoResponse)
def actualizar_empleado(
    empleado_id: int,
    data: EmpleadoUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_dueno_o_superior),
):
    """El Dueño actualiza nombre, estado activo o rol de un empleado de su negocio."""
    empleado = db.query(Usuario).filter(
        Usuario.id == empleado_id,
        Usuario.negocio_id == current_user.negocio_id,
    ).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado en tu negocio.")
    if empleado.rol == "superadmin":
        raise HTTPException(status_code=403, detail="No puedes modificar una cuenta SuperAdmin.")

    # Validar que el rol asignado sea válido (solo dueno o empleado)
    update_data = data.model_dump(exclude_unset=True)
    if "rol" in update_data and update_data["rol"] not in ("dueno", "empleado"):
        raise HTTPException(status_code=400, detail="Rol inválido. Solo puede ser 'dueno' o 'empleado'.")

    for field, value in update_data.items():
        setattr(empleado, field, value)

    db.commit()
    db.refresh(empleado)
    return empleado
