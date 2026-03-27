# Plan de Desarrollo - Acción Alvarado

## 1. Introducción
Acción Alvarado es una plataforma web institucional para una agrupación política vecinal. Su objetivo es mantener informados a los vecinos a través de noticias y proporcionar un canal para reportar problemáticas urbanas (calles en mal estado, basurales, etc.) mediante un mapa interactivo. La web será de acceso público, pero los usuarios deberán registrarse para realizar denuncias.

## 2. Objetivos
- Proveer un portal informativo con noticias de la agrupación.
- Permitir a los vecinos visualizar y crear denuncias sobre problemáticas urbanas mediante un mapa.
- Ofrecer un panel de administración para gestionar noticias y moderar denuncias.
- Implementar autenticación segura para los usuarios.
- Asegurar una experiencia responsive y moderna.

## 3. Alcance
**Incluye:**
- Página principal con últimas noticias y un mapa con denuncias recientes.
- Sección de noticias con listado y detalle.
- Sección de denuncias con mapa interactivo y formulario de carga.
- Dashboard administrativo para gestionar noticias y denuncias.
- Registro e inicio de sesión de usuarios.
- Carga de imágenes en noticias y denuncias.

**Excluye (por ahora):**
- Sistema de comentarios.
- Notificaciones push/email.
- Aplicación móvil nativa.

## 4. Arquitectura Técnica

### 4.1. Backend (NestJS)
- Framework: NestJS con TypeScript.
- ORM: TypeORM.
- Base de datos: PostgreSQL.
- Autenticación: Passport JWT con cookies HttpOnly.
- Validación: class-validator.
- Servicio de archivos: Multer (almacenamiento local en desarrollo, S3 en producción).

### 4.2. Frontend (Next.js)
- Framework: Next.js (App Router).
- Estilos: Tailwind CSS.
- Estado global: React Context o Zustand (opcional).
- Mapa: Leaflet con OpenStreetMap.
- Cliente HTTP: fetch nativo o axios.
- Formularios: react-hook-form + zod.

### 4.3. Comunicación
- API RESTful entre frontend y backend.
- Variables de entorno para configuración (URLs, JWT secret, etc.).

## 5. Modelo de Datos

### 5.1. Usuarios (`users`)
| Campo        | Tipo         | Descripción                     |
|--------------|--------------|---------------------------------|
| id           | UUID         | Clave primaria                  |
| name         | VARCHAR(100) | Nombre completo                 |
| email        | VARCHAR(100) | Correo único                    |
| password     | VARCHAR(255) | Hash bcrypt                     |
| role         | ENUM         | 'user' o 'admin'                |
| created_at   | TIMESTAMP    | Fecha de registro               |
| updated_at   | TIMESTAMP    |                                 |

### 5.2. Noticias (`news`)
| Campo       | Tipo          | Descripción                     |
|-------------|---------------|---------------------------------|
| id          | UUID          | Clave primaria                  |
| title       | VARCHAR(200)  | Título de la noticia            |
| content     | TEXT          | Contenido HTML/Texto            |
| image_url   | VARCHAR(255)  | URL de la imagen principal      |
| created_at  | TIMESTAMP     |                                 |
| updated_at  | TIMESTAMP     |                                 |

### 5.3. Denuncias (`complaints`)
| Campo         | Tipo          | Descripción                     |
|---------------|---------------|---------------------------------|
| id            | UUID          | Clave primaria                  |
| user_id       | UUID          | FK → users.id                   |
| lat           | DECIMAL(10,8) | Latitud                         |
| lng           | DECIMAL(11,8) | Longitud                        |
| address       | VARCHAR(255)  | Dirección aproximada            |
| description   | TEXT          | Descripción del problema        |
| category      | VARCHAR(50)   | Ej: "calles", "basurales"       |
| status        | VARCHAR(20)   | "pendiente", "en proceso", "resuelto" |
| created_at    | TIMESTAMP     |                                 |
| updated_at    | TIMESTAMP     |                                 |

### 5.4. Imágenes de denuncias (`complaint_images`)
| Campo         | Tipo          | Descripción                     |
|---------------|---------------|---------------------------------|
| id            | UUID          | Clave primaria                  |
| complaint_id  | UUID          | FK → complaints.id              |
| image_url     | VARCHAR(255)  | URL de la imagen                |
| created_at    | TIMESTAMP     |                                 |

## 6. API Endpoints

### 6.1. Autenticación (`/auth`)
| Método | Ruta        | Descripción                | Acceso       |
|--------|-------------|----------------------------|--------------|
| POST   | /register   | Registro de usuario         | público      |
| POST   | /login      | Inicio de sesión            | público      |
| POST   | /logout     | Cierre de sesión            | usuario/auth |
| GET    | /profile    | Obtener perfil              | usuario/auth |

### 6.2. Noticias (`/news`)
| Método | Ruta        | Descripción                | Acceso       |
|--------|-------------|----------------------------|--------------|
| GET    | /           | Listar noticias (pag.)     | público      |
| GET    | /:id        | Obtener detalle            | público      |
| POST   | /           | Crear noticia              | admin        |
| PATCH  | /:id        | Actualizar noticia         | admin        |
| DELETE | /:id        | Eliminar noticia           | admin        |

### 6.3. Denuncias (`/complaints`)
| Método | Ruta         | Descripción                | Acceso       |
|--------|--------------|----------------------------|--------------|
| GET    | /            | Listar denuncias (geojson) | público      |
| GET    | /:id         | Obtener detalle            | público      |
| POST   | /            | Crear denuncia             | usuario/auth |
| PATCH  | /:id         | Modificar estado (moderación) | admin     |
| DELETE | /:id         | Eliminar denuncia          | admin o dueño|

### 6.4. Upload (`/upload`)
| Método | Ruta        | Descripción                | Acceso       |
|--------|-------------|----------------------------|--------------|
| POST   | /image      | Subir imagen (noticias/denuncias) | admin/user |

## 7. Frontend Estructura

### 7.1. Páginas (App Router)

```
src/app/
├── layout.tsx # Layout principal
├── page.tsx # Home (noticias + mapa resumen)
├── noticias/
│ ├── page.tsx # Listado de noticias
│ └── [id]/page.tsx # Detalle de noticia
├── denuncias/
│ ├── page.tsx # Mapa completo con marcadores
│ ├── nueva/
│ │ └── page.tsx # Formulario para nueva denuncia
│ └── [id]/page.tsx # Detalle de denuncia
├── auth/
│ ├── login/page.tsx
│ └── registro/page.tsx
├── dashboard/
│ └── (admin)/
│ ├── noticias/
│ │ ├── page.tsx # Listado admin + botón crear
│ │ └── [id]/editar/page.tsx
│ └── denuncias/
│ └── page.tsx # Listado admin con opciones de moderación
└── api/ # Rutas API (opcional, si se usa backend propio)
```

### 7.2. Componentes Reutilizables
- **Mapa** (Leaflet): encargado de mostrar marcadores, clics para crear denuncias.
- **ModalDenuncia**: muestra los detalles al hacer clic en un marcador.
- **FormularioDenuncia**: campos con ubicación seleccionada en mapa.
- **CardNoticia**: para listados.
- **Navbar** con links a secciones y estado de sesión.
- **UploaderImagen**: componente para subir imágenes con vista previa.

## 8. Mapa Interactivo

### 8.1. Tecnología
- Leaflet + React Leaflet.
- Tile Layer: OpenStreetMap estándar.
- Geocodificación inversa (opcional) para obtener dirección desde coordenadas.

### 8.2. Funcionalidades
- **Visualización pública**: todos los marcadores de denuncias (con color según categoría).
- **Clic en marcador**: abre modal con información resumida (foto, descripción, estado) y enlace a detalle.
- **Agregar denuncia**: usuario autenticado puede hacer clic en el mapa o usar un botón para colocar un marcador, luego llenar formulario.
- **Área de mapa**: se centrará en la localidad de Alvarado (o la ciudad correspondiente).

## 9. Dashboard Administrativo

### 9.1. Acceso
- Solo usuarios con rol `admin`.
- Protegido por middleware en Next.js que valida token y rol.

### 9.2. Funcionalidades
- **Noticias**: listado con botones editar/eliminar, formulario de creación/edición (editor de texto simple).
- **Denuncias**: listado con filtros (categoría, estado), posibilidad de cambiar estado, eliminar.
- **Estadísticas básicas**: cantidad de denuncias por categoría, últimas noticias.

## 10. Autenticación y Autorización

### 10.1. Flujo
1. Usuario se registra con email y contraseña.
2. Backend valida, hashea contraseña y retorna JWT en cookie HttpOnly.
3. Frontend envía automáticamente la cookie en cada request.
4. Middleware en Next.js valida token para rutas protegidas (dashboard, crear denuncia).
5. En backend, guards de NestJS protegen endpoints según rol.

### 10.2. Seguridad
- Cookies con flags `HttpOnly`, `Secure`, `SameSite=Strict`.
- CSRF protection (opcional).
- Validación de entrada en todos los endpoints.

## 11. Carga de Imágenes

- Endpoint `/upload/image` acepta multipart/form-data.
- Devuelve URL pública de la imagen.
- En desarrollo, se guarda en `public/uploads/` y se sirve estáticamente.
- En producción, se recomienda usar AWS S3 o similar.
- Tamaño máximo: 5MB. Formatos: jpg, png, webp.

## 12. Seguridad Adicional

- **Rate limiting**: en backend para rutas críticas (login, registro, upload).
- **Helmet** para cabeceras HTTP.
- **CORS** configurado para permitir solo origen del frontend.
- **Sanitización** de HTML en contenido de noticias.
- **Prevención de inyección SQL** mediante TypeORM.

## 13. Despliegue

### 13.1. Entorno de Desarrollo
- Docker Compose para levantar PostgreSQL, backend y frontend en modo desarrollo.
- Variables de entorno en archivos `.env`.

### 13.2. Entorno de Producción
- Backend: Contenedor Docker con NestJS, servido detrás de Nginx.
- Frontend: Build estático (Next.js `output: 'standalone'`) servido por Nginx o Vercel.
- Base de datos: PostgreSQL gestionado (RDS, DigitalOcean Managed DB, etc.).
- Almacenamiento de imágenes: S3 o similar.

## 14. Posibles Mejoras Futuras
- Geolocalización automática del usuario.
- Notificaciones por email sobre cambios de estado de denuncias.
- Integración con redes sociales.
- Reportes descargables.
- Comentarios en noticias.

## 16. Registro de Cambios y Mejoras (Marzo 2026)

### 16.1. UI/UX y Estética
- **Hero Section (Home)**: Se implementó una imagen de fondo (`miramar01.jpg`) con una superposición blanca traslúcida (`bg-white/45`) y efecto `backdrop-blur` para mejorar la profundidad visual sin sacrificar la legibilidad del texto.
- **Navbar Logo**: Se reemplazó el icono de texto por el `favicon.ico` oficial, integrado en un contenedor estilizado con fondo azul. Se aplicó una técnica de *cache-busting* (`?v=2`) para asegurar la actualización inmediata en el navegador.
- **Tipografía**: Ajustes de contraste en el Hero, cambiando etiquetas secundarias a `text-white` para resaltar sobre el nuevo fondo.

### 16.2. Iconografía y Solución de Errores
- **Brand Icons**: Se resolvió el error de iconos de marca faltantes en `lucide-react` v1.x mediante la creación de un componente dedicado `src/components/ui/BrandIcons.tsx`.
- **Facebook & X**: Implementación de SVGs personalizados que siguen el lenguaje de diseño de Lucide (stroke de 2px, bordes redondeados).
- **Actualización de Marca**: Se migró el icono de Twitter al nuevo logo de **X** en todas las secciones de redes sociales.

### 16.3. Gestión de Archivos Estáticos
- Los recursos visuales como el favicon y las imágenes de fondo se centralizaron en la carpeta `public/` para garantizar un acceso rápido y compatible con las optimizaciones de Next.js.
- **Limpieza de Código**: Eliminación de importaciones redundantes de `lucide-react` en componentes del dashboard para mejorar la mantenibilidad.

### 16.4. Soporte para Despliegue y Demo (Vercel)
- **Modo Mock Global**: Implementación de un interceptor de respuesta en `src/services/apiService.ts` que detecta errores de red (cuando el backend no está iniciado) y devuelve automáticamente datos de prueba (**Mock Data**). Esto permite que la web sea totalmente funcional en Vercel como demo interactiva (Noticias, Mapa, Login).
- **Configuración de Imágenes**: Se actualizaron los `remotePatterns` en `next.config.ts` para permitir dominios externos como `images.unsplash.com` e `imgs.search.brave.com`, evitando errores de renderizado en `next/image`.

### 16.5. Refinamientos de UI y Redes Sociales
- **Navbar**: Se ajustó el comportamiento del navbar para permanecer transparente durante el scroll, eliminando el oscurecimiento automático solicitado por el diseño.
- **Footer**: Implementación del icono oficial de **Instagram** en `BrandIcons.tsx` y vinculación de perfiles reales de Facebook e Instagram en el pie de página.
- **Accesibilidad en Noticias**: Ajuste de contrastes en la sección de noticias, cambiando el color de títulos y extractos a blanco (`text-white`) en zonas con fondo gris o efecto `glass` para una estética más premium.