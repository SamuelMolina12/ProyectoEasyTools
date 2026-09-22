# 📑 Documentación de Avances y Estado del Proyecto: EasyTool

**Proyecto Oficial:** EasyTool — Plataforma Integral de Gestión y Análisis de Ventas e Inventario  
**Institución:** Tecnológico de Antioquia (TdeA) — Gestión de Proyectos Ágiles  
**Equipo:** Samuel Molina (Frontend & UI/UX) · Juan José Vega (Backend & Base de Datos)  
**Última actualización:** Septiembre 2026  

---

## 1. 🔍 Archivos y Documentación Verificados

1. **`Formulación de Proyecto _ Gestión de Proyectos Ágiles - TdeA-2.pdf`**:
   - **Objetivo:** Solución tecnológica para optimizar el control de ventas e inventario en pequeños y medianos comercios, eliminando el registro manual y ofreciendo análisis visual de desempeño en tiempo real.
   - **Metodología:** **Scrum** con ciclos iterativos de 2 semanas por Sprint.
   - **Roles definidos:** Samuel Molina (Frontend y Diseño) / Juan José Vega (Backend y Datos).
   - **Requisitos de Negocio:** Centralización en la nube, soporte multinegocio, acceso seguro y alta usabilidad.
2. **`proyecto.html`**:
   - Catálogo de requerimientos funcionales, no funcionales y desglose por épicas (Autenticación, Negocios, Productos, Ventas, Inventario, Reportes, Dashboard).
3. **`image.png`**:
   - Tablero visual Kanban / Trello con las historias de usuario priorizadas (MoSCoW) y organizadas en 5 Sprints.
4. **`historias_usuario_trello.md`**:
   - Criterios de aceptación detallados en formato Gherkin (*Dado que... Cuando... Entonces...*) para cada HU.

---

## 2. 🏛️ Arquitectura Global del Sistema

```text
       ┌─────────────────────────────────────────────────────────────┐
       │                FRONTEND (React Native + Expo)               │
       │  - UI Móvil & Web con NativeWind + React Navigation v7      │
       │  - Arquitectura Hexagonal: Dominio, Aplicación, Presentación│
       └──────────────────────────────┬──────────────────────────────┘
                                      │ HTTP / REST / JSON
                                      │ Auth: Bearer JWT
                                      ▼
       ┌─────────────────────────────────────────────────────────────┐
       │                   BACKEND (Python + FastAPI)                │
       │  - API REST Modular (Routers, Schemas Pydantic, Services)   │
       │  - Aislamiento Multitenancy por 'negocio_id'                │
       │  - Seguridad: Passwords con bcrypt / JWT Tokens             │
       └──────────────────────────────┬──────────────────────────────┘
                                      │ SQLAlchemy 2.0 ORM
                                      │ Alembic Migrations
                                      ▼
       ┌─────────────────────────────────────────────────────────────┐
       │               BASE DE DATOS (Microsoft SQL Server)          │
       │  - Instancia local (SQL Server 2022 / ODBC Driver 17)        │
       │  - Base de Datos: EasyToolDB                                │
       │  - Tablas: negocios, usuarios, productos, ventas, etc.      │
       └─────────────────────────────────────────────────────────────┘
```

---

## 3. 🏢 Modelo Multinegocio (Multitenancy)

La entidad raíz del ecosistema es **`negocios`**:
- Ningún usuario, producto, venta o inventario existe de manera aislada: **todo pertenece estrictamente a un `negocio_id`**.
- **Registro con Llave de Negocio:** Al registrarse, el usuario selecciona el negocio al que pertenece y debe ingresar la **contraseña/código de acceso del negocio**. El Backend valida la existencia del negocio, su estado activo y la coincidencia de su clave hasheada antes de afiliar al usuario.
- **Jerarquía de Roles (Preparada para evolución futura):**
  - **Administrador General:** Gestión de negocios en la plataforma.
  - **Administrador de Negocio / Propietario:** Administración completa del negocio, usuarios de su tienda, catálogo y reportes.
  - **Empleado:** Registro de ventas, consulta de catálogo y control operativo.

---

## 4. 🗄️ Esquema de Base de Datos (SQLAlchemy & SQL Server)

- **`negocios`**: `id`, `nombre`, `telefono`, `codigo_acceso_hash`, `actividad`, `direccion`, `dueno`, `correo`, `activo`, `fecha_creacion`, `fecha_actualizacion`.
- **`usuarios`**: `id`, `negocio_id` (FK), `nombre`, `correo` (UNIQUE), `password_hash`, `rol`, `activo`, `fecha_creacion`.
- **`productos`**: `id`, `negocio_id` (FK), `nombre`, `descripcion`, `categoria`, `precio`, `stock`, `stock_minimo`, `activo`, `fecha_creacion`.
- **`ventas`** *(Preparada)*: `id`, `negocio_id` (FK), `usuario_id` (FK), `total`, `estado`, `motivo_anulacion`, `fecha_venta`.
- **`detalles_venta`** *(Preparada)*: `id`, `venta_id` (FK), `producto_id` (FK), `cantidad`, `precio_unitario`, `subtotal`.
- **`movimientos_inventario`** *(Preparada)*: `id`, `negocio_id` (FK), `producto_id` (FK), `usuario_id` (FK), `tipo`, `cantidad`, `stock_anterior`, `stock_nuevo`, `fecha`.

---

## 5. 🛠️ Instrucciones de Base de Datos para Microsoft SQL Server

### Creación de la Base de Datos Vacía en SQL Server
Ejecutar en SQL Server Management Studio (SSMS) o consola `sqlcmd`:
```sql
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'EasyToolDB')
BEGIN
    CREATE DATABASE EasyToolDB;
END
GO
```

### Configuración del `.env` del Backend (`Backend/.env`)
```ini
DATABASE_URL="mssql+pyodbc://@localhost/EasyToolDB?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
SECRET_KEY="easytool-jwt-secret-key-development-2026"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=["*"]
```

---

## 6. 🚀 Estado de Avances por Componente

### Frontend (`Frontend/`)
- ✅ Proyecto estructurado con Arquitectura Hexagonal y TypeScript estricto.
- ✅ Pantallas desarrolladas: `LoginScreen`, `RegisterScreen`, `DashboardScreen`, `ProductListScreen`, `ProductFormScreen`.
- ✅ Configuración de Babel y soporte Web (`react-native-web` + `react-dom` + NativeWind v4).
- 🔄 **En curso en esta etapa:**
  - Ajuste de marca a **EasyTool** (eliminación de referencias a *VentasPro*).
  - Eliminación de pie de página de derechos reservados y sección de términos y condiciones.
  - Inclusión de selector de Negocio y campo de Contraseña de Negocio en el registro.
  - Reemplazo de mocks por cliente HTTP real hacia la API de FastAPI (`/api/auth`, `/api/products`, `/api/negocios`).

### Backend (`Backend/`)
- ✅ Entorno virtual Python 3.12 configurado con FastAPI, SQLAlchemy 2.0, pyodbc y Uvicorn.
- 🔄 **En curso en esta etapa:**
  - Configuración de modelos SQLAlchemy y migraciones Alembic.
  - Endpoints de autenticación (`/api/auth/login`, `/api/auth/register`, `/api/auth/me`).
  - Endpoints de productos (`/api/products`).
  - Endpoints de negocios (`/api/negocios`).
  - Seed inicial de negocio para pruebas inmediatas.
