# Historias de Usuario — Plataforma de gestión y análisis de ventas
### Mapeadas a campos de tarjeta de Trello (con criterios de aceptación y prioridad)

Basado en el PDF de formulación del proyecto y el HTML del filtro ágil. Cada tarjeta trae los campos de tu Trello: **Título, Descripción, Prioridad, Criterios de Aceptación, Etiquetas, Checklist, Miembros, Fechas.**

**Dónde poner cada campo nuevo en Trello (no existen por defecto, así que usa esto):**
- **Prioridad →** Etiqueta de color extra (ej. 🔴 Alta / 🟡 Media / ⚪ Baja) o un **Campo personalizado** llamado "Prioridad" (Trello Premium) o simplemente al inicio del título: `[ALTA] Iniciar sesión`.
- **Criterios de Aceptación →** dentro de la **Descripción**, en una sección aparte, o como un **segundo Checklist** llamado "Criterios de aceptación" (recomendado, porque se pueden marcar uno por uno).

**Convención de etiquetas de módulo:** 🔵 Autenticación · 🟢 Productos · 🟡 Ventas · 🟠 Inventario · 🟣 Dashboard · 🔴 Reportes · ⚪ Transversal/Técnico

**Prioridad (MoSCoW adaptado):** 🔴 Alta (Must have — sin esto no hay MVP) · 🟡 Media (Should have) · ⚪ Baja (Could have — si sobra tiempo)

**Miembros:** Samuel Molina (Frontend/Diseño) · Juan Jose Vega (Backend/BD)

**Duración del proyecto:** 13/08/2026 – 12/11/2026 (≈3 meses → 5 sprints de 2 semanas sugeridos)

---

## ÉPICA 1 · Autenticación (🔵)

### HU-01 — Inicio de sesión
- **Título:** [ALTA] Iniciar sesión en la plataforma
- **Descripción:** Como propietario o empleado del negocio, quiero iniciar sesión con usuario y contraseña, para acceder de forma segura a mi información de ventas e inventario.
- **Prioridad:** 🔴 Alta
- **Criterios de Aceptación:**
  - Dado que ingreso credenciales correctas, cuando presiono "Iniciar sesión", entonces accedo al dashboard.
  - Dado que ingreso credenciales incorrectas, cuando presiono "Iniciar sesión", entonces veo un mensaje de error claro.
  - Dado que dejo campos vacíos, cuando intento enviar el formulario, entonces se muestra validación antes de enviar.
- **Etiquetas:** 🔵 Autenticación
- **Checklist (tareas técnicas):**
  - [ ] Formulario con campos usuario/contraseña
  - [ ] Validación de credenciales en backend
  - [ ] Redirección al dashboard tras login exitoso
- **Miembros:** Juan Jose (backend) + Samuel (frontend)
- **Fechas:** Sprint 1

### HU-02 — Registro de nuevo usuario
- **Título:** [ALTA] Registrar cuenta de usuario
- **Descripción:** Como propietario del negocio, quiero crear una cuenta nueva en la plataforma, para poder empezar a usarla.
- **Prioridad:** 🔴 Alta
- **Criterios de Aceptación:**
  - Dado que lleno el formulario con datos válidos, cuando envío el registro, entonces se crea la cuenta y puedo iniciar sesión.
  - Dado que uso un correo ya registrado, cuando intento registrarme, entonces el sistema me avisa que ya existe.
  - Dado que la contraseña no cumple el mínimo de seguridad, cuando la escribo, entonces se muestra una advertencia.
- **Etiquetas:** 🔵 Autenticación
- **Checklist:**
  - [ ] Formulario de registro (nombre, correo, contraseña)
  - [ ] Validación de correo único
  - [ ] Confirmación de registro exitoso
- **Miembros:** Juan Jose + Samuel
- **Fechas:** Sprint 1

### HU-03 — Recuperar contraseña
- **Título:** [BAJA] Recuperar contraseña olvidada
- **Descripción:** Como usuario, quiero recuperar mi contraseña, para volver a acceder a la plataforma si la olvido.
- **Prioridad:** ⚪ Baja
- **Criterios de Aceptación:**
  - Dado que olvidé mi contraseña, cuando hago clic en "olvidé mi contraseña", entonces recibo un enlace/código de recuperación.
  - Dado que uso el enlace de recuperación, cuando defino una nueva contraseña, entonces puedo iniciar sesión con ella.
- **Etiquetas:** 🔵 Autenticación
- **Checklist:**
  - [ ] Opción "olvidé mi contraseña" en el login
  - [ ] Envío de enlace/código de recuperación
  - [ ] Formulario para definir nueva contraseña
- **Miembros:** Juan Jose
- **Fechas:** Sprint 2

### HU-04 — Roles de usuario
- **Título:** [MEDIA] Diferenciar roles propietario/empleado
- **Descripción:** Como propietario del negocio, quiero definir roles de acceso (propietario/empleado), para controlar qué funcionalidades puede usar cada persona.
- **Prioridad:** 🟡 Media
- **Criterios de Aceptación:**
  - Dado que un usuario tiene rol "empleado", cuando intenta ver reportes, entonces el sistema le restringe el acceso.
  - Dado que un usuario tiene rol "propietario", cuando inicia sesión, entonces ve todas las funcionalidades disponibles.
- **Etiquetas:** 🔵 Autenticación
- **Checklist:**
  - [ ] Campo de rol en el usuario
  - [ ] Restricción de vistas según rol
  - [ ] Prueba de acceso con cada rol
- **Miembros:** Juan Jose
- **Fechas:** Sprint 2

---

## ÉPICA 2 · Gestión de productos (🟢)

### HU-05 — Registrar producto
- **Título:** [ALTA] Registrar nuevo producto
- **Descripción:** Como propietario o empleado, quiero registrar un producto (nombre, precio, categoría, stock inicial), para tenerlo disponible en el catálogo de ventas.
- **Prioridad:** 🔴 Alta
- **Criterios de Aceptación:**
  - Dado que lleno todos los campos obligatorios, cuando guardo, entonces el producto aparece en el listado.
  - Dado que dejo un campo obligatorio vacío, cuando intento guardar, entonces el sistema me muestra el error correspondiente.
- **Etiquetas:** 🟢 Productos
- **Checklist:**
  - [ ] Formulario con validación de campos obligatorios
  - [ ] Guardado en base de datos
  - [ ] Mensaje de confirmación
- **Miembros:** Samuel (UI) + Juan Jose (BD)
- **Fechas:** Sprint 1

### HU-06 — Consultar listado de productos
- **Título:** [ALTA] Ver catálogo de productos
- **Descripción:** Como propietario o empleado, quiero consultar el listado de productos registrados, para verificar la información disponible.
- **Prioridad:** 🔴 Alta
- **Criterios de Aceptación:**
  - Dado que hay productos registrados, cuando entro al catálogo, entonces veo nombre, precio y stock de cada uno.
  - Dado que hay más de 20 productos, cuando cargo el listado, entonces se muestra paginado.
- **Etiquetas:** 🟢 Productos
- **Checklist:**
  - [ ] Tabla/lista con nombre, precio, stock
  - [ ] Paginación si hay muchos productos
- **Miembros:** Samuel
- **Fechas:** Sprint 1

### HU-07 — Editar producto
- **Título:** [MEDIA] Editar información de producto
- **Descripción:** Como propietario o empleado, quiero editar los datos de un producto existente, para mantener la información actualizada.
- **Prioridad:** 🟡 Media
- **Criterios de Aceptación:**
  - Dado que selecciono "editar" en un producto, cuando cambio un dato y guardo, entonces el listado refleja el cambio.
  - Dado que cancelo la edición, cuando cierro el formulario, entonces el producto conserva sus datos originales.
- **Etiquetas:** 🟢 Productos
- **Checklist:**
  - [ ] Formulario de edición precargado
  - [ ] Validación de cambios
  - [ ] Confirmación de guardado
- **Miembros:** Samuel + Juan Jose
- **Fechas:** Sprint 2

### HU-08 — Eliminar/desactivar producto
- **Título:** [MEDIA] Eliminar o desactivar producto
- **Descripción:** Como propietario, quiero eliminar o desactivar un producto que ya no se vende, para mantener el catálogo limpio.
- **Prioridad:** 🟡 Media
- **Criterios de Aceptación:**
  - Dado que elijo desactivar un producto, cuando confirmo la acción, entonces deja de aparecer en el catálogo de venta activo.
  - Dado que un producto tiene ventas históricas asociadas, cuando lo desactivo, entonces esas ventas no se pierden del historial.
- **Etiquetas:** 🟢 Productos
- **Checklist:**
  - [ ] Confirmación antes de eliminar
  - [ ] Opción de desactivar en vez de borrar (soft delete)
- **Miembros:** Juan Jose
- **Fechas:** Sprint 2

### HU-09 — Buscar productos
- **Título:** [MEDIA] Buscar productos por nombre/categoría
- **Descripción:** Como propietario o empleado, quiero buscar productos por nombre o categoría, para encontrarlos rápidamente al momento de vender.
- **Prioridad:** 🟡 Media
- **Criterios de Aceptación:**
  - Dado que escribo parte del nombre de un producto, cuando busco, entonces veo solo los productos coincidentes.
  - Dado que filtro por categoría, cuando aplico el filtro, entonces solo se muestran productos de esa categoría.
- **Etiquetas:** 🟢 Productos
- **Checklist:**
  - [ ] Barra de búsqueda
  - [ ] Filtro por categoría
  - [ ] Resultados en tiempo real
- **Miembros:** Samuel
- **Fechas:** Sprint 2

---

## ÉPICA 3 · Registro y consulta de ventas (🟡)

### HU-10 — Registrar una venta
- **Título:** [ALTA] Registrar nueva venta
- **Descripción:** Como empleado, quiero registrar una venta seleccionando productos y cantidades, para dejar constancia de la transacción realizada.
- **Prioridad:** 🔴 Alta
- **Criterios de Aceptación:**
  - Dado que selecciono productos y cantidades, cuando confirmo la venta, entonces se guarda con fecha, hora y total calculado.
  - Dado que selecciono una cantidad mayor al stock disponible, cuando intento confirmar, entonces el sistema me lo impide y avisa.
- **Etiquetas:** 🟡 Ventas
- **Checklist:**
  - [ ] Selector de productos y cantidades
  - [ ] Cálculo automático del total
  - [ ] Guardado de la venta con fecha/hora
- **Miembros:** Samuel + Juan Jose
- **Fechas:** Sprint 3

### HU-11 — Consultar historial de ventas
- **Título:** [ALTA] Ver historial de ventas
- **Descripción:** Como propietario, quiero consultar el historial de ventas, para analizar el comportamiento del negocio.
- **Prioridad:** 🔴 Alta
- **Criterios de Aceptación:**
  - Dado que hay ventas registradas, cuando entro al historial, entonces veo fecha, productos, total y empleado que la registró.
  - Dado que hay muchas ventas, cuando abro el historial, entonces están ordenadas de la más reciente a la más antigua.
- **Etiquetas:** 🟡 Ventas
- **Checklist:**
  - [ ] Tabla con fecha, productos, total, empleado
  - [ ] Ordenamiento por fecha
- **Miembros:** Samuel
- **Fechas:** Sprint 3

### HU-12 — Filtrar ventas
- **Título:** [MEDIA] Filtrar ventas por fecha/producto/empleado
- **Descripción:** Como propietario, quiero filtrar las ventas por fecha, producto o empleado, para obtener información específica.
- **Prioridad:** 🟡 Media
- **Criterios de Aceptación:**
  - Dado que aplico un filtro de fechas, cuando busco, entonces solo veo ventas dentro de ese rango.
  - Dado que filtro por un empleado específico, cuando busco, entonces solo veo las ventas registradas por esa persona.
- **Etiquetas:** 🟡 Ventas
- **Checklist:**
  - [ ] Filtro por rango de fechas
  - [ ] Filtro por producto
  - [ ] Filtro por empleado
- **Miembros:** Samuel + Juan Jose
- **Fechas:** Sprint 4

### HU-13 — Anular/corregir venta
- **Título:** [MEDIA] Anular o corregir una venta
- **Descripción:** Como empleado, quiero anular o corregir una venta registrada por error, para mantener los datos correctos.
- **Prioridad:** 🟡 Media
- **Criterios de Aceptación:**
  - Dado que anulo una venta, cuando confirmo la acción, entonces el inventario de los productos involucrados se revierte.
  - Dado que anulo una venta, cuando reviso el historial, entonces queda marcada como "anulada" junto con el motivo.
- **Etiquetas:** 🟡 Ventas
- **Checklist:**
  - [ ] Opción de anular venta
  - [ ] Reversión del inventario asociado
  - [ ] Registro de motivo de anulación
- **Miembros:** Juan Jose
- **Fechas:** Sprint 4

### HU-14 — Total vendido por periodo
- **Título:** [MEDIA] Ver total vendido en un periodo
- **Descripción:** Como propietario, quiero ver el total vendido en un periodo determinado, para conocer el desempeño del negocio.
- **Prioridad:** 🟡 Media
- **Criterios de Aceptación:**
  - Dado que selecciono un rango de fechas, cuando consulto, entonces veo el total vendido en ese periodo.
  - Dado que no hay ventas en el rango elegido, cuando consulto, entonces el sistema muestra "$0" en vez de un error.
- **Etiquetas:** 🟡 Ventas
- **Checklist:**
  - [ ] Selector de rango de fechas
  - [ ] Cálculo de total acumulado
- **Miembros:** Juan Jose
- **Fechas:** Sprint 4

---

## ÉPICA 4 · Control básico de inventario (🟠)

### HU-15 — Actualización automática de inventario
- **Título:** [ALTA] Actualizar inventario al vender
- **Descripción:** Como propietario o empleado, quiero que el inventario se actualice automáticamente al registrar una venta, para mantener el stock correcto sin trabajo manual.
- **Prioridad:** 🔴 Alta
- **Criterios de Aceptación:**
  - Dado que se confirma una venta, cuando se guarda, entonces el stock de cada producto vendido se reduce automáticamente.
  - Dado que el stock de un producto es insuficiente, cuando se intenta vender, entonces la venta no se permite.
- **Etiquetas:** 🟠 Inventario
- **Checklist:**
  - [ ] Descuento automático de stock al confirmar venta
  - [ ] Validación de stock suficiente antes de vender
- **Miembros:** Juan Jose
- **Fechas:** Sprint 3

### HU-16 — Alerta de stock bajo
- **Título:** [MEDIA] Alertar cuando el stock es bajo
- **Descripción:** Como propietario, quiero recibir una alerta cuando un producto tenga stock bajo, para reabastecerlo a tiempo.
- **Prioridad:** 🟡 Media
- **Criterios de Aceptación:**
  - Dado que el stock de un producto llega al umbral mínimo definido, cuando reviso el listado, entonces aparece resaltado (ej. en rojo).
  - Dado que defino un umbral distinto para un producto, cuando su stock baja de ese valor, entonces la alerta se ajusta a ese producto.
- **Etiquetas:** 🟠 Inventario
- **Checklist:**
  - [ ] Definir umbral mínimo de stock por producto
  - [ ] Indicador visual en el listado
- **Miembros:** Samuel + Juan Jose
- **Fechas:** Sprint 4

### HU-17 — Ajuste manual de inventario
- **Título:** [MEDIA] Ajustar inventario manualmente
- **Descripción:** Como propietario o empleado, quiero ajustar manualmente el inventario (entradas/salidas), para corregir diferencias por pérdidas, devoluciones o nuevos pedidos.
- **Prioridad:** 🟡 Media
- **Criterios de Aceptación:**
  - Dado que registro una entrada de stock, cuando guardo, entonces el inventario del producto aumenta en la cantidad indicada.
  - Dado que registro un ajuste, cuando lo guardo, entonces queda en el historial de movimientos con fecha y motivo.
- **Etiquetas:** 🟠 Inventario
- **Checklist:**
  - [ ] Formulario de entrada/salida de stock
  - [ ] Registro de motivo del ajuste
  - [ ] Historial de movimientos de inventario
- **Miembros:** Juan Jose
- **Fechas:** Sprint 4

### HU-18 — Consultar inventario actual
- **Título:** [ALTA] Ver inventario actual
- **Descripción:** Como propietario, quiero consultar el inventario actual de todos los productos, para saber qué hay disponible en cualquier momento.
- **Prioridad:** 🔴 Alta
- **Criterios de Aceptación:**
  - Dado que entro a la vista de inventario, cuando cargo la página, entonces veo el stock actual de cada producto.
  - Dado que busco un producto específico, cuando escribo su nombre, entonces el sistema filtra el inventario en tiempo real.
- **Etiquetas:** 🟠 Inventario
- **Checklist:**
  - [ ] Vista de stock por producto
  - [ ] Búsqueda/filtro dentro del inventario
- **Miembros:** Samuel
- **Fechas:** Sprint 3

---

## ÉPICA 5 · Dashboard de indicadores (🟣)

### HU-19 — Resumen de ventas en dashboard
- **Título:** [ALTA] Ver totales de ventas (día/semana/mes)
- **Descripción:** Como propietario, quiero ver un dashboard con el total de ventas del día, semana y mes, para monitorear el negocio de un vistazo.
- **Prioridad:** 🔴 Alta
- **Criterios de Aceptación:**
  - Dado que entro al dashboard, cuando carga, entonces veo tarjetas con el total de ventas de hoy, esta semana y este mes.
  - Dado que no hay ventas en el periodo, cuando cargo el dashboard, entonces se muestra "$0" en vez de dejar el espacio vacío o con error.
- **Etiquetas:** 🟣 Dashboard
- **Checklist:**
  - [ ] Tarjetas de resumen (hoy/semana/mes)
  - [ ] Datos actualizados al cargar la página
- **Miembros:** Samuel + Juan Jose
- **Fechas:** Sprint 5

### HU-20 — Productos más vendidos
- **Título:** [ALTA] Ver productos más vendidos
- **Descripción:** Como propietario, quiero ver los productos más vendidos, para identificar tendencias y tomar decisiones de compra.
- **Prioridad:** 🔴 Alta
- **Criterios de Aceptación:**
  - Dado que hay ventas registradas, cuando entro al dashboard, entonces veo un ranking de los 5-10 productos más vendidos.
  - Dado que cambio el periodo de análisis, cuando aplico el filtro, entonces el ranking se recalcula.
- **Etiquetas:** 🟣 Dashboard
- **Checklist:**
  - [ ] Ranking top 5/10 productos
  - [ ] Filtro por periodo
- **Miembros:** Juan Jose
- **Fechas:** Sprint 5

### HU-21 — Gráfico de ventas en el tiempo
- **Título:** [MEDIA] Ver gráfico de evolución de ventas
- **Descripción:** Como propietario, quiero ver un gráfico de ventas a lo largo del tiempo, para identificar patrones y estacionalidad.
- **Prioridad:** 🟡 Media
- **Criterios de Aceptación:**
  - Dado que entro al dashboard, cuando cargo el gráfico, entonces veo la evolución de ventas por día/semana/mes.
  - Dado que cambio el rango de tiempo, cuando lo selecciono, entonces el gráfico se actualiza acorde.
- **Etiquetas:** 🟣 Dashboard
- **Checklist:**
  - [ ] Gráfico de línea o barras por fecha
  - [ ] Selector de rango de tiempo
- **Miembros:** Samuel
- **Fechas:** Sprint 5

### HU-22 — Productos de baja rotación
- **Título:** [BAJA] Ver productos con menor rotación
- **Descripción:** Como propietario, quiero ver los productos con menor rotación, para decidir si hacer promociones o dejar de comprarlos.
- **Prioridad:** ⚪ Baja
- **Criterios de Aceptación:**
  - Dado que hay productos con pocas o ninguna venta, cuando reviso el dashboard, entonces aparecen listados de menor a mayor venta.
  - Dado que cambio el periodo de análisis, cuando lo aplico, entonces la lista se recalcula.
- **Etiquetas:** 🟣 Dashboard
- **Checklist:**
  - [ ] Listado ordenado de menor a mayor venta
  - [ ] Filtro por periodo
- **Miembros:** Juan Jose
- **Fechas:** Sprint 5

---

## ÉPICA 6 · Reportes (🔴)

### HU-23 — Reporte de ventas por periodo
- **Título:** [MEDIA] Generar reporte de ventas
- **Descripción:** Como propietario, quiero generar un reporte de ventas por periodo, para llevar un control básico contable o administrativo.
- **Prioridad:** 🟡 Media
- **Criterios de Aceptación:**
  - Dado que selecciono un rango de fechas, cuando genero el reporte, entonces veo el detalle de ventas de ese periodo en pantalla.
  - Dado que no hay ventas en el rango elegido, cuando genero el reporte, entonces se indica que no hay datos.
- **Etiquetas:** 🔴 Reportes
- **Checklist:**
  - [ ] Selector de rango de fechas
  - [ ] Generación del reporte en pantalla
- **Miembros:** Juan Jose
- **Fechas:** Sprint 5

### HU-24 — Exportar reportes
- **Título:** [BAJA] Exportar reportes (PDF/Excel)
- **Descripción:** Como propietario, quiero exportar los reportes en PDF o Excel, para compartirlos o imprimirlos.
- **Prioridad:** ⚪ Baja
- **Criterios de Aceptación:**
  - Dado que tengo un reporte generado, cuando presiono "exportar a PDF", entonces se descarga un archivo PDF con la información.
  - Dado que tengo un reporte generado, cuando presiono "exportar a Excel", entonces se descarga un archivo compatible (.xlsx o .csv).
- **Etiquetas:** 🔴 Reportes
- **Checklist:**
  - [ ] Botón de exportar
  - [ ] Formato PDF funcional
  - [ ] Formato Excel/CSV funcional
- **Miembros:** Juan Jose
- **Fechas:** Sprint 5

### HU-25 — Reporte de inventario
- **Título:** [BAJA] Generar reporte de inventario
- **Descripción:** Como propietario, quiero generar un reporte del estado del inventario, para saber qué productos tienen más o menos stock.
- **Prioridad:** ⚪ Baja
- **Criterios de Aceptación:**
  - Dado que genero el reporte de inventario, cuando lo veo, entonces muestra el stock actual de cada producto.
  - Dado que tengo el reporte generado, cuando presiono "exportar", entonces se descarga correctamente.
- **Etiquetas:** 🔴 Reportes
- **Checklist:**
  - [ ] Reporte con stock actual por producto
  - [ ] Opción de exportar
- **Miembros:** Juan Jose
- **Fechas:** Sprint 5

---

## ÉPICA 7 · Transversal / Técnico (⚪)

### HU-26 — Interfaz sencilla y centralizada
- **Título:** [ALTA] Diseñar interfaz simple y centralizada
- **Descripción:** Como usuario, quiero que la plataforma tenga una interfaz sencilla y centralizada, para usarla sin necesidad de capacitación extensa.
- **Prioridad:** 🔴 Alta
- **Criterios de Aceptación:**
  - Dado el prototipo de interfaz, cuando un usuario nuevo lo revisa, entonces puede identificar las funciones principales sin explicación previa.
  - Dado el diseño final, cuando se valida con el equipo, entonces se aprueba antes de iniciar el desarrollo de las pantallas.
- **Etiquetas:** ⚪ Transversal
- **Checklist:**
  - [ ] Definir wireframes/prototipo de UI
  - [ ] Validar usabilidad con el equipo
- **Miembros:** Samuel
- **Fechas:** Sprint 1

### HU-27 — Arquitectura y base de datos
- **Título:** [ALTA] Diseñar arquitectura y base de datos
- **Descripción:** Como equipo de desarrollo, quiero diseñar la arquitectura de la solución y la base de datos, para soportar todas las funcionalidades del MVP.
- **Prioridad:** 🔴 Alta
- **Criterios de Aceptación:**
  - Dado el análisis de requisitos, cuando se diseña el modelo de datos, entonces cubre productos, ventas, inventario y usuarios.
  - Dado el documento de arquitectura, cuando se revisa con el equipo, entonces queda aprobado antes de iniciar el desarrollo.
- **Etiquetas:** ⚪ Transversal
- **Checklist:**
  - [ ] Modelo entidad-relación
  - [ ] Definición de stack tecnológico
  - [ ] Documento de arquitectura
- **Miembros:** Juan Jose
- **Fechas:** Sprint 1

### HU-28 — Validación y seguridad de datos
- **Título:** [ALTA] Implementar validación y control de acceso
- **Descripción:** Como propietario, quiero que la plataforma tenga mecanismos básicos de validación de datos y control de acceso, para reducir riesgos de seguridad (riesgo identificado en el PDF del proyecto).
- **Prioridad:** 🔴 Alta
- **Criterios de Aceptación:**
  - Dado un formulario de la plataforma, cuando se envían datos inválidos, entonces se rechazan tanto en frontend como en backend.
  - Dado un usuario sin permisos, cuando intenta acceder a una función restringida, entonces el sistema le niega el acceso.
- **Etiquetas:** ⚪ Transversal
- **Checklist:**
  - [ ] Validaciones de formularios en frontend y backend
  - [ ] Control de acceso por rol
  - [ ] Pruebas de seguridad básicas
- **Miembros:** Juan Jose
- **Fechas:** Sprint 2

---

## Cómo organizar los tableros/listas en Trello

Listas sugeridas:
1. **Backlog** (todas las HU sin priorizar)
2. **Pendiente** (priorizadas para el sprint actual)
3. **En progreso**
4. **En revisión/pruebas**
5. **Hecho**

**Sugerencia de orden de trabajo por prioridad:** empieza siempre por las tarjetas 🔴 Alta de cada sprint (son las que hacen que el MVP funcione de punta a punta), y deja las 🟡 Media / ⚪ Baja para cuando sobre tiempo dentro del sprint.
