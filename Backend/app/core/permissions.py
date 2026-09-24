"""
core/permissions.py
Dependencies de FastAPI para verificar roles en los endpoints.
Uso:
    @router.get("/admin/negocios")
    def list_negocios(user = Depends(require_superadmin)):
        ...
    
    @router.post("/mi-negocio/ajustes")
    def update_negocio(user = Depends(require_dueno_o_superior)):
        ...
"""
from fastapi import Depends, HTTPException, status
from app.models.usuario import Usuario
from app.services.auth_service import get_current_user

ROLE_SUPERADMIN = "superadmin"
ROLE_DUENO = "dueno"
ROLE_EMPLEADO = "empleado"

# Jerarquía de roles (mayor índice = mayor nivel)
ROLE_HIERARCHY = {
    ROLE_EMPLEADO: 0,
    ROLE_DUENO: 1,
    ROLE_SUPERADMIN: 2,
}


def _check_role(user: Usuario, required_roles: list[str]) -> Usuario:
    if user.rol not in required_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"No tienes permiso para realizar esta acción. Rol requerido: {', '.join(required_roles)}.",
        )
    return user


def require_superadmin(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    """Solo permite acceso al SuperAdmin."""
    return _check_role(current_user, [ROLE_SUPERADMIN])


def require_dueno(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    """Solo permite acceso al Dueño del negocio."""
    return _check_role(current_user, [ROLE_DUENO])


def require_dueno_o_superior(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    """Permite acceso al Dueño o SuperAdmin."""
    return _check_role(current_user, [ROLE_DUENO, ROLE_SUPERADMIN])


def require_negocio_user(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    """Permite acceso a cualquier usuario de negocio (Dueño o Empleado) — NO SuperAdmin."""
    return _check_role(current_user, [ROLE_DUENO, ROLE_EMPLEADO])
