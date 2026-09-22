from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.schemas.negocio import NegocioPublic, NegocioCreate
from app.services.negocio_service import get_active_negocios, create_negocio

router = APIRouter(prefix="/negocios", tags=["Negocios"])

@router.get("", response_model=List[NegocioPublic])
def list_negocios(db: Session = Depends(get_db)):
    """Retorna los negocios activos disponibles para selección en registro."""
    return get_active_negocios(db)

@router.post("", response_model=NegocioPublic, status_code=status.HTTP_201_CREATED)
def register_negocio(data: NegocioCreate, db: Session = Depends(get_db)):
    """Registra un nuevo negocio con su clave de acceso para afiliados."""
    return create_negocio(db, data)
