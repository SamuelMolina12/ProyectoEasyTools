"""
Test de Integración Completo para EasyTool Sprint 1
Verifica todos los endpoints, schemas, lógica de negocio y base de datos.
"""

import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.models import Base, Negocio, Usuario, Producto, Cliente, Venta, DetalleVenta, MovimientoInventario
from app.database.session import get_db
from app.core.security import hash_password
from app.main import app

# Configuración de base de datos SQLite en memoria para tests aislados
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear todas las tablas en memoria
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def run_tests():
    print("==================================================")
    print("  INICIANDO TEST DE INTEGRACIÓN EASYTOOL SPRINT 1")
    print("==================================================")

    # 1. Verificar tablas creadas
    table_names = list(Base.metadata.tables.keys())
    print("\n1. Verificando tablas registradas en Base.metadata:")
    for t in table_names:
        print(f"   [OK] Tabla: {t}")
    assert "clientes" in table_names, "Falta la tabla clientes"
    assert "ventas" in table_names, "Falta la tabla ventas"
    assert "productos" in table_names, "Falta la tabla productos"
    assert "negocios" in table_names, "Falta la tabla negocios"
    assert "usuarios" in table_names, "Falta la tabla usuarios"

    # Sembrar negocio de prueba en la BD
    db = TestingSessionLocal()
    test_negocio = Negocio(
        nombre="Ferretería El Progreso",
        actividad="Ferretería y Construcción",
        codigo_acceso_hash=hash_password("clave123"),
        dueno="Carlos Restrepo",
        direccion="Calle 45 # 12-34, Medellín",
        telefono="3001234567",
        correo="ferreteria@ejemplo.com",
        activo=True,
    )
    db.add(test_negocio)
    db.commit()
    db.refresh(test_negocio)
    negocio_id = test_negocio.id
    db.close()
    print(f"\n2. Negocio de prueba creado: ID={negocio_id}, Nombre='{test_negocio.nombre}'")

    # 3. Test GET /api/negocios
    res_negocios = client.get("/api/negocios")
    assert res_negocios.status_code == 200, f"Error en GET /api/negocios: {res_negocios.text}"
    negocios_list = res_negocios.json()
    assert len(negocios_list) >= 1, "No se retornaron negocios"
    print(f"\n3. GET /api/negocios: OK ({len(negocios_list)} negocio(s) retornado(s))")

    # 4. Test POST /api/auth/register (fallo con clave incorrecta)
    bad_reg_data = {
        "nombre": "Samuel Molina",
        "correo": "samuel@easytool.com",
        "password": "Password123!",
        "negocio_id": negocio_id,
        "codigo_negocio": "clave_erronea",
    }
    res_bad_reg = client.post("/api/auth/register", json=bad_reg_data)
    assert res_bad_reg.status_code == 401, f"Debería fallar con 401: {res_bad_reg.status_code} {res_bad_reg.text}"
    print("\n4. POST /api/auth/register con clave errónea: Rechazado correctamente (401)")

    # 5. Test POST /api/auth/register (éxito)
    good_reg_data = {
        "nombre": "Samuel Molina",
        "correo": "samuel@easytool.com",
        "password": "Password123!",
        "negocio_id": negocio_id,
        "codigo_negocio": "clave123",
    }
    res_reg = client.post("/api/auth/register", json=good_reg_data)
    assert res_reg.status_code == 201, f"Fallo al registrar usuario: {res_reg.text}"
    reg_json = res_reg.json()
    assert "access_token" in reg_json
    token = reg_json["access_token"]
    user_data = reg_json["user"]
    assert user_data["nombre"] == "Samuel Molina"
    assert user_data["negocio_id"] == negocio_id
    print(f"\n5. POST /api/auth/register: OK (Usuario ID={user_data['id']}, Token generado)")

    # 6. Test POST /api/auth/login
    login_data = {
        "correo": "samuel@easytool.com",
        "password": "Password123!",
    }
    res_login = client.post("/api/auth/login", json=login_data)
    assert res_login.status_code == 200, f"Fallo en login: {res_login.text}"
    login_json = res_login.json()
    auth_token = login_json["access_token"]
    print("\n6. POST /api/auth/login: OK (Login exitoso, nuevo token recibido)")

    headers = {"Authorization": f"Bearer {auth_token}"}

    # 7. Test GET /api/auth/me
    res_me = client.get("/api/auth/me", headers=headers)
    assert res_me.status_code == 200, f"Fallo en /api/auth/me: {res_me.text}"
    me_json = res_me.json()
    assert me_json["correo"] == "samuel@easytool.com"
    print(f"\n7. GET /api/auth/me: OK (Perfil recuperado para '{me_json['nombre']}', Negocio='{me_json.get('negocio_nombre')}')")

    # 8. Test POST /api/products (Crear producto)
    prod_data = {
        "nombre": "Taladro Percutor 650W",
        "descripcion": "Taladro percutor profesional con velocidad variable",
        "categoria": "electrónica",
        "precio": 185000.0,
        "stock": 15,
        "stock_minimo": 3,
    }
    res_prod = client.post("/api/products", json=prod_data, headers=headers)
    assert res_prod.status_code == 201, f"Fallo al crear producto: {res_prod.text}"
    prod_json = res_prod.json()
    prod_id = prod_json["id"]
    assert prod_json["nombre"] == "Taladro Percutor 650W"
    print(f"\n8. POST /api/products: OK (Producto ID={prod_id}, Precio={prod_json['precio']})")

    # 9. Test GET /api/products (Listar catálogo con paginación y búsqueda)
    res_list = client.get("/api/products?page=1&pageSize=10&search=Taladro", headers=headers)
    assert res_list.status_code == 200
    list_json = res_list.json()
    assert list_json["total"] >= 1
    assert len(list_json["items"]) >= 1
    print(f"\n9. GET /api/products con búsqueda: OK (Encontrados {list_json['total']} producto(s))")

    # 10. Test GET /api/products/{id}
    res_single = client.get(f"/api/products/{prod_id}", headers=headers)
    assert res_single.status_code == 200
    assert res_single.json()["id"] == prod_id
    print(f"\n10. GET /api/products/{prod_id}: OK")

    # 11. Test PUT /api/products/{id} (Actualizar stock y precio)
    update_data = {
        "precio": 195000.0,
        "stock": 20,
    }
    res_update = client.put(f"/api/products/{prod_id}", json=update_data, headers=headers)
    assert res_update.status_code == 200
    updated_json = res_update.json()
    assert float(updated_json["precio"]) == 195000.0
    assert updated_json["stock"] == 20
    print(f"\n11. PUT /api/products/{prod_id}: OK (Precio actualizado a {updated_json['precio']}, Stock={updated_json['stock']})")

    # 12. Test DELETE /api/products/{id} (Soft delete)
    res_del = client.delete(f"/api/products/{prod_id}", headers=headers)
    assert res_del.status_code == 204
    print(f"\n12. DELETE /api/products/{prod_id}: OK (Soft-delete 204 No Content)")

    # 13. Verificar modelo Cliente en DB directamente
    db = TestingSessionLocal()
    cliente_test = Cliente(
        nombre="Juan Pérez",
        telefono="3119876543",
        correo="juan.perez@cliente.com",
        genero="M",
        negocio_id=negocio_id,
        activo=True,
    )
    db.add(cliente_test)
    db.commit()
    db.refresh(cliente_test)
    assert cliente_test.id is not None
    print(f"\n13. Inserción directa en tabla 'clientes': OK (ID={cliente_test.id}, Nombre='{cliente_test.nombre}', FK negocio_id={cliente_test.negocio_id})")

    # 14. Verificar relación Venta con cliente_id nullable
    venta_test = Venta(
        negocio_id=negocio_id,
        usuario_id=user_data["id"],
        cliente_id=cliente_test.id,
        total=195000.0,
        estado="completada",
    )
    db.add(venta_test)
    db.commit()
    db.refresh(venta_test)
    assert venta_test.id is not None
    assert venta_test.cliente_id == cliente_test.id
    print(f"\n14. Inserción de Venta con cliente_id: OK (ID={venta_test.id}, cliente_id={venta_test.cliente_id})")
    db.close()

    print("\n==================================================")
    print("  ¡TODAS LAS PRUEBAS (14/14) PASARON CON ÉXITO!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
