Estoy continuando un proyecto existente llamado **EasyTool**. NO quiero que lo rehagas desde cero.

Primero revisa todos los archivos que te voy a proporcionar: **PDF, HTML, resumen de avances, historias de usuario y código actual de Frontend/Backend**. Usa la documentación para entender qué debe tener el proyecto.

### Arquitectura actual

**Frontend:** React Native + Expo + TypeScript + NativeWind + React Navigation.

**Backend:** Python + FastAPI + SQLAlchemy + Alembic + JWT + hash de contraseñas.

**Base de datos:** Microsoft SQL Server.

Flujo esperado:

**React Native → FastAPI → SQLAlchemy/Alembic → SQL Server**

El sistema es multi-negocio:

**Negocio → Usuarios / Productos / Inventario / Clientes / Ventas**

---

### Problema actual

El Frontend parece estar funcionando principalmente con **datos quemados/mock** y sospecho que **no está consumiendo realmente el Backend**.

Hay cosas como:

* productos ficticios;
* usuarios ficticios;
* stock quemado;
* login que posiblemente no verifica realmente contra la BD;
* validaciones hechas solamente en Frontend;
* endpoints faltantes o no conectados.

Quiero que revises y compruebes realmente la conexión:

**Frontend ↔ Backend ↔ SQL Server**

No asumas que algo funciona solo porque existe un endpoint o un archivo.

---

### Objetivo

Terminar correctamente **SOLO el Sprint 1**.

Revisa especialmente:

* Login.
* Registro de usuarios.
* Negocios.
* Crear productos.
* Listar productos.
* Stock/inventario necesario.
* Validaciones y seguridad.
* Endpoints necesarios.
* Conexión real con SQL Server.
* Separación de información mediante `negocio_id`.

El login y registro deben validarse realmente en Backend y SQL Server, utilizando JWT y contraseñas con hash.

Los productos y stock deben venir de la base de datos, **no de datos quemados en React Native**.

El Frontend debe consumir los endpoints reales.

---

### Clientes

**NO quiero crear todavía un módulo/pantalla de clientes en el Sprint 1.**

Pero sí quiero que revises/crees la tabla `clientes` y su relación con `negocio` y `ventas`, porque las ventas futuras necesitarán saber qué cliente compró.

Yo agregaré los clientes manualmente a la BD por ahora.

---

### Qué debes hacer primero

**NO empieces modificando todo.**

Primero analiza el proyecto y entrégame un diagnóstico con:

1. Qué está funcionando.
2. Qué está incompleto.
3. Qué está mal.
4. Qué datos están quemados.
5. Qué endpoints existen.
6. Qué endpoints faltan del Sprint 1.
7. Qué problemas hay entre Frontend → Backend → SQL Server.
8. Qué falta en la base de datos.
9. Qué falta para terminar Sprint 1.
10. Orden recomendado para corregirlo.

Después iremos corrigiendo paso a paso.

---

### Documentación

Tengo un **resumen de avances** que la IA anterior fue llenando.

No lo pierdas.

Cada cambio que hagamos debe quedar documentado en ese resumen, incluyendo:

* arquitectura;
* tecnologías;
* cambios realizados;
* endpoints;
* modelos;
* migraciones;
* conexiones;
* pruebas;
* pendientes.

También deja documentados los comandos para iniciar:

**Backend**

```bash
venv\Scripts\activate
uvicorn app.main:app --reload
```

**Frontend**

```bash
npx expo start
```

La prioridad es:

**que Frontend, Backend y SQL Server estén realmente conectados y que el Sprint 1 funcione con datos reales, no mock.**
