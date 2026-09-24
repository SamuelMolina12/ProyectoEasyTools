# 📑 Documentación de Avances y Estado del Proyecto: EasyTool

**Proyecto Oficial:** EasyTool — Plataforma Integral de Gestión y Análisis de Ventas e Inventario  
**Institución:** Tecnológico de Antioquia (TdeA) — Gestión de Proyectos Ágiles  
**Equipo:** Samuel Molina (Frontend & UI/UX) · Juan José Vega (Backend & Base de Datos)  
**Última actualización:** Septiembre 2026 (Sprint 1 Completado e Integrado)  

---

## 1. 🔍 Archivos y Documentación Verificados

1. **`Formulación de Proyecto _ Gestión de Proyectos Ágiles - TdeA-2.pdf`**:
   - **Objetivo:** Solución tecnológica para optimizar el control de ventas e inventario en pequeños y medianos comercios, eliminando el registro manual y ofreciendo análisis visual de desempeño en tiempo real.
   - **Metodología:** **Scrum** con ciclos iterativos de 2 semanas por Sprint.
   - **Roles definidos:** Samuel Molina (Frontend y Diseño) / Juan José Vega (Backend y Datos).
   - **Requisitos de Negocio:** Centralización en la nube, soporte multinegocio, acceso seguro y alta usabilidad.
2. **`proyecto.html`**:
   - Catálogo de requerimientos funcionales, no funcionales y desglose por épicas (Autenticación, Negocios, Productos, Clientes, Ventas, Inventario, Reportes, Dashboard).
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
       │  - AuthContext Global con persistencia en AsyncStorage      │
       │  - Consumo HTTP Real vía apiClient (FastAPI REST)           │
       └──────────────────────────────┬──────────────────────────────┘
                                      │ HTTP / REST / JSON
                                      │ Auth: Bearer JWT
                                      ▼
       ┌─────────────────────────────────────────────────────────────┐
       │                   BACKEND (Python + FastAPI)                │
       │  - API REST Modular (Routers, Schemas Pydantic, Services)   │
       │  - Aislamiento Multitenancy por 'negocio_id'                │
       │  - Seguridad: Passwords con bcrypt / JWT Tokens (HS256)     │
       │  - Validaciones estrictas Pydantic v2                       │
       └──────────────────────────────┬──────────────────────────────┘
                                      │ SQLAlchemy 2.0 ORM
                                      │ Driver ODBC 17 / pyodbc
                                      ▼
       ┌─────────────────────────────────────────────────────────────┐
       │               BASE DE DATOS (Microsoft SQL Server)          │
       │  - Instancia local (SQL Server 2022 / ODBC Driver 17)        │
       │  - Base de Datos: EasyToolDB                                │
       │  - 7 Tablas: negocios, usuarios, productos, clientes,       │
       │    ventas, detalles_venta, movimientos_inventario           │
       └─────────────────────────────────────────────────────────────┘
```

---

## 3. 🏢 Modelo Multinegocio (Multitenancy)

La entidad raíz del ecosistema es **`negocios`**:
- Ningún usuario, producto, cliente, venta o inventario existe de manera aislada: **todo pertenece estrictamente a un `negocio_id`**.
- **Registro con Llave de Negocio:** Al registrarse, el usuario selecciona de la lista en tiempo real el negocio al que pertenece e ingresa la **clave secreta del negocio (`codigo_negocio`)**. El Backend valida la existencia del negocio, su estado activo y la coincidencia de su clave hasheada antes de afiliar al usuario.
- **Aislamiento de Catálogo:** Cada consulta a `/api/products` filtra automáticamente por el `negocio_id` del usuario autenticado obtenido del JWT (`get_current_user`).

---

## 4. 🗄️ Esquema de Base de Datos (SQLAlchemy & SQL Server)

- **`negocios`**: `id`, `nombre`, `telefono`, `codigo_acceso_hash`, `actividad`, `direccion`, `dueno`, `correo`, `activo`, `fecha_creacion`, `fecha_actualizacion`.
- **`usuarios`**: `id`, `negocio_id` (FK), `nombre`, `correo` (UNIQUE), `password_hash`, `rol`, `activo`, `fecha_creacion`.
- **`productos`**: `id`, `negocio_id` (FK), `nombre`, `descripcion`, `categoria`, `precio`, `stock`, `stock_minimo`, `activo`, `fecha_creacion`.
- **`clientes`** *(Nuevo en FASE 3)*: `id`, `negocio_id` (FK), `nombre`, `telefono`, `correo`, `genero`, `activo`, `fecha_creacion`.
- **`ventas`** *(Preparada)*: `id`, `negocio_id` (FK), `usuario_id` (FK), `cliente_id` (FK nullable), `total`, `estado`, `motivo_anulacion`, `fecha_venta`.
- **`detalles_venta`** *(Preparada)*: `id`, `venta_id` (FK), `producto_id` (FK), `cantidad`, `precio_unitario`, `subtotal`.
- **`movimientos_inventario`** *(Preparada)*: `id`, `negocio_id` (FK), `producto_id` (FK), `usuario_id` (FK), `tipo`, `cantidad`, `stock_anterior`, `stock_nuevo`, `fecha`.

---

## 5. 🛠️ Guía de Instalación y Ejecución: Backend

### Versiones Requeridas:
- **Python:** `3.12.x` (Desarrollado y probado en `3.12.2`)
- **Base de Datos:** Microsoft SQL Server (2019/2022) con `ODBC Driver 17 for SQL Server`
- **FastAPI:** `>=0.115.0`
- **SQLAlchemy:** `>=2.0.30`
- **pyodbc:** `5.3.x`

### Pasos para levantar el Backend:
1. Abrir una terminal y ubicarse en la carpeta del backend:
   ```bash
   cd Backend
   ```
2. Crear un entorno virtual (si no existe):
   ```bash
   python -m venv venv
   ```
3. Activar el entorno virtual:
   - **Windows:** `.\venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`
4. Instalar las dependencias (asegúrate de que el entorno virtual esté activo y diga `(venv)` al inicio de la terminal):
   ```bash
   pip install -r requirements.txt
   ```
   > ℹ️ **¿Qué hace esto?** Lee el archivo `requirements.txt` e instala todos los paquetes necesarios de Python (como `fastapi`, `sqlalchemy`, `pyodbc`, etc.) en sus versiones exactas dentro de tu entorno virtual, sin afectar tu instalación global de Python.

5. Configurar la base de datos:
   - Asegúrate de tener SQL Server ejecutándose localmente.
   - Crea una base de datos vacía llamada `EasyToolDB`.
   - Verifica el archivo `Backend/app/core/config.py` para asegurar que el string de conexión `DATABASE_URL` coincide con la configuración de tu instancia local.
6. Ejecutar el servidor de desarrollo:
   ```bash
   uvicorn app.main:app --reload
   ```
   > **Nota:** La base de datos, las tablas y las columnas (como `cliente_id`) se crearán y actualizarán automáticamente al iniciar el servidor por primera vez. También se insertarán datos por defecto, como la cuenta inicial del SuperAdmin (`superadmin@easytool.com` / `123`).
   
   > **Documentación interactiva Swagger:** Disponible en `http://localhost:8000/docs`

---

## 6. 📱 Guía de Instalación y Ejecución: Frontend

### Versiones Requeridas:
- **Node.js:** `v24.x` (Desarrollado en `v24.15.0`) o `v22.x` LTS.
- **npm:** `v11.x` (Desarrollado en `v11.19.1`) o `v10.x`.
- **Expo CLI:** SDK 57 (`~57.0.25`)
- **React Native:** `0.86.x`

### Pasos para levantar el Frontend:
1. Abrir **otra** terminal (dejando el backend corriendo en la primera) y ubicarse en la carpeta del frontend:
   ```bash
   cd Frontend
   ```
2. Instalar todas las dependencias del proyecto usando npm:
   ```bash
   npm install --legacy-peer-deps
   ```
   > ⚠️ **¡Súper Importante!** Debes incluir `--legacy-peer-deps`. Esto se debe a que el proyecto usa **React 19** (que es muy nuevo) y algunas librerías de interfaz gráfica (como `nativewind` o componentes de navegación) todavía piden versiones antiguas en sus manifiestos. Este comando fuerza a npm a instalarlas ignorando esas advertencias de versión, garantizando que el proyecto corra perfectamente.

3. Conexión Backend <-> Frontend:
   - Por defecto, el archivo `Frontend/src/infrastructure/services/apiClient.ts` intenta conectarse a `http://localhost:8000/api`.
   - Si pruebas en la Web (`--web`), `localhost` funciona perfecto.
   - Si vas a probar en un **emulador Android** o en tu **teléfono físico** a través de Expo Go, cambia `localhost` por tu **dirección IP IPv4 local** (ej. `192.168.1.5:8000/api`).
4. Ejecutar el proyecto con Expo:
   ```bash
   # Para iniciar el menú interactivo de Expo:
   npx expo start
   
   # Para iniciar directamente en el navegador web:
   npx expo start --web
   
   # Para iniciar directamente en el emulador de Android (si lo tienes abierto):
   npx expo start --android
   ```

---

## 7. ✅ Resumen de Estado y Correcciones Sprint 1

| Componente | Tarea / Característica | Estado | Detalle |
| :--- | :--- | :--- | :--- |
| **BD** | Modelo `Cliente` en SQLAlchemy | ✅ Completado | `app/models/cliente.py` integrado en `Base.metadata` |
| **BD** | FK `cliente_id` en `Venta` | ✅ Completado | Nullable en `app/models/venta.py` para Sprint 2 |
| **BD** | Relaciones ORM en `Negocio` | ✅ Completado | Relación `clientes` bidireccional agregada |
| **Backend** | Endpoints de Negocios (`/api/negocios`) | ✅ Operativo | Listado de comercios activos para registro |
| **Backend** | Endpoints de Auth (`/api/auth`) | ✅ Operativo | Login con JWT y Registro con validación de clave de negocio |
| **Backend** | Endpoints de Productos (`/api/products`) | ✅ Operativo | CRUD con paginación, búsqueda en tiempo real y categorías |
| **Frontend** | Cliente HTTP `apiClient.ts` | ✅ Completado | Tokens en AsyncStorage, detección IP multiplataforma |
| **Frontend** | Estado Global `AuthContext.tsx` | ✅ Completado | `useAuth()` disponible en todo el árbol de componentes |
| **Frontend** | `negocioService.ts` | ✅ Completado | Consumo de `GET /api/negocios` |
| **Frontend** | `authService.ts` real | ✅ Completado | Consumo de `/api/auth/login`, `/register`, `/me` |
| **Frontend** | `productService.ts` real | ✅ Completado | Consumo de `/api/products` (CRUD y utilidades) |
| **Frontend** | `RegisterScreen.tsx` | ✅ Completado | Selector de negocio + clave secreta + sin términos ficticios |
| **Frontend** | `LoginScreen.tsx` | ✅ Completado | Autenticación real con JWT guardado en AsyncStorage |
| **Frontend** | `ProductListScreen.tsx` | ✅ Completado | Catálogo paginado consumiendo API real |
| **Frontend** | `ProductFormScreen.tsx` | ✅ Completado | Creación de productos persistiendo en Backend |
| **Frontend** | `DashboardScreen.tsx` | ✅ Completado | Usuario autenticado real y botón de cierre de sesión |
| **Frontend** | Limpieza de Mocks | ✅ Completado | Eliminados archivos `.mock.ts` y referencias |
| **Calidad** | Verificación TypeScript | ✅ 0 Errores | `npx tsc --noEmit` completado exitosamente |
| **Calidad** | Verificación Backend | ✅ 0 Errores | Modelos y FastAPI app importados sin fallos |
