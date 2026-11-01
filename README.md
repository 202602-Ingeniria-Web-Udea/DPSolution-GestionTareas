# DP Solutions — Gestión de Tareas

Aplicación web de administración de proyectos y tareas, construida con
**Next.js (App Router) + TypeScript + TailwindCSS + Prisma + Supabase
(PostgreSQL)**. Incluye autenticación real (sesiones con cookie `httpOnly`,
contraseñas con hash bcrypt) y control de acceso por roles tanto en el
front como en el back.

Proyecto evaluativo · Ingeniería Web · Universidad de Antioquia.

**🔗 Demo en vivo:** _(se agrega aquí una vez desplegado en Vercel)_

## 👥 Integrantes

- Jonathan Mazo González — DP Solutions

## 🧩 Dominio elegido: Gestión de Tareas

El enunciado pide un patrón genérico de **Maestros** (con saldo) y
**Movimientos** (entradas/salidas). Para "Gestión de Tareas" ese patrón se
traduce así:

- **Maestro → Proyecto**: tiene un nombre y un `saldo` que representa sus
  **tareas pendientes**.
- **Movimiento → evento sobre las tareas de un Proyecto**: una **entrada**
  significa que se agregaron tareas nuevas (sube el saldo); una **salida**
  significa que se completaron tareas (baja el saldo). Cada movimiento queda
  registrado con quién lo ejecutó.
- La gráfica de "evolución de saldos diarios" se convierte, de forma
  natural, en un **burndown chart** de tareas pendientes por proyecto.

## 🔑 Credenciales de prueba

Creadas por el script de seed (`npm run db:seed`):

| Rol   | Correo                      | Contraseña   |
| ----- | ---------------------------- | ------------ |
| ADMIN | `admin@dpsolutions.test`     | `Admin123!`  |
| USER  | `usuario@dpsolutions.test`   | `Usuario123!`|

> ⚠️ Credenciales de prueba para evaluación — en un sistema real nunca se
> documentarían así.

## 👤 Roles

- **ADMIN**: acceso completo — gestiona usuarios (cambia roles), crea
  Maestros (Proyectos) y gestiona Transacciones.
- **USER**: accede a Transacciones y Maestros (puede registrar movimientos),
  pero no puede crear Maestros ni administrar usuarios. Esto se valida tanto
  ocultando la UI como en cada ruta de API (`getSession()` + chequeo de rol),
  así que no basta con conocer la URL para saltarse la restricción.

## ▶️ Cómo ejecutarlo localmente

1. Clonar el repositorio e instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un proyecto en [Supabase](https://supabase.com) y copiar su
   connection string.

3. Crear un archivo `.env` en la raíz con:

   ```bash
   # Pooler en modo transacción (runtime de la app)
   DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"
   # Pooler en modo sesión / conexión directa (requerida por Prisma Migrate)
   DIRECT_URL="postgresql://...:5432/postgres"
   ```

4. Crear las tablas y generar el cliente de Prisma:

   ```bash
   npx prisma migrate dev --name migracion-inicial
   ```

5. Crear los usuarios de prueba (ADMIN/USER) y un proyecto demo:

   ```bash
   npm run db:seed
   ```

6. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abrir [http://localhost:3000](http://localhost:3000).

   > En algunos equipos Windows con antivirus/EDR activo, Turbopack (el
   > bundler por defecto de `next dev`) puede chocar con el escaneo en
   > tiempo real y fallar con errores `EPERM` al renombrar archivos de
   > `.next/`. Si eso ocurre, usar `npx next dev --webpack` en su lugar.

## 🗂️ Estructura del proyecto

```
app/
  (auth)/login/        # Página de login (pública)
  (main)/               # Rutas protegidas (requieren sesión)
    home/               # Dashboard de bienvenida con resumen
    maestros/           # Gestión de Proyectos
    transacciones/      # Selector de Proyecto + movimientos + gráfica
    users/              # Gestión de usuarios y roles (solo ADMIN)
  api/                  # Rutas de API (login, logout, proyectos, movimientos, users)
components/
  app-sidebar.tsx       # Sidebar fijo con navegación según rol
  maestros/             # Tabla y diálogo de Proyectos
  transacciones/        # Tabla, diálogo, selector y gráfica (recharts)
  users/                # Tabla y diálogo de edición de rol
  ui/                   # Componentes shadcn (base-ui)
lib/
  auth.ts               # requireUser()/requireAdmin() — autorización real
  session.ts             # Creación/lectura/destrucción de sesiones (cookie httpOnly)
  password.ts             # Hash y verificación con bcrypt
  prisma.ts                # Cliente de Prisma (vía adapter de Postgres)
prisma/
  schema.prisma           # User, Session, Proyecto, Movimiento
  seed.ts                  # Usuarios de prueba + proyecto demo
proxy.ts                   # (antes "middleware.ts") redirección optimista si no hay sesión
```

## 🔐 Cómo funciona la autenticación

1. **Login** (`/api/login`): compara la contraseña contra el hash bcrypt
   guardado, crea un registro en `Session` (token aleatorio + expiración a 3
   días) y lo guarda en una cookie `httpOnly` (no accesible desde JS en el
   navegador, protege contra XSS).
2. **`proxy.ts`** (antes `middleware.ts`, renombrado en Next.js 16): hace una
   verificación **optimista** — si no existe la cookie, redirige a
   `/login`. No consulta la base de datos aquí.
3. **`requireUser()` / `requireAdmin()`** (`lib/auth.ts`): esta es la
   autorización **real**. Se usa en el layout de `(main)` y en cada ruta de
   API — valida el token contra la base de datos, revisa expiración y rol.
4. **Logout** (`/api/logout`): borra la sesión de la base de datos y la
   cookie.

## 🎨 Identidad visual

Color de marca: **indigo/violeta** (`oklch(0.511 0.262 276.966)` en modo
claro), aplicado sobre el sistema de diseño de shadcn/Base UI que ya traía
la base del proyecto. Logo: monograma "DP" (`components/logo.tsx`).

## 📝 Notas de implementación

- El esquema de Prisma original (`Product`, `Order`, `Customer`...) era un
  ejemplo de tienda que no aplicaba a este dominio — se reemplazó por
  `Proyecto` y `Movimiento`.
- Las actualizaciones de saldo (`Proyecto.saldo`) y la creación del
  `Movimiento` correspondiente ocurren dentro de una transacción de Prisma
  (`$transaction`), para que nunca queden desincronizados si algo falla a
  mitad de camino. También se valida que una salida no deje el saldo en
  negativo.
- La gráfica de evolución de saldos (`components/transacciones/chart.tsx`)
  no requiere guardar un histórico aparte: se reconstruye restándole al
  saldo actual la suma de todos los movimientos, y reproduciéndolos en
  orden cronológico — así el último punto siempre coincide con el saldo
  real.
