from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional
import math

from app.database.session import get_db
from app.models.usuario import Usuario
from app.schemas.venta import VentaCreate, VentaResponse, VentaListResponse, DetalleVentaResponse
from app.services.auth_service import get_current_user
from app.services.venta_service import create_venta, get_ventas, get_venta_by_id

router = APIRouter(prefix="/ventas", tags=["Ventas"])


def _build_venta_response(venta) -> VentaResponse:
    """Construye el response con el nombre del producto en cada detalle."""
    detalles = []
    for d in venta.detalles:
        detalles.append(DetalleVentaResponse(
            id=d.id,
            producto_id=d.producto_id,
            producto_nombre=d.producto.nombre if d.producto else None,
            cantidad=d.cantidad,
            precio_unitario=d.precio_unitario,
            subtotal=d.subtotal,
        ))
    return VentaResponse(
        id=venta.id,
        negocio_id=venta.negocio_id,
        usuario_id=venta.usuario_id,
        cliente_id=venta.cliente_id,
        total=venta.total,
        estado=venta.estado,
        fecha_venta=venta.fecha_venta,
        detalles=detalles,
    )


@router.post("", response_model=VentaResponse, status_code=status.HTTP_201_CREATED)
def registrar_venta(
    data: VentaCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """
    Registra una nueva venta.
    - Valida stock suficiente para todos los productos antes de descontar.
    - Descuenta stock y crea movimientos de inventario.
    - Retorna la venta registrada con sus detalles.
    """
    venta = create_venta(db, current_user, data)
    return _build_venta_response(venta)


@router.get("", response_model=VentaListResponse)
def listar_ventas(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Retorna el historial de ventas del negocio del usuario autenticado."""
    items, total = get_ventas(db, current_user, page=page, page_size=pageSize)
    total_pages = math.ceil(total / pageSize) if total > 0 else 1
    return VentaListResponse(
        items=[_build_venta_response(v) for v in items],
        total=total,
        page=page,
        pageSize=pageSize,
        totalPages=total_pages,
    )


@router.get("/{venta_id}", response_model=VentaResponse)
def detalle_venta(
    venta_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Obtiene el detalle de una venta específica."""
    venta = get_venta_by_id(db, current_user, venta_id)
    return _build_venta_response(venta)
