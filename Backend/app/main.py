from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.database.session import engine, SessionLocal
from app.models import Base
from app.services.negocio_service import seed_initial_negocios
from app.services.auth_service import seed_superadmin
from app.routes.auth import router as auth_router
from app.routes.products import router as products_router
from app.routes.negocios import router as negocios_router
from app.routes.ventas import router as ventas_router
from app.routes.clientes import router as clientes_router
from app.routes.admin import router as admin_router
from app.routes.negocio_dueno import router as negocio_dueno_router
from app.routes.dashboard import router as dashboard_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Crear tablas si no existen (incluye las nuevas columnas nullable)
    Base.metadata.create_all(bind=engine)

    # 2. Sembrar datos iniciales
    db = SessionLocal()
    try:
        seed_initial_negocios(db)   # Negocios demo si la tabla está vacía
        seed_superadmin(db)         # SuperAdmin inicial (superadmin@easytool.com / 123)
    finally:
        db.close()

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API REST de EasyTool — Plataforma de Gestión de Ventas e Inventario",
    lifespan=lifespan,
)

# Configuración de CORS para permitir React Native (Web, Android, iOS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de routers con prefijo /api
app.include_router(negocios_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(ventas_router, prefix="/api")
app.include_router(clientes_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(negocio_dueno_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")


@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
