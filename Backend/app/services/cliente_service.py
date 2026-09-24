from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional, Tuple

from app.models.cliente import Cliente
from app.models.usuario import Usuario
from app.schemas.cliente import ClienteCreate, ClienteUpdate


def get_clientes(
    db: Session,
    user: Usuario,
    search: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
) -> Tuple[List[Cliente], int]:
    """Lista clientes activos del negocio del usuario autenticado."""
    query = db.query(Cliente).filter(
        Cliente.negocio_id == user.negocio_id,
        Cliente.activo == True,
    )
    if search and search.strip():
        term = f"%{search.strip()}%"
        from sqlalchemy import or_
        query = query.filter(
            or_(
                Cliente.nombre.ilike(term),
                Cliente.correo.ilike(term),
                Cliente.telefono.ilike(term),
            )
        )
    total = query.count()
    offset = (page - 1) * page_size
    items = query.order_by(Cliente.nombre.asc()).offset(offset).limit(page_size).all()
    return items, total


def get_cliente_by_id(db: Session, user: Usuario, cliente_id: int) -> Cliente:
    cliente = db.query(Cliente).filter(
        Cliente.id == cliente_id,
        Cliente.negocio_id == user.negocio_id,
    ).first()
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado o no pertenece a tu negocio.",
        )
    return cliente


def create_cliente(db: Session, user: Usuario, data: ClienteCreate) -> Cliente:
    cliente = Cliente(
        negocio_id=user.negocio_id,
        nombre=data.nombre.strip(),
        telefono=data.telefono.strip() if data.telefono else None,
        correo=data.correo.strip().lower() if data.correo else None,
        genero=data.genero,
        direccion=data.direccion,
        activo=True,
    )
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente


def update_cliente(db: Session, user: Usuario, cliente_id: int, data: ClienteUpdate) -> Cliente:
    cliente = get_cliente_by_id(db, user, cliente_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(cliente, field, value)
    db.commit()
    db.refresh(cliente)
    return cliente


def delete_cliente(db: Session, user: Usuario, cliente_id: int) -> None:
    cliente = get_cliente_by_id(db, user, cliente_id)
    cliente.activo = False
    db.commit()
