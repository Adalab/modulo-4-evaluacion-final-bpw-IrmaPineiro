#Biblioteca API

Esta API permite la gestión de libros en una biblioteca mediante operaciones de lectura, inserción, actualización y eliminación. También incluye autenticación de usuarios.

## 🚀 Despliegue y Repositorio

- **Repositorio en GitHub**: [Enlace al repositorio](https://github.com/Adalab/modulo-4-evaluacion-final-bpw-IrmaPineiro.git)
- **Desplegado en Render.com**: [Enlace a la API](https://modulo-4-evaluacion-final-bpw-irmapineiro.onrender.com)

## 🛠 Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/turepositorio.git](https://github.com/Adalab/modulo-4-evaluacion-final-bpw-IrmaPineiro.git

   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3.Configura las variables de entorno en un archivo .env:

DB_HOST=tu_localhost
DB_DATABASE=library_db
DB_USER=tu_root
DB_PORT=3306
DB_PASSWORD=tu_password
MY_SECRET_TOKEN=secretToken
PORT=5000

4.Inicia el servidor:
npm start

## 📌 Endpoints

📚 Books:

1. Listar todos los libros GET /api/books
2. Agregar un nuevo libro POST /api/book
   {
   "title": "El Principito",
   "author": "Antoine de Saint-Exupéry",
   "year": 1943,
   "publisher": "Editorial XYZ",
   "pages": 96,
   "genre": "Ficción"
   }

3. Actualizar un libro existente PUT /api/book/:id
4. Eliminar un libro DELETE /api/book/:id

5. Para ver la pagina dinámica de un libro GET /api/book/:id

👤 Users:

1. Registrar usuario POST /api/register
   {
   "userName": "Irma",
   "email": "irma@example.com",
   "password": "123456"
   }

2. Iniciar sesión POST /api/login
   {
   "email": "irma@example.com",
   "password": "123456"
   }

🔐 Autenticación:
La autenticación se maneja con JWT. Al iniciar sesión, el usuario recibe un token que debe incluir en los headers de las solicitudes protegidas:
Authorization: Bearer <TOKEN>

## 🛠 Tecnologías Utilizadas

Node.js con Express.js

MySQL como base de datos

JWT para autenticación

Bcrypt para encriptación de contraseñas

Postman para pruebas de endpoints
