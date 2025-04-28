CREATE DATABASE library_db;

USE library_db;

CREATE TABLE books (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(50) NOT NULL,
writer VARCHAR(50) NOT NULL,
year INT NOT NULL,
publisher VARCHAR(50),
pages INT
);

ALTER TABLE books
CHANGE COLUMN writer author VARCHAR(50) NOT NULL;

ALTER TABLE books
ADD COLUMN genre VARCHAR(25);


INSERT INTO books (title, author, year, publisher, pages, genre)
VALUES 
("El misterioso caso de Styles", "Agatha Christie", "2022", "Booket", "224", "Novela negra"),
("El Espía", "Jorge Díaz", "2025", "Editorial Planeta", "432", "Thriller histórico"),
("Escuela de Monstruos", "Sally Rippin", "2025", "Montena", "48", "Infantil");


CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
userName VARCHAR(25) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
password VARCHAR(250) NOT NULL
);
SELECT * FROM books; 

INSERT INTO books (title, author, year, publisher, pages, genre)
VALUES 
("Pequeño Sherlock", "Pascal Prévot", "2025", "Anaya Infantil y Juvenil", "48", "infantil");


UPDATE books SET title = "DORAEMON Nº 01/15" WHERE id = 6;

UPDATE books SET title = "PEQUEÑO SHERLOCK: EL CASO DEL TIRANOSAURIO REX" WHERE id = 4;

DELETE FROM books WHERE id = 6; 

SELECT * FROM books WHERE id = 11
        



