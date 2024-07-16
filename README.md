# Sistema de Autenticación de Usuarios - Backend 14 - ADA ITW

## Descripción

Este proyecto implementa un sistema de autenticación de usuarios utilizando una arquitectura REST y MVC. Permite realizar las siguientes operaciones:

- **Registro:** Creación de un nuevo usuario.
- **Inicio de sesión:** Autenticación de usuarios.
- **Cierre de sesión:** Finalización de la sesión activa.
- **Actualización:** Modificación de la información de usuario.
- **Eliminación:** Borrado permanente de un usuario.

## Base de Datos

Se utiliza supabase (https://supabase.com/) como sistema de gestión de bases de datos. El esquema incluye las siguientes tablas:

### USERS

- `userId`: string
- `username`: string
- `fullname`: string
- `email`: email
- `birthdate`: date
- `nationality`: string

### AUTH

- `accessToken`: string
- `password`: string (mínimo 8 caracteres, incluyendo números, letras mayúsculas y minúsculas, y caracteres especiales)
- `refreshToken`: string
- `userId`: string

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

- src
 - constants
  - index.ts
 - controllers
  - database.ts
  - user.ts
 - logs
  - error.log
  - user.log
 - middlewares
  - request-logger.ts
  - token-validator.ts
  - wrong-method-handler.ts
  - wrong-url-handler.ts
 - models
  - db
   - db_sync.ts
   - index.ts
  - auth.ts
  - user.ts
 - research
  - helmet.md
  - paginacion.md
  - refresh-tokens.md
  - winston.md
 - routes
  - routerIndex.ts
  - routerUser.ts
 - schemas
  - users.ts
 - utils
  - jwt.ts
  - logs.ts
  - password-hash.ts
 - app.ts
 - index.ts
- .env
- .gitignore
- package-lock.json
- package.json
- README.md
- tsconfig.json

## Documentación y Ejemplos

### Endpoints/ ejemplos de uso

- **Ver version del servidor:**
- `GET http://localhost:port/version`

- **Registro de Usuario:**
  - `POST http://localhost:port/user`
  - Ejemplo de Body:
    ```json
    {
      "username": "example",
      "fullname": "example example",
      "password": "QW&54b32",
      "email": "example@gmail.com",
      "birthdate": "2010-05-25",
      "nationality": "Argentina"
    }
    ```

- **login:**
  - `POST http://localhost:port/login`
  - Ejemplo de Body:
    ```json
    {
      "email": "testpass@gmail.com",
      "password": "A123&b45"
    }
    ```

- **Update:**
  - `PATCH http://localhost:port/me/:id`
  - Requiere autorizacion: `bearer exampletoken`
  - Ejemplo de Body:
    ```json
    {
      "email": "example@gmail.com",
      "fullname": "example update",
      "birthdate": "1996-05-17"
    }
    ```

- **getUser:**
  - `GET http://localhost:port/me/:email`
  - Requiere autorizacion: `bearer exampletoken`
  - Ejemplo de Body:
    ```json
    {
      "email": "emailexample@gmail.com"
    }
    ```

- **DeleteUser:**
  - `DELETE /user/:id`
  - Requiere autorizacion: `bearer exampletoken`

- **logout:**
  - `DELETE /logout`
  - Requiere autorizacion: `bearer exampletoken`

### Tokens de Actualización

Algunos endpoints requieren un middleware para verificar los permisos del usuario:

- **Update**
- **Consulta de Usuario**
- **Eliminación**
- **Cierre de Sesión**

El middleware de autenticación utiliza tokens de actualización. Cuando el token de acceso expira pero el token de actualización está activo, se enviará automáticamente un nuevo token de acceso en el encabezado de la solicitud y se actualizará en la base de datos. Esto evita que el usuario tenga que iniciar sesión nuevamente. Sin embargo, si ambos tokens han expirado, se notificará al usuario para que inicie sesión nuevamente.