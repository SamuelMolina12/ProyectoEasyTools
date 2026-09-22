from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.negocio import Negocio
from app.schemas.negocio import NegocioCreate
from app.core.security import hash_password, verify_password

def get_active_negocios(db: Session) -> List[Negocio]:
    """Obtiene la lista de todos los negocios activos (para el desplegable de registro)."""
    return db.query(Negocio).filter(Negocio.activo == True).order_by(Negocio.nombre).all()

def get_negocio_by_id(db: Session, negocio_id: int) -> Optional[Negocio]:
    return db.query(Negocio).filter(Negocio.id == negocio_id).first()

def create_negocio(db: Session, data: NegocioCreate) -> Negocio:
    """Crea un nuevo negocio con su clave de acceso hasheada."""
    negocio = Negocio(
        nombre=data.nombre,
        telefono=data.telefono,
        codigo_acceso_hash=hash_password(data.codigo_acceso),
        actividad=data.actividad,
        direccion=data.direccion,
        dueno=data.dueno,
        correo=data.correo,
        activo=True,
    )
    db.add(negocio)
    db.commit()
    db.refresh(negocio)
    return negocio

def verify_codigo_negocio(negocio: Negocio, codigo: str) -> bool:
    """Verifica si el código/contraseña del negocio coincide con el hash."""
    return verify_password(codigo, negocio.codigo_acceso_hash)

def seed_initial_negocios(db: Session) -> None:
    """Crea negocios iniciales si la tabla está vacía."""
    count = db.query(Negocio).count()
    if count == 0:
        # Negocio 1 de demostración
        demo1 = Negocio(
            nombre="Tienda El Sol",
            telefono="3001234567",
            codigo_acceso_hash=hash_password("123456"),
            actividad="Tienda de Abarrotes y Víveres",
            direccion="Calle 45 # 12-34",
            dueno="Samuel Molina",
            correo="elsol@easytool.com",
            activo=True,
        )
        # Negocio 2
        demo2 = Negocio(
            nombre="Minimarket La Esquina",
            telefono="3119876543",
            codigo_acceso_hash=hash_password("admin123"),
            actividad="Minimarket y Granero",
            direccion="Carrera 20 # 50-10",
            dueno="Juan José Vega",
            correo="laesquina@easytool.com",
            activo=True,
        )
        db.add(demo1)
        db.add(demo2)
        db.commit()
