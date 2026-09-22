CONTEXTO GENERAL DEL PROYECTO

Estoy trabajando en un proyecto académico llamado EasyTool, una plataforma para gestión, control y análisis de ventas, productos e inventario.

Voy a continuar el proyecto en una nueva cuenta/chat porque se me terminaron los créditos de la cuenta anterior. NO quiero empezar el proyecto desde cero.

Ya existe un proyecto con Frontend, Backend, base de datos, documentación y avances realizados por otra IA.

Voy a proporcionarte los archivos que tengo, especialmente:

PDF con los requerimientos del proyecto.
HTML/documentación relacionada con el proyecto.
Resumen/documento de progreso que la IA anterior fue llenando.
Historias de usuario.
Código actual del Frontend.
Código actual del Backend.
Archivos relacionados con la base de datos, si están disponibles.

Tu primera tarea NO es programar inmediatamente.

Primero debes entender completamente el proyecto existente, revisar la documentación y analizar el código actual para determinar qué está hecho, qué está incompleto, qué está mal conectado y qué falta para terminar correctamente el Sprint 1.

1. REGLA PRINCIPAL: NO REHACER EL PROYECTO

El proyecto ya existe.

NO:

crear otro proyecto desde cero;
borrar el Frontend;
borrar el Backend;
reemplazar toda la arquitectura;
crear otra aplicación diferente;
cambiar innecesariamente las tecnologías;
rehacer interfaces que ya funcionan visualmente.

Sí debes:

revisar;
corregir;
completar;
conectar;
refactorizar cuando sea necesario;
eliminar código de prueba;
eliminar datos quemados;
implementar los endpoints faltantes;
conectar correctamente Frontend, Backend y base de datos;
mantener la interfaz existente siempre que sea posible.

Si encuentras una decisión técnica incorrecta, explícame primero cuál es el problema y corrígela de forma controlada.

2. PRIMERO ENTIENDE TODA LA DOCUMENTACIÓN

Antes de realizar cambios importantes, revisa completamente:

PDF del proyecto.
HTML/documentación.
Resumen de progreso.
Historias de usuario.
Código actual.
Estructura de carpetas.
Modelos de base de datos.
Rutas/endpoints.
Servicios.
Configuración del Frontend.

Necesito que determines cuál es el objetivo real del proyecto y cuáles son los requerimientos específicos del Sprint 1.

No te bases únicamente en el código actual porque puede haber cosas mal implementadas.

La documentación y las historias de usuario son la fuente principal para determinar qué debería existir.

3. ARQUITECTURA ACTUAL DEL PROYECTO

La arquitectura que estamos utilizando es:

                 FRONTEND
        React Native + Expo
               TypeScript
                   │
                   │ HTTP / REST / JSON
                   ▼
                 BACKEND
                  Python
                 FastAPI
                   │
        ┌──────────┴──────────┐
        │                     │
   SQLAlchemy             Servicios
        │
        ▼
     Alembic
        │
        ▼
 MICROSOFT SQL SERVER
Frontend

Tecnologías:

React Native
Expo
TypeScript
NativeWind
React Navigation

El Frontend es una aplicación móvil.

Actualmente la interfaz visual del Sprint 1 ya está bastante avanzada, pero sospecho que muchas partes todavía utilizan datos quemados/mock data y que no están consumiendo realmente el Backend.

4. BACKEND

Tecnologías definidas:

Python
FastAPI
SQLAlchemy
Alembic
Microsoft SQL Server
Pandas para análisis de datos cuando sea necesario
JWT para autenticación
Hash seguro de contraseñas

El Backend debe ser el responsable de:

autenticación;
validación;
autorización;
reglas de negocio;
acceso a la base de datos;
creación y consulta de usuarios;
creación y consulta de productos;
gestión de stock;
ventas;
relaciones entre entidades;
respuestas al Frontend.

No quiero que la lógica importante de seguridad quede únicamente en el Frontend.

5. BASE DE DATOS

La base de datos utilizada es:

Microsoft SQL Server

El acceso debe realizarse mediante:

SQLAlchemy
     ↓
Alembic
     ↓
SQL Server

No quiero que se creen manualmente todas las tablas desde SQL Server Management Studio si pueden gestionarse correctamente mediante modelos SQLAlchemy y migraciones Alembic.

Puedes utilizar SQL Server Management Studio para inspeccionar y consultar la base de datos, pero la estructura del sistema debe estar correctamente representada mediante los modelos y migraciones del Backend.

6. NEGOCIOS / MULTI-TENANT

El sistema debe soportar múltiples negocios/tiendas.

La entidad debe llamarse:

negocio

No utilizar "tienda" como nombre principal de la entidad.

La estructura conceptual es:

NEGOCIO
│
├── Usuarios
│
├── Productos
│
├── Clientes
│
├── Ventas
│
└── Inventario

Cada negocio debe tener sus propios datos.

Es fundamental evitar que:

Negocio A

pueda consultar o modificar información de:

Negocio B

Por eso debes verificar que las relaciones y consultas tengan correctamente el negocio_id cuando corresponda.

7. ADMINISTRACIÓN FUTURA

El sistema está pensado para que en el futuro exista:

ADMIN GENERAL
       │
       ├── crea negocios
       └── configura negocio

ADMIN DEL NEGOCIO
       │
       └── administra usuarios de su negocio

EMPLEADOS
       │
       └── realizan operaciones permitidas

No quiero que desarrolles ahora todo el sistema administrativo futuro si no pertenece al Sprint 1.

Pero la arquitectura debe quedar preparada para soportarlo.

No hagas una implementación que después obligue a rehacer toda la base de datos.

8. AUTENTICACIÓN Y REGISTRO

Debes revisar completamente la lógica de:

Login

El Frontend NO debe decidir si un usuario es válido.

Debe funcionar aproximadamente así:

Frontend
   │
   │ email + password
   ▼
FastAPI
   │
   ├── busca usuario
   ├── verifica estado
   ├── verifica contraseña
   ├── verifica negocio
   └── genera JWT
        │
        ▼
Frontend
        │
        ▼
Dashboard

Debes verificar:

campos obligatorios;
email válido;
usuario existente;
contraseña correcta;
usuario activo;
negocio activo;
contraseña almacenada mediante hash;
generación correcta del JWT;
manejo correcto del token;
respuestas de error;
códigos HTTP adecuados.

NO debe existir algo como:

if email == "admin@test.com":

ni usuarios de prueba quemados.

Tampoco debe existir una pantalla que permita entrar simplemente porque el Frontend tiene un usuario escrito en código.

9. REGISTRO DE USUARIO

El registro debe estar conectado realmente con Backend y SQL Server.

Los datos deben incluir como mínimo:

nombre;
email;
contraseña;
confirmación de contraseña;
negocio;
código/contraseña del negocio.

El negocio debe cargarse desde la base de datos.

NO debe existir una lista como:

[
  "Tienda 1",
  "Tienda 2",
  "Tienda 3"
]

quemada en el Frontend.

Debe existir un endpoint para obtener los negocios disponibles para el registro.

Al registrar:

Frontend
   ↓
Backend
   ↓
Validar negocio
   ↓
Validar negocio activo
   ↓
Validar código/contraseña del negocio
   ↓
Validar email único
   ↓
Validar contraseña
   ↓
Hash de contraseña
   ↓
Guardar usuario
   ↓
SQL Server

La contraseña nunca debe almacenarse en texto plano.

10. PRODUCTOS

Debes revisar completamente el CRUD correspondiente al Sprint 1.

Como mínimo:

Crear producto

Campos definidos por las historias de usuario:

nombre;
precio;
categoría;
stock inicial.

Debe:

recibir información del Frontend;
validar en Backend;
guardar en SQL Server;
asociarlo al negocio del usuario;
devolver una respuesta correcta;
actualizar la interfaz.

No quiero productos ficticios escritos directamente en React Native.

11. LISTAR PRODUCTOS

La pantalla de productos debe obtener información REAL desde:

SQL Server
   ↑
SQLAlchemy
   ↑
FastAPI
   ↑
Frontend

Si actualmente existe algo como:

const products = [
   ...
]

con productos de prueba, debe eliminarse/reemplazarse.

La pantalla debe mostrar los productos reales de la base de datos correspondientes al negocio autenticado.

Revisar:

nombre;
precio;
categoría;
stock;
estado;
negocio;
búsqueda si ya corresponde;
paginación si corresponde al Sprint 1.
12. STOCK / INVENTARIO

Debes revisar especialmente esta parte porque debe quedar preparada para las ventas posteriores.

El stock debe estar correctamente relacionado con:

Negocio
Producto
Inventario
Venta

Debes comprobar:

stock inicial;
stock actual;
relación producto-negocio;
actualización del stock;
validaciones;
evitar stock negativo;
consistencia entre producto e inventario.

No quiero que el stock mostrado en el Frontend sea un número quemado.

Debe venir de la base de datos.

13. CLIENTES — IMPORTANTE

Hay una aclaración importante.

Clientes NO es una funcionalidad que quiera desarrollar como módulo/pantalla durante el Sprint 1.

NO debes crear ahora:

pantalla de clientes;
navegación de clientes;
dashboard de clientes;
CRUD visual completo de clientes.

Sin embargo, necesito que la arquitectura y base de datos estén preparadas porque las ventas necesitan poder relacionarse con clientes.

Por ejemplo, en futuros Sprints quiero poder obtener información como:

quién compró más;
cantidad de compras por cliente;
historial de compras;
clientes frecuentes;
análisis por género;
otros análisis comerciales.

Por eso SÍ necesito que revises y, si actualmente no existe, implementes la estructura de base de datos necesaria para:

NEGOCIO
   │
   ├── CLIENTES
   │       │
   │       └── VENTAS
   │
   └── PRODUCTOS

La tabla clientes debe pertenecer a un negocio.

Debe existir la relación necesaria para que posteriormente una venta pueda identificar qué cliente realizó la compra.

Yo me encargaré manualmente de crear/agregar los clientes en la base de datos por ahora.

Por tanto:

NO desarrolles el apartado visual de clientes en el Sprint 1.

Pero:

SÍ deja creada y correctamente relacionada la estructura de datos necesaria para ventas futuras.

Si el modelo de venta ya existe, revisa cómo debe relacionarse con cliente_id.

14. VENTAS

Aunque las ventas pertenecen principalmente a un Sprint posterior, necesito que revises la estructura actual porque:

productos;
stock;
clientes;
negocios;

deben quedar correctamente preparados para las ventas.

Si encuentras que actualmente el Frontend tiene información de:

"quién compró"
"cliente"
"comprador"

pero no existe lógica real en Backend o base de datos, identifica esas partes.

No desarrolles todo el módulo de ventas si no pertenece al Sprint 1.

Pero sí corrige/prepara las relaciones necesarias.

15. EL PROBLEMA PRINCIPAL QUE DEBES INVESTIGAR

Actualmente tengo la sospecha de que:

Frontend
   X
Backend
   X
SQL Server

no están realmente conectados correctamente.

Por ejemplo:

Frontend inicia correctamente;
Backend inicia correctamente;
SQL Server está funcionando;
pero el Frontend sigue mostrando información de prueba;
login parece funcionar aunque el usuario no exista realmente;
productos aparecen aunque no estén en la base de datos;
validaciones aparentemente están hechas solamente en Frontend;
algunos endpoints pueden no existir;
algunas peticiones pueden no estar llegando al Backend.

Necesito que hagas una auditoría real de las conexiones.

16. AUDITORÍA FRONTEND → BACKEND

Debes revisar:

URL base de la API;
configuración de ambiente;
endpoints;
métodos HTTP;
headers;
Content-Type;
JWT;
almacenamiento del token;
manejo de errores;
respuestas HTTP;
navegación después del login;
autenticación;
interceptores si existen;
servicios/API clients;
llamadas fetch o Axios;
variables de entorno;
configuración para dispositivo/emulador.

Quiero comprobar que cuando el usuario hace:

Login

realmente ocurra:

React Native
     ↓
HTTP POST
     ↓
FastAPI
     ↓
SQL Server
     ↓
respuesta
     ↓
React Native

No simplemente una simulación.

17. AUDITORÍA BACKEND → SQL SERVER

Debes revisar:

conexión SQL Server;
cadena de conexión;
.env;
SQLAlchemy;
engine;
session;
modelos;
relaciones;
claves foráneas;
migraciones;
Alembic;
consultas;
manejo de errores;
transacciones.

Comprueba que los endpoints realmente consulten y modifiquen SQL Server.

18. AUDITORÍA DE ENDPOINTS

Quiero que identifiques TODOS los endpoints necesarios para el Sprint 1.

Haz una tabla como:

Funcionalidad	Endpoint	Método	Front conectado	Backend implementado	SQL conectado	Estado
Login	/...	POST	❌	✅	✅	Pendiente
Registro	/...	POST	❌	✅	✅	Pendiente
Negocios	/...	GET	❌	❌	❌	Pendiente
Crear producto	/...	POST	❌	❌	❌	Pendiente
Listar productos	/...	GET	❌	❌	❌	Pendiente

Utiliza los endpoints reales que encuentres en el proyecto.

NO inventes que algo está conectado solamente porque existe el archivo.

Debes verificar la conexión real.

19. DATOS QUEMADOS / MOCK DATA

Busca en TODO el Frontend:

arrays de productos;
usuarios ficticios;
negocios ficticios;
clientes ficticios;
ventas ficticias;
estadísticas ficticias;
stock ficticio;
nombres de prueba;
contraseñas;
datos hardcodeados;
objetos JSON usados como base de la interfaz.

Ejemplos:

const products = [...]
const users = [...]
const sales = [...]
const stores = [...]

etc.

Determina cuáles son únicamente elementos visuales y cuáles deberían provenir del Backend.

Para los datos funcionales:

eliminar el mock y consumir el Backend.

20. VALIDACIONES

Quiero una separación correcta:

Frontend

Puede validar:

campos vacíos;
formato básico;
feedback visual;
confirmación de contraseña;
formatos básicos.
Backend

Debe validar realmente:

existencia del usuario;
contraseña;
existencia del negocio;
negocio activo;
código del negocio;
email único;
permisos;
existencia del producto;
pertenencia del producto al negocio;
stock;
reglas de negocio;
tipos y valores;
autorización mediante JWT.

El Frontend NO debe ser la fuente de seguridad.

21. SEGURIDAD

Revisar:

contraseñas con hash;
JWT;
expiración del token;
autenticación;
autorización;
roles;
evitar devolver contraseñas;
evitar guardar contraseñas en texto plano;
evitar credenciales quemadas;
validación de IDs;
aislamiento por negocio_id.

No quiero implementar una seguridad exageradamente compleja, pero sí una implementación correcta para el proyecto académico.

22. SPRINT 1

Debes revisar las historias de usuario y determinar exactamente cuáles corresponden al Sprint 1.

Entre las funcionalidades que debemos verificar están principalmente:

Autenticación
HU-01 Login
HU-02 Registro
Productos
HU-05 Crear producto
HU-06 Listar productos
Interfaz
HU-26 Interfaz centralizada
Arquitectura
HU-27 Arquitectura + base de datos
Seguridad
revisar qué parte de HU-28 corresponde al Sprint 1 y qué parte queda para el Sprint 2.

NO avances implementando funcionalidades completas de los Sprints 2, 3, 4 o 5.

23. NO HACER TODAVÍA

No desarrollar todavía:

recuperación de contraseña completa si pertenece al Sprint 2;
administración completa de roles del Sprint 2;
edición/eliminación completa de productos si pertenece al Sprint 2;
módulo completo de ventas del Sprint 3;
dashboard avanzado;
reportes;
exportación PDF;
análisis avanzados;
módulo visual de clientes.

Solamente deja las estructuras necesarias preparadas cuando sean necesarias para no romper futuras funcionalidades.

24. FRONTEND ACTUAL

El Frontend ya tiene una interfaz desarrollada.

Quiero conservarla.

Solo modificarla cuando sea necesario para:

conectar APIs;
eliminar mock data;
corregir errores;
mostrar datos reales;
agregar estados de carga;
mostrar errores del Backend;
manejar autenticación;
corregir navegación;
adaptar formularios a los endpoints reales.

No cambies innecesariamente el diseño visual.

El nombre del proyecto debe ser:

EasyTool

No debe aparecer:

VentasPro

También debe eliminarse cualquier footer antiguo como:

© 2026 VentasPro · Todos los derechos reservados

Y no debe existir la sección:

Términos y condiciones

en el registro si todavía está presente.

25. CONFIGURACIÓN DE ENTORNO

Revisar:

Backend:

.env
.gitignore
requirements.txt

Frontend:

variables de entorno/configuración necesarias para consumir la API.

Nunca colocar:

contraseñas de SQL Server;
secretos JWT;
credenciales;

directamente en el código.

26. COMANDOS PARA INICIAR EL PROYECTO

Quiero que al finalizar dejes documentados los comandos exactos para ejecutar el sistema.

Backend

Desde:

C:\Users\Samuel\Desktop\Nueva carpeta\proyecto\Backend

Activar entorno virtual:

venv\Scripts\activate

Iniciar FastAPI:

uvicorn app.main:app --reload

Documentación:

http://127.0.0.1:8000/docs

Si el proyecto utiliza otra configuración real, documenta la correcta.

Frontend

Desde:

C:\Users\Samuel\Desktop\Nueva carpeta\proyecto\Frontend

iniciar con:

npx expo start

Si se requiere otro comando debido a la configuración actual, indícalo.

27. PRUEBAS REALES

No quiero que simplemente revises archivos.

Quiero que pruebes el flujo.

Por ejemplo:

Registro
Frontend
↓
Seleccionar negocio real
↓
Enviar formulario
↓
FastAPI
↓
SQL Server
↓
Usuario creado

Después comprobar:

Login
↓
Usuario real
↓
JWT
↓
Dashboard

Después:

Crear producto
↓
Backend
↓
SQL Server
↓
Producto guardado
↓
Listar productos
↓
Producto aparece en Frontend

Después comprobar:

Modificar/consultar stock

según lo que corresponda al Sprint 1.

Si algo no funciona, no lo ocultes: identifica exactamente dónde está fallando.

28. PRUEBA PARA DETECTAR DATOS QUEMADOS

Haz una prueba importante:

Si borro un producto directamente de SQL Server, el Frontend NO debería seguir mostrando ese producto después de actualizar la información.

Si creo un producto directamente en SQL Server, el Frontend debería poder mostrarlo cuando consulte el Backend.

Esto permitirá comprobar que realmente estamos utilizando la base de datos y no información quemada.

Haz pruebas equivalentes para los usuarios cuando sea posible.

29. MANEJO DE ERRORES

El Backend debe devolver errores claros.

Ejemplos:

401 → credenciales incorrectas/no autenticado
403 → no tiene permisos
404 → recurso no encontrado
409 → conflicto, por ejemplo email existente
422 → datos inválidos
500 → error interno

El Frontend debe interpretar correctamente estas respuestas y mostrar mensajes entendibles.

No mostrar errores técnicos innecesarios al usuario.

30. DOCUMENTACIÓN / RESUMEN DEL PROYECTO

Tengo un documento de resumen que la IA anterior fue llenando durante el desarrollo.

NO quiero perderlo.

Cada vez que hagas cambios importantes debes actualizar ese resumen.

El resumen debe explicar:

Proyecto
nombre;
objetivo;
alcance.
Arquitectura
React Native + Expo
        ↓
REST API
        ↓
FastAPI
        ↓
SQLAlchemy
        ↓
Alembic
        ↓
Microsoft SQL Server
Frontend

Explicar:

React Native;
Expo;
TypeScript;
NativeWind;
React Navigation;
estructura;
comunicación con API.
Backend

Explicar:

Python;
FastAPI;
estructura;
routers;
schemas;
models;
services;
autenticación;
JWT;
SQLAlchemy;
Alembic.
Base de datos

Explicar:

SQL Server;
tablas;
relaciones;
negocio_id;
usuarios;
productos;
inventario;
clientes;
ventas;
claves foráneas.
Sprint 1

Documentar:

historias implementadas;
historias pendientes;
endpoints;
modelos;
migraciones;
conexiones realizadas.
Cambios realizados

Por cada sesión/cambio documentar:

Fecha
Cambio realizado
Archivos modificados
Problema solucionado
Endpoint creado/modificado
Modelo creado/modificado
Migración realizada
Prueba realizada
Resultado
Pendientes

Mantener una lista actualizada de:

pendientes del Sprint 1;
problemas encontrados;
funcionalidades de próximos Sprints.
31. IMPORTANTE: NO MARCAR COMO HECHO SIN VERIFICAR

No quiero que simplemente escribas:

"Frontend conectado con Backend"

si solamente existe un archivo API.

Debes comprobar que realmente:

Frontend
   ↓
HTTP
   ↓
FastAPI
   ↓
SQLAlchemy
   ↓
SQL Server

funcione.

Lo mismo para autenticación y productos.

32. ORDEN DE TRABAJO

Quiero que trabajes en este orden:

FASE 1 — Comprensión

Revisar:

PDF;
HTML;
resumen;
historias;
estructura;
Frontend;
Backend;
base de datos.
FASE 2 — Auditoría

Crear un diagnóstico:

HECHO
INCOMPLETO
INCORRECTO
FALTANTE
NO CONECTADO
FASE 3 — Base de datos

Revisar:

modelos;
relaciones;
migraciones;
negocio;
usuarios;
productos;
inventario;
clientes;
ventas.
FASE 4 — Backend

Revisar/crear:

conexión SQL Server;
modelos;
schemas;
servicios;
routers;
autenticación;
JWT;
validaciones;
endpoints del Sprint 1.
FASE 5 — Frontend

Conectar:

login;
registro;
negocios;
productos;
stock;
autenticación;
manejo de errores.

Eliminar:

mock data;
usuarios ficticios;
productos ficticios;
validaciones que deberían estar en Backend.
FASE 6 — Pruebas

Probar:

Registro
Login
JWT
Crear producto
Listar productos
Stock
Errores
Negocio
Persistencia SQL Server
FASE 7 — Documentación

Actualizar el resumen.

33. PRIMERA RESPUESTA QUE QUIERO DE TI

Antes de comenzar a modificar código, quiero que primero me entregues un diagnóstico.

Incluye:

A. Qué entendiste del proyecto
B. Arquitectura actual detectada
C. Tecnologías realmente utilizadas
D. Estructura actual de carpetas
E. Estado del Frontend
F. Estado del Backend
G. Estado de SQL Server
H. Estado de las conexiones
Frontend → Backend
Backend → SQL Server
I. Endpoints existentes
J. Endpoints faltantes del Sprint 1
K. Datos quemados encontrados
L. Problemas de autenticación
M. Problemas de productos
N. Problemas de stock/inventario
O. Problemas de arquitectura/base de datos
P. Tabla clientes y relación futura con ventas
Q. Qué falta exactamente para terminar Sprint 1
R. Plan de corrección por orden

NO empieces cambiando 50 archivos inmediatamente.

Primero dame el diagnóstico y después vamos corrigiendo.

34. OBJETIVO FINAL DE ESTA ETAPA

Al terminar esta etapa quiero tener:

                 EASYTOOL

        React Native + Expo
                 │
                 │ REST / JSON
                 ▼
             FastAPI
                 │
        ┌────────┴────────┐
        │                 │
   SQLAlchemy          JWT/Auth
        │
        ▼
    SQL Server

Y que realmente funcione.

Quiero poder:

1. Iniciar Backend
2. Iniciar Frontend
3. Registrar usuario real
4. Seleccionar negocio real
5. Validar negocio
6. Guardar usuario en SQL Server
7. Iniciar sesión
8. Obtener JWT
9. Entrar al sistema
10. Crear producto
11. Guardar producto en SQL Server
12. Consultar productos reales
13. Ver stock real
14. Mantener separación por negocio
15. Tener la estructura de clientes preparada para ventas futuras

Sin datos quemados.

Sin usuarios ficticios.

Sin productos ficticios.

Sin autenticaciones simuladas.

Sin depender únicamente de validaciones del Frontend.

Todo debe estar correctamente conectado:

FRONTEND
   ↕
BACKEND
   ↕
BASE DE DATOS

Y cada avance debe quedar documentado en el resumen del proyecto.

Recuerda: estamos terminando correctamente el Sprint 1, no desarrollando todo el proyecto de una vez.