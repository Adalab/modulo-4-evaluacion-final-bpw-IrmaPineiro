const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("src/public"));


// función para realizar conexión con la base de datos MySQL:
async function getConnection() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });
    await connection.connect();
    return connection;
}

//Endpoints:
//Leer/listar todas las entradas existentes:
app.get("/api/books", async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const sqlQuery = "SELECT * FROM books";
        const [bookResults] = await connection.query(sqlQuery);
        //console.log(bookResults);

        await connection.end();

        res.status(200).json({
            info: {
                count: bookResults.length
            },
            results: bookResults
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


//Eliminar una entrada de libro existente:
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



//Endpoint para registro de usuario:
app.post("/api/register", async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const { userName, email, password } = req.body;
        //console.log(email, userName, password);

        if (!userName || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Please fill all fields"
            })
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const sqlQuery = "INSERT INTO users (userName, email, password) VALUES (?, ?, ?)";
        const [userResults] = await connection.query(sqlQuery, [userName, email, hashed_password]);
        //console.log(userResults);

        res.status(201).json({
            success: true,
            message: `Register completed. Id user: ${userResults.insertId}`,
        });

    } catch (error) {
        console.error("Error registering user", error);
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


//Endpoint para iniciar sesión:
app.post("/api/login", async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        //Buscar el usuario por email:
        const sqlQuery = "SELECT * FROM users WHERE email = ?";
        const [resultUser] = await connection.query(sqlQuery, [email]);
        console.log(resultUser);

        if (resultUser.length > 0) {
            //Comprobar si la contraseña:
            const isSamePassword = await bcrypt.compare(password, resultUser[0].password);
            console.log(isSamePassword);

            if (isSamePassword) {
                const infoToken = {
                    id: resultUser[0].id,
                    email: resultUser[0].email,

                }
                const token = jwt.sign(infoToken, process.env.MY_SECRET_TOKEN, { expiresIn: "1h" });


                res.status(200).json({
                    success: true,
                    message: "Login successful",
                    token: token,
                    userId: resultUser[0].id
                });

            } else {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                });
            }
        } else {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


    } catch (error) {
        console.error("Error logging in", error);
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

//Devolver a frontend una pagina dinamica:
app.get("/api/book/:id", async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const { id } = req.params;
        console.log(id);

        const sqlQuery = "SELECT * FROM books WHERE id = ?";
        const [bookResults] = await connection.query(sqlQuery, [id]);
        console.log(bookResults);

        if (bookResults.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Book not found"
            });
        }

        res.render("detailBook", { book: bookResults[0] });


    } catch (error) {
        console.error("Error al obtener el libro:", error);
        res.status(500).json({
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

app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente en Render.");
});