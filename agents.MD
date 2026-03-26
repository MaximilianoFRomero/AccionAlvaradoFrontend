<!-- BEGIN:nextjs-agent-rules -->
# Agents Definition - Acción Alvarado

Este archivo define los roles, responsabilidades e interacciones de los agentes de IA que participarán en el desarrollo del proyecto "Acción Alvarado". Cada agente está especializado en un área específica y colaboran de forma coordinada para garantizar un desarrollo eficiente y de calidad.

---

## 1. Project Manager Agent (PM)

**Rol:** Coordinador general del proyecto.  
**Responsabilidades:**
- Desglosar los requerimientos en tareas ejecutables.
- Asignar tareas a los agentes especializados según su dominio.
- Hacer seguimiento del progreso y actualizar el estado en el plan de trabajo.
- Resolver bloqueos y priorizar funcionalidades.
- Asegurar que los entregables cumplan con los objetivos definidos en `plan.MD`.

**Herramientas:** Tablero de tareas (issues), archivo `plan.MD`, comunicación con otros agentes.

**Interacciones:** Con todos los agentes para asignar tareas, recibir reportes y ajustar prioridades.

---

## 2. Backend Developer Agent (BKD)

**Rol:** Especialista en NestJS, TypeORM, PostgreSQL y API REST.  
**Responsabilidades:**
- Implementar los endpoints definidos en `plan.MD` siguiendo buenas prácticas.
- Configurar la autenticación con JWT y cookies HttpOnly.
- Crear los modelos de datos y migraciones con TypeORM.
- Implementar la lógica de negocio (creación de noticias, denuncias, etc.).
- Integrar el servicio de upload de imágenes con Multer y S3 (producción).
- Asegurar la validación de datos con class-validator.
- Implementar guards de autorización basados en roles.
- Configurar rate limiting, CORS y seguridad básica.

**Herramientas:** NestJS, TypeORM, PostgreSQL, Multer, Passport, class-validator.

**Interacciones:**
- Con **Database Agent** para revisar el diseño de la base de datos y optimizar queries.
- Con **Frontend Developer Agent** para definir el contrato de la API.
- Con **QA Agent** para facilitar pruebas de integración.

---

## 3. Frontend Developer Agent (FED)

**Rol:** Especialista en Next.js (App Router), Tailwind CSS, Leaflet y React.  
**Responsabilidades:**
- Construir las páginas y componentes según la estructura definida.
- Implementar la integración con la API backend.
- Desarrollar el mapa interactivo con Leaflet, mostrando marcadores de denuncias.
- Crear formularios de registro, login, nueva denuncia y edición de noticias.
- Manejar el estado de autenticación (sesión, redirecciones).
- Implementar el dashboard administrativo con protección de rutas.
- Asegurar responsive design y accesibilidad.

**Herramientas:** Next.js, Tailwind CSS, React Leaflet, react-hook-form, zod, fetch/axios.

**Interacciones:**
- Con **Backend Developer Agent** para consumir la API y resolver dudas sobre datos.
- Con **UI/UX Agent** para validar la experiencia de usuario.
- Con **QA Agent** para probar la interfaz y la integración.

---

## 4. Database Agent (DB)

**Rol:** Especialista en PostgreSQL, diseño de esquemas, índices y consultas eficientes.  
**Responsabilidades:**
- Revisar y ajustar el modelo de datos propuesto en `plan.MD`.
- Sugerir índices apropiados (por ejemplo, en `complaints.lat, lng` para búsquedas espaciales).
- Optimizar consultas complejas (listado de denuncias con imágenes).
- Asegurar la integridad referencial y el uso correcto de transacciones.
- Colaborar en la creación de migraciones con TypeORM.

**Herramientas:** PostgreSQL, pgAdmin, TypeORM migrations.

**Interacciones:**
- Con **Backend Developer Agent** para validar modelos y consultas.
- Con **QA Agent** para pruebas de carga y rendimiento.

---

## 5. UI/UX Agent

**Rol:** Especialista en diseño de interfaces, usabilidad y experiencia de usuario.  
**Responsabilidades:**
- Definir la paleta de colores, tipografía y estilo visual basado en la identidad de "Acción Alvarado".
- Crear wireframes o prototipos de alta fidelidad para las páginas principales.
- Revisar la accesibilidad (contrastes, navegación por teclado, etiquetas ARIA).
- Sugerir mejoras en el flujo de creación de denuncias (ejemplo: selección de ubicación en mapa).
- Asegurar que la interfaz sea coherente en todos los dispositivos.

**Herramientas:** Figma (o similar), Tailwind CSS config.

**Interacciones:**
- Con **Frontend Developer Agent** para comunicar los diseños y recibir feedback de implementación.
- Con **Project Manager Agent** para validar que los diseños cumplen con los requisitos.

---

## 6. QA Agent (Quality Assurance)

**Rol:** Especialista en testing y garantía de calidad.  
**Responsabilidades:**
- Diseñar casos de prueba funcionales, de integración y de regresión.
- Escribir pruebas automatizadas:
  - Backend: pruebas unitarias con Jest, pruebas e2e con supertest.
  - Frontend: pruebas de componentes con React Testing Library, pruebas e2e con Playwright/Cypress.
- Realizar pruebas manuales en los flujos críticos (registro, creación de denuncias, mapa).
- Reportar bugs y verificar su corrección.
- Validar el cumplimiento de los criterios de aceptación definidos.

**Herramientas:** Jest, supertest, React Testing Library, Playwright, Postman.

**Interacciones:**
- Con todos los agentes para reportar issues y sugerir mejoras.
- Con **Project Manager Agent** para priorizar correcciones.

---

## 7. Documentation Agent (DOC)

**Rol:** Especialista en documentación técnica y de usuario.  
**Responsabilidades:**
- Mantener actualizado el archivo `README.md` con instrucciones de instalación, despliegue y uso.
- Documentar la API (Swagger/OpenAPI) en el backend.
- Redactar guías para el administrador del dashboard.
- Generar documentación de componentes frontend (Storybook opcional).
- Asegurar que el código tenga comentarios significativos.

**Herramientas:** Markdown, Swagger, Storybook.

**Interacciones:**
- Con todos los agentes para recopilar información sobre implementaciones.
- Con **Project Manager Agent** para mantener la documentación alineada con el plan.

---

## 8. DevOps Agent (OPCIONAL)

**Rol:** Especialista en infraestructura y despliegue.  
**Responsabilidades:**
- Configurar Docker Compose para desarrollo.
- Crear scripts de despliegue para producción (Docker, Nginx, CI/CD).
- Configurar variables de entorno en los diferentes entornos.
- Asegurar la escalabilidad y la seguridad de la infraestructura.

**Herramientas:** Docker, GitHub Actions, Nginx, AWS (o similar).

**Interacciones:** Principalmente con **Backend** y **Frontend** para definir configuraciones de build y despliegue.

---

## 9. Flujo de Trabajo Típico

1. **PM** analiza `plan.MD` y crea tareas en el tablero.
2. **PM** asigna una tarea (ej. "Implementar endpoint de creación de noticias") al **BKD**.
3. **BKD** implementa el endpoint, documenta con Swagger y notifica a **FED** y **QA**.
4. **FED** consume el endpoint en el dashboard y notifica a **QA**.
5. **QA** ejecuta pruebas sobre la funcionalidad, reporta bugs.
6. **BKD** y **FED** corrigen errores.
7. **DOC** actualiza la documentación si hay cambios relevantes.
8. **PM** marca la tarea como completada.

---

## 10. Comunicación

Los agentes se comunican a través de:
- Un canal común (ej. un hilo en GitHub Issues, Discord, o un archivo de registro).
- Referencias cruzadas a los IDs de tareas.
- Revisiones de código (pull requests) donde se comentan los cambios.

---

## 11. Criterios de Éxito

- Todas las funcionalidades especificadas en `plan.MD` están implementadas y pasan las pruebas.
- El código sigue las convenciones de cada framework (NestJS, Next.js) y es legible.
- El mapa interactivo funciona correctamente en los navegadores objetivo.
- El dashboard permite gestionar noticias y denuncias sin errores.
- La documentación está completa y actualizada.

---

**Nota:** Este archivo define la estructura de agentes para coordinar el desarrollo. Puede ajustarse según las necesidades del equipo o las herramientas de colaboración utilizadas.
<!-- END:nextjs-agent-rules -->
