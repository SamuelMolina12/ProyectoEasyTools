from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional
import math
from app.database.session import get_db
from app.models.usuario import Usuario
from app.schemas.producto import (
    ProductoCreate,
    ProductoUpdate,
    ProductoResponse,
    ProductoListResponse,
)
from app.services.auth_service import get_current_user
from app.services.product_service import (
    get_products,
    get_product_by_id,
    create_product,
    update_product,
    delete_product,
)

router = APIRouter(prefix="/products", tags=["Productos"])

@router.get("", response_model=ProductoListResponse)
def list_products(
    search: Optional[str] = Query(None, description="Búsqueda por nombre o descripción"),
    category: Optional[str] = Query(None, description="Filtrar por categoría"),
    page: int = Query(1, ge=1, description="Número de página"),
    pageSize: int = Query(10, ge=1, le=100, description="Tamaño de página"),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """
    Retorna el catálogo de productos del negocio del usuario autenticado.
    Soporta búsqueda en tiempo real, filtro por categoría y paginación.
    """
    items, total = get_products(
        db=db,
        user=current_user,
        search=search,
        category=category,
        page=page,
        page_size=pageSize,
    )
    total_pages = math.ceil(total / pageSize) if total > 0 else 1
    return ProductoListResponse(
        items=items,
        total=total,
        page=page,
        pageSize=pageSize,
        totalPages=total_pages,
    )

@router.post("", response_model=ProductoResponse, status_code=status.HTTP_201_CREATED)
def add_product(
    data: ProductoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Registra un nuevo producto en el negocio del usuario autenticado."""
    return create_product(db, current_user, data)

@router.get("/{product_id}", response_model=ProductoResponse)
def get_single_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Obtiene el detalle de un producto específico."""
    return get_product_by_id(db, current_user, product_id)

@router.put("/{product_id}", response_model=ProductoResponse)
def edit_product(
    product_id: int,
    data: ProductoUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Edita la información de un producto."""
    return update_product(db, current_user, product_id, data)

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Desactiva un producto del catálogo (soft delete)."""
    delete_product(db, current_user, product_id)
    return None
