from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional, Tuple
from decimal import Decimal

from app.models.venta import Venta, DetalleVenta, MovimientoInventario
from app.models.producto import Producto
from app.models.usuario import Usuario
from app.schemas.venta import VentaCreate


def create_venta(db: Session, user: Usuario, data: VentaCreate) -> Venta:
    """
    Registra una nueva venta de forma transaccional:
    1. Valida que haya al menos un detalle.
    2. Valida que cada producto pertenezca al negocio del usuario.
    3. Valida que las cantidades sean > 0.
    4. Valida que haya stock suficiente para TODOS los productos ANTES de descontar.
    5. Descuenta stock y crea movimientos de inventario.
    6. Crea la Venta y sus DetalleVenta.
    Si algo falla, la transacción se revierte automáticamente (no se descuenta stock parcial).
    """

    if not data.detalles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La venta debe incluir al menos un producto.",
        )

    # --- PASO 1: Validar todos los productos y stock ANTES de modificar nada ---
    productos_validados: List[tuple[Producto, int]] = []
    ids_vistos = set()

    for detalle in data.detalles:
        if detalle.cantidad <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"La cantidad del producto {detalle.producto_id} debe ser mayor a 0.",
            )

        if detalle.producto_id in ids_vistos:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El producto {detalle.producto_id} está duplicado en la venta.",
            )
        ids_vistos.add(detalle.producto_id)

        producto = db.query(Producto).filter(
            Producto.id == detalle.producto_id,
            Producto.negocio_id == user.negocio_id,
            Producto.activo == True,
        ).first()

        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Producto con ID {detalle.producto_id} no encontrado o no pertenece a tu negocio.",
            )

        if producto.stock < detalle.cantidad:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Stock insuficiente para '{producto.nombre}'. "
                    f"Disponible: {producto.stock}, solicitado: {detalle.cantidad}."
                ),
            )

        productos_validados.append((producto, detalle.cantidad))

    # --- PASO 2: Calcular total ---
    total = Decimal("0.00")
    for producto, cantidad in productos_validados:
        precio = Decimal(str(producto.precio))
        total += precio * cantidad

    # --- PASO 3: Crear la venta ---
    venta = Venta(
        negocio_id=user.negocio_id,
        usuario_id=user.id,
        cliente_id=data.cliente_id,
        total=total,
        estado="completada",
    )
    db.add(venta)
    db.flush()  # Obtener venta.id sin hacer commit todavía

    # --- PASO 4: Crear detalles y descontar stock ---
    for idx, (producto, cantidad) in enumerate(productos_validados):
        precio_unitario = Decimal(str(producto.precio))
        subtotal = precio_unitario * cantidad

        detalle_obj = DetalleVenta(
            venta_id=venta.id,
            producto_id=producto.id,
            cantidad=cantidad,
            precio_unitario=precio_unitario,
            subtotal=subtotal,
        )
        db.add(detalle_obj)

        # Movimiento de inventario
        stock_anterior = producto.stock
        stock_nuevo = producto.stock - cantidad

        movimiento = MovimientoInventario(
            negocio_id=user.negocio_id,
            producto_id=producto.id,
            usuario_id=user.id,
            tipo="salida_venta",
            cantidad=cantidad,
            stock_anterior=stock_anterior,
            stock_nuevo=stock_nuevo,
            motivo=f"Venta #{venta.id}",
        )
        db.add(movimiento)

        # Actualizar stock
        producto.stock = stock_nuevo

    # --- PASO 5: Commit único — si algo falla aquí, todo se revierte ---
    try:
        db.commit()
        db.refresh(venta)
        # Cargar detalles con nombre del producto para la respuesta
        db.refresh(venta)
        return venta
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar la venta. No se descontó stock. Detalle: {str(e)}",
        )


def get_ventas(
    db: Session,
    user: Usuario,
    page: int = 1,
    page_size: int = 20,
) -> Tuple[List[Venta], int]:
    """Retorna el historial de ventas del negocio del usuario autenticado."""
    query = db.query(Venta).filter(
        Venta.negocio_id == user.negocio_id
    ).order_by(Venta.fecha_venta.desc())

    total = query.count()
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()
    return items, total


def get_venta_by_id(db: Session, user: Usuario, venta_id: int) -> Venta:
    """Obtiene una venta específica asegurando que pertenezca al negocio del usuario."""
    venta = db.query(Venta).filter(
        Venta.id == venta_id,
        Venta.negocio_id == user.negocio_id,
    ).first()
    if not venta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venta no encontrada o no pertenece a tu negocio.",
        )
    return venta
