
 #Biblioteca API

Esta API permite la gestión de libros en una biblioteca mediante operaciones de lectura, inserción, actualización y eliminación. También incluye autenticación de usuarios.

## 🚀 Despliegue y Repositorio

- **Repositorio en GitHub**: [Enlace al repositorio](https://github.com/Adalab/modulo-4-evaluacion-final-bpw-IrmaPineiro.git)
- **Desplegado en Render.com**: [Enlace a la API](https://modulo-4-evaluacion-final-bpw-irmapineiro.onrender.com)


## 🛠 Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/turepositorio.git](https://github.com/Adalab/modulo-4-evaluacion-final-bpw-IrmaPineiro.git

2. Instala las dependencias:
      ```bash
   npm install


3.Configura las variables de entorno en un archivo .env:

DB_PASSWORD=tu_password
MY_SECRET_TOKEN=secretToken
PORT=5000


### Endpoints

Books:
1. Listar todos los libros GET /api/books
2. Agregar un nuevo libro POST /api/book
3. Actualizar un libro existente PUT /api/book/:id
4. Eliminar un libro DELETE /api/book/:id







   
