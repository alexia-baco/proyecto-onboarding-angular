# 📋 Task Manager — Onboarding Project
 
Aplicación **Full-Stack** de gestión de tareas desarrollada como proyecto de onboarding: autenticación segura, panel de administración y una API REST construida con Symfony conectada a un frontend en Angular.
 
![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)
![Symfony](https://img.shields.io/badge/Symfony-000000?style=flat&logo=symfony&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
 
---
 
## 📑 Índice
 
- [Sobre el proyecto](#-sobre-el-proyecto)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Funcionalidades](#-funcionalidades)
- [Puesta en marcha](#-puesta-en-marcha)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Autora](#-autora)
---
 
## 🚀 Sobre el proyecto
 
**Task Manager** es una aplicación de gestión de tareas pensada para que un usuario pueda registrarse, iniciar sesión de forma segura y organizar sus tareas, mientras un administrador dispone de un panel propio con opciones avanzadas de gestión de usuarios. Es el resultado de un proceso completo de onboarding en el que se ha trabajado de extremo a extremo: desde el diseño de la base de datos hasta la interfaz final.
 
## 🛠 Tecnologías
 
| Capa | Tecnología |
|---|---|
| **Frontend** | Angular · Tailwind CSS |
| **Backend** | Symfony · PHP |
| **Base de datos** | PostgreSQL (Doctrine ORM) |
| **Autenticación** | JWT (LexikJWTAuthenticationBundle) |
| **Infraestructura** | Docker · Docker Compose |
 
## 🏗 Arquitectura
 
El proyecto está dividido en dos aplicaciones independientes dentro del mismo repositorio, que se comunican entre sí mediante una API REST:
 
```
proyecto-onboarding-angular/
├── angular-frontend/    → Interfaz de usuario (Angular + Tailwind CSS)
├── symfony-backend/     → API REST (Symfony + PostgreSQL)
└── docker-compose.yml   → Orquestación de servicios
```
 
La API sigue un esquema de rutas bajo `/api`, protegidas con autenticación JWT salvo los endpoints públicos de login, registro y salud del servicio.
 
## ✨ Funcionalidades
 
- 🔐 **Autenticación segura** con JWT (login / logout)
- ✅ **Gestión de tareas**: creación, listado y seguimiento por usuario
- 👤 **Panel de administración** con opciones avanzadas de gestión de usuarios
- 🎨 **Diseño UI/UX unificado y responsive**, construido con Tailwind CSS
- 🐳 **Entorno dockerizado**, listo para levantar con un solo comando
## ⚙️ Puesta en marcha
 
### Requisitos previos
 
- Docker y Docker Compose
- Node.js y Angular CLI
- PHP 8.3+ y Symfony CLI
### Backend
 
```bash
cd symfony-backend
docker compose up -d
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console app:create-admin --email="admin@example.com" --password="tu_password" --nombre="Admin" --roles=ROLE_ADMIN
symfony server:start --port=8000
```
 
### Frontend
 
```bash
cd angular-frontend
npm install
ng serve
```
 
> 💡 El frontend usa un `proxy.conf.json` para redirigir las peticiones `/api` al backend en `http://localhost:8000`, ya configurado en `angular.json`.
 
La aplicación quedará disponible en `http://localhost:4200`.
 
## 📂 Estructura del proyecto
 
**Backend (`symfony-backend/src`)**
- `Controller/` — `AuthController`, `TaskController`, `HealthController`, panel de `Admin`
- `Entity/` — `Usuario`, `Tarea`
- `Repository/` — `UsuarioRepository`, `TareaRepository`
- `Service/` — `AdministradorUsuarioService`, `NotificacionUsuario`, `TareaManager`
- `Command/` — `CreateAdminCommand`
## 👩‍💻 Autora
 
**Alexia Baco**
[LinkedIn](https://www.linkedin.com/in/alexiabaco/)
