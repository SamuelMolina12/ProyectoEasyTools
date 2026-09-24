from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional, List
import math

from app.database.session import get_db
from app.models.usuario import Usuario
from app.schemas.cliente import ClienteCreate, ClienteUpdate, ClienteResponse
from app.services.auth_service import get_current_user
from app.services.cliente_service import (
    get_clientes, get_cliente_by_id, create_cliente, update_cliente, delete_cliente
)

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.get("", response_model=List[ClienteResponse])
def listar_clientes(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Lista clientes del negocio del usuario autenticado."""
    items, total = get_clientes(db, current_user, search=search, page=page, page_size=pageSize)
    return items


@router.post("", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
def crear_cliente(
    data: ClienteCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Crea un nuevo cliente en el negocio del usuario autenticado."""
    return create_cliente(db, current_user, data)


@router.get("/{cliente_id}", response_model=ClienteResponse)
def obtener_cliente(
    cliente_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Obtiene un cliente específico."""
    return get_cliente_by_id(db, current_user, cliente_id)


@router.put("/{cliente_id}", response_model=ClienteResponse)
def editar_cliente(
    cliente_id: int,
    data: ClienteUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Actualiza un cliente."""
    return update_cliente(db, current_user, cliente_id, data)


@router.delete("/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_cliente(
    cliente_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Desactiva un cliente (soft delete)."""
    delete_cliente(db, current_user, cliente_id)
    return None
