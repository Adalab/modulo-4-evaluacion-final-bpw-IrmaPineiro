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
//Leer/listar todas las entradas existentes:
app.get("/api/books", async (req, res) => {
    const connection = await getConnection();
    const sqlQuery = "SELECT * FROM books";
    const [bookResults] = await connection.query(sqlQuery);
    //console.log(bookResults);

    connection.end();

    res.status(200).json({
        info: {
            count: bookResults.length
        },
        results: bookResults
    });

});

//Insertar una entrada:
app.post("/api/book", async (req, res) => {
    const connection = await getConnection();
    const { title, author, year, publisher, pages, genre } = req.body;
    //console.log(req.body);

    const sqlQuery = "INSERT INTO books (title, author, year, publisher, pages, genre) VALUES (?, ?, ?, ?, ?, ?)";
    const [bookResultsInsert] = await connection.query(sqlQuery, [title, author, year, publisher, pages, genre]);
    //console.log(bookResultsInsert);

    connection.end();
    res.status(201).json({
        success: true,
        message: "Book added successfully"
    });

});

//Actualizar una entrada existente:

app.put("/api/book/:id", async (req, res) => {
    const connection = await getConnection();
    const { id } = req.params;
    const { title, author, year, publisher, pages, genre } = req.body;
    const sqlQuery = "UPDATE books SET title = ?, author = ?, year = ?, publisher = ?, pages = ?, genre = ? WHERE id = ?";
    const [bookResultsUpdate] = await connection.query(sqlQuery, [title, author, year, publisher, pages, genre, id]);
    console.log(bookResultsUpdate);

    connection.end();
    res.json({
        success: true,
        id: bookResultsUpdate.insertId
    });


});








//Establecer el puerto de conexión:
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
});

