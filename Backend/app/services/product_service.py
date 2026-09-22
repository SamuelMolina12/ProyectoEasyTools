from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from typing import Optional, Tuple, List
from app.models.producto import Producto
from app.models.usuario import Usuario
from app.schemas.producto import ProductoCreate, ProductoUpdate

def get_products(
    db: Session,
    user: Usuario,
    search: Optional[str] = None,
    category: Optional[str] = None,
    page: int = 1,
    page_size: int = 10,
) -> Tuple[List[Producto], int]:
    """
    Obtiene los productos filtrados estrictamente por el negocio del usuario autenticado.
    Soporta búsqueda por nombre/descripción, filtro de categoría y paginación.
    """
    query = db.query(Producto).filter(
        Producto.negocio_id == user.negocio_id,
        Producto.activo == True
    )

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Producto.nombre.ilike(term),
                Producto.descripcion.ilike(term)
            )
        )

    if category and category.strip() and category.lower() != "all":
        query = query.filter(Producto.categoria == category.strip().lower())

    total = query.count()
    offset = (page - 1) * page_size
    items = query.order_by(Producto.nombre.asc()).offset(offset).limit(page_size).all()

    return items, total

def get_product_by_id(db: Session, user: Usuario, product_id: int) -> Producto:
    """Obtiene un producto asegurando que pertenezca al negocio del usuario."""
    product = db.query(Producto).filter(
        Producto.id == product_id,
        Producto.negocio_id == user.negocio_id,
        Producto.activo == True
    ).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado o no pertenece a tu negocio."
        )
    return product

def create_product(db: Session, user: Usuario, data: ProductoCreate) -> Producto:
    """Registra un nuevo producto asociado al negocio del usuario."""
    # Verificar si ya existe un producto con el mismo nombre en este negocio
    existing = db.query(Producto).filter(
        Producto.negocio_id == user.negocio_id,
        Producto.nombre == data.nombre.strip(),
        Producto.activo == True
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un producto con este nombre en tu negocio."
        )

    producto = Producto(
        negocio_id=user.negocio_id,
        nombre=data.nombre.strip(),
        descripcion=data.descripcion.strip() if data.descripcion else None,
        categoria=data.categoria.strip().lower(),
        precio=data.precio,
        stock=data.stock,
        stock_minimo=data.stock_minimo,
        activo=True,
    )
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto

def update_product(db: Session, user: Usuario, product_id: int, data: ProductoUpdate) -> Producto:
    """Actualiza un producto del negocio del usuario."""
    product = get_product_by_id(db, user, product_id)
    update_data = data.model_dump(exclude_unset=True)

    if "nombre" in update_data and update_data["nombre"]:
        # Validar nombre único en este negocio
        existing = db.query(Producto).filter(
            Producto.negocio_id == user.negocio_id,
            Producto.nombre == update_data["nombre"].strip(),
            Producto.id != product_id,
            Producto.activo == True
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe otro producto con este nombre en tu negocio."
            )
        product.nombre = update_data["nombre"].strip()

    if "descripcion" in update_data:
        product.descripcion = update_data["descripcion"]
    if "categoria" in update_data and update_data["categoria"]:
        product.categoria = update_data["categoria"].strip().lower()
    if "precio" in update_data and update_data["precio"] is not None:
        product.precio = update_data["precio"]
    if "stock" in update_data and update_data["stock"] is not None:
        product.stock = update_data["stock"]
    if "stock_minimo" in update_data and update_data["stock_minimo"] is not None:
        product.stock_minimo = update_data["stock_minimo"]
    if "activo" in update_data and update_data["activo"] is not None:
        product.activo = update_data["activo"]

    db.commit()
    db.refresh(product)
    return product

def delete_product(db: Session, user: Usuario, product_id: int) -> None:
    """Desactiva un producto (soft delete para conservar trazabilidad histórica)."""
    product = get_product_by_id(db, user, product_id)
    product.activo = False
    db.commit()
