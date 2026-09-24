"""
Ruta: /api/dashboard
Endpoint de estadísticas del dashboard para el negocio del usuario autenticado.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel

from app.database.session import get_db
from app.models.usuario import Usuario
from app.models.venta import Venta
from app.models.producto import Producto
from app.models.cliente import Cliente
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


class DashboardStats(BaseModel):
    ventas_hoy: float
    cantidad_ventas_hoy: int
    total_productos: int
    total_clientes: int
    productos_bajo_stock: int


@router.get("", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Retorna las estadísticas del dashboard para el negocio del usuario."""
    negocio_id = current_user.negocio_id

    # Inicio del día de hoy (UTC)
    now = datetime.now(timezone.utc)
    inicio_hoy = now.replace(hour=0, minute=0, second=0, microsecond=0)

    # Ventas de hoy
    ventas_hoy_query = db.query(
        func.coalesce(func.sum(Venta.total), 0).label("total"),
        func.count(Venta.id).label("cantidad"),
    ).filter(
        Venta.negocio_id == negocio_id,
        Venta.estado == "completada",
        Venta.fecha_venta >= inicio_hoy,
    ).first()

    ventas_hoy = float(ventas_hoy_query.total) if ventas_hoy_query else 0.0
    cantidad_ventas_hoy = int(ventas_hoy_query.cantidad) if ventas_hoy_query else 0

    # Total de productos activos
    total_productos = db.query(func.count(Producto.id)).filter(
        Producto.negocio_id == negocio_id,
        Producto.activo == True,
    ).scalar() or 0

    # Total de clientes
    total_clientes = db.query(func.count(Cliente.id)).filter(
        Cliente.negocio_id == negocio_id,
    ).scalar() or 0

    # Productos con stock bajo (menos de 5 unidades)
    productos_bajo_stock = db.query(func.count(Producto.id)).filter(
        Producto.negocio_id == negocio_id,
        Producto.activo == True,
        Producto.stock < 5,
    ).scalar() or 0

    return DashboardStats(
        ventas_hoy=ventas_hoy,
        cantidad_ventas_hoy=cantidad_ventas_hoy,
        total_productos=total_productos,
        total_clientes=total_clientes,
        productos_bajo_stock=productos_bajo_stock,
    )
