const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



// función para realizar conexión para conectarte con la base de datos MySQL:
async function getConnection() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        database: 'library_db',
        user: 'root',
        password: process.env.DB_PASSWORD,
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
    let connection;
    try {
        connection = await getConnection();
        const { title, author, year, publisher, pages, genre } = req.body;

        if (!title || !author || !year || !publisher || !pages || !genre) {
            return res.status(400).json({
                status: "error",
                message: "Please fill all fields"
            })
        }
        const sqlQuery = "INSERT INTO books (title, author, year, publisher, pages, genre) VALUES (?, ?, ?, ?, ?, ?)";
        const [bookResultsInsert] = await connection.query(sqlQuery, [title, author, year, publisher, pages, genre]);
        return res.status(201).json({
            success: true,
            message: "Book added successfully",
            bookId: bookResultsInsert.insertId
        });



    } catch (error) {
        console.error("Error inserting book", error);
        return res.status(500).json({
            status: "error",
            message: "Internal error. Contact support",
            error: error.message
        });
    }
    finally {
        if (connection)
            await connection.end();
    }
});


//Actualizar una entrada existente:
app.put("/api/book/:id", async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const { id } = req.params;
        const { title, author, year, publisher, pages, genre } = req.body;

        if (!id) {
            return res.status(400).json({
                status: "error",
                message: "Book ID is required"
            });
        }

        if (!title || !author || !year || !publisher || !pages || !genre) {
            return res.status(400).json({
                status: "error",
                message: "Please fill all fields"
            });
        }

        const [bookExists] = await connection.query("SELECT * FROM books WHERE id = ?", [id]);
        if (bookExists.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Book not found"
            });
        }


        const sqlQuery = "UPDATE books SET title = ?, author = ?, year = ?, publisher = ?, pages = ?, genre = ? WHERE id = ?";
        const [bookResultsUpdate] = await connection.query(sqlQuery, [title, author, year, publisher, pages, genre, id]);

        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            updatedRows: bookResultsUpdate.affectedRows
        });

    } catch (error) {
        console.error("Error updating book", error);
        return res.status(500).json({
            status: "error",
            message: "Internal error. Contact support",
            error: error.message
        });

    }
    finally {
        if (connection)
            await connection.end();
    }

});


//Eliminar una entrada existente:
app.delete("/api/book/:id", async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const { id } = req.params;

        const [bookExists] = await connection.query("SELECT * FROM books WHERE id = ?", [id]);
        if (bookExists.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Book not found"
            });
        }

        const sqlQuery = "DELETE FROM books WHERE id = ?";
        const [bookResultsDelete] = await connection.query(sqlQuery, [id]);

        await connection.end();

        res.status(200).json({
            status: "success",
            message: "Book deleted successfully",
            deletedRows: bookResultsDelete.affectedRows
        });

    } catch (error) {
        console.error("Error deleting book", error);
        return res.status(500).json({
            status: "error",
            message: "Internal error. Contact support",
            error: error.message
        });
    } finally {
        if (connection)
            await connection.end();
    }
});








//Establecer el puerto de conexión:
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
});

