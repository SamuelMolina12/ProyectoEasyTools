Estoy continuando un proyecto existente llamado **EasyTool**. No quiero empezar desde cero ni reconstruirlo.

Primero necesito que entiendas completamente el proyecto antes de modificar código.

Voy a proporcionarte los archivos que ya tengo, principalmente:

* PDF con los requerimientos.
* HTML/documentación.
* Resumen de avances que otra IA fue construyendo.
* Historias de usuario.
* Frontend.
* Backend.
* Archivos relacionados con la base de datos.

## Arquitectura definida

El proyecto utiliza:

**Frontend**

* React Native
* Expo
* TypeScript
* NativeWind
* React Navigation

**Backend**

* Python
* FastAPI
* SQLAlchemy
* Alembic
* JWT
* Hash seguro de contraseñas
* Pandas para análisis cuando sea necesario

**Base de datos**

* Microsoft SQL Server

La arquitectura esperada es:

Frontend → REST/JSON → FastAPI → SQLAlchemy/Alembic → SQL Server

## Problema actual

El Frontend visualmente está bastante avanzado, pero sospecho que **no está realmente conectado al Backend**.

Actualmente existen datos quemados/mock, por ejemplo:

* productos ficticios;
* usuarios ficticios;
* información de stock;
* posiblemente ventas/clientes;
* validaciones realizadas solamente en Frontend.

Quiero que revises si realmente existe comunicación:

**Frontend → Backend → SQL Server**

y que no asumamos que está conectado simplemente porque existen archivos o endpoints.

## Objetivo

Quiero terminar correctamente **SOLO el Sprint 1**.

Debes revisar las historias de usuario y determinar qué corresponde al Sprint 1, especialmente:

* Login.
* Registro.
* Usuarios.
* Negocios.
* Crear productos.
* Listar productos.
* Stock/inventario necesario.
* Arquitectura y base de datos.
* Validaciones y seguridad correspondientes al Sprint 1.

Quiero que las funcionalidades trabajen con **datos reales de SQL Server**, no con información quemada en el Frontend.

Las validaciones importantes deben estar en el Backend, no solamente en React Native.

Por ejemplo, el login debe realmente consultar el usuario en SQL Server, verificar su contraseña, validar su estado y generar JWT.

El registro debe realmente crear el usuario en la base de datos.

Los productos deben guardarse y consultarse desde SQL Server.

El stock mostrado debe corresponder a datos reales.

## Negocios

El sistema es multi-negocio.

La estructura debe permitir:

Negocio → Usuarios
Negocio → Productos
Negocio → Inventario
Negocio → Clientes
Negocio → Ventas

Los datos de un negocio no deben mezclarse con los de otro.

## Clientes

IMPORTANTE:

**Clientes NO es un módulo que quiero desarrollar visualmente en el Sprint 1.**

Pero sí necesito que exista la estructura de base de datos `clientes` y que quede preparada la relación con `ventas`, porque posteriormente necesito análisis como clientes que más compran, historial de compras, género, etc.

Yo agregaré los clientes manualmente a la base de datos por ahora.

No desarrolles todavía una pantalla/CRUD de clientes.

## Qué quiero que hagas AHORA

NO modifiques todavía todo el proyecto.

Primero:

1. Lee el PDF.
2. Lee el HTML.
3. Lee el resumen.
4. Revisa las historias de usuario.
5. Analiza la estructura del Frontend.
6. Analiza la estructura del Backend.
7. Analiza la conexión con SQL Server.
8. Revisa modelos, schemas, servicios, routers y endpoints.
9. Detecta datos quemados.
10. Detecta funcionalidades faltantes.
11. Comprueba qué partes realmente están conectadas.

Después entrégame un diagnóstico dividido en:

* Qué está bien.
* Qué está incompleto.
* Qué está mal.
* Qué está quemado/mock.
* Qué no está conectado.
* Qué endpoints faltan.
* Qué falta en la base de datos.
* Qué falta del Sprint 1.
* Qué debemos corregir primero.

NO avances todavía a los Sprints 2, 3, 4 o 5.

Tampoco reconstruyas el proyecto.

Primero quiero el diagnóstico y luego iremos corrigiendo paso a paso.

Además, el documento/resumen existente debe conservarse y posteriormente actualizarse con cada cambio realizado.

Al final de todo el proceso también quiero que el resumen documente:

* arquitectura;
* tecnologías;
* Frontend;
* Backend;
* SQL Server;
* modelos;
* endpoints;
* conexiones;
* migraciones;
* cambios realizados;
* pruebas;
* pendientes.

Y documenta también los comandos para iniciar:

Backend:
`venv\Scripts\activate`
`uvicorn app.main:app --reload`

Frontend:
`npx expo start`

La prioridad absoluta ahora es:

**VERIFICAR Y CORREGIR LA CONEXIÓN REAL ENTRE FRONTEND + BACKEND + SQL SERVER Y TERMINAR CORRECTAMENTE EL SPRINT 1.**
