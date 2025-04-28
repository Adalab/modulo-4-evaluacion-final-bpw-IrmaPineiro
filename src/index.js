const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());



// función para realizar conexión para conectarte con la base de datos MySQL:
async function getConnection() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        database: 'library_db',
        user: 'root',
        password: 'irmitate',
    });
    await connection.connect();
    return connection;
}

//Endpoints:
app.get("/api/books", async (req, res) => {
    const connection = await getConnection();
    const sqlQuery = "SELECT * FROM books";
    const [bookResults] = await connection.query(sqlQuery);
    console.log(bookResults);
    res.json({});

    connection.end();
});






//Establecer el puerto de conexión:
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
});

