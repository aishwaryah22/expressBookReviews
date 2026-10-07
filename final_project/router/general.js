const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// =========================
// Task 6 - Register
// =========================
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists."
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User successfully registered."
    });
});


// =========================
// Task 1 - Get all books
// =========================
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});


// =========================
// Task 2 - Get book by ISBN
// =========================
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found."
    });
});


// =========================
// Task 3 - Get books by author
// =========================
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    const result = Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
    );

    if (result.length > 0) {
        return res.status(200).json(result);
    }

    return res.status(404).json({
        message: "No books found for this author."
    });
});


// =========================
// Task 4 - Get books by title
// =========================
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    const result = Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
    );

    if (result.length > 0) {
        return res.status(200).json(result);
    }

    return res.status(404).json({
        message: "No books found with this title."
    });
});


// =========================
// Task 5 - Get reviews
// =========================
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (books[isbn]) {

        const reviews = books[isbn].reviews;

        if (Object.keys(reviews).length > 0) {
            return res.status(200).json(reviews);
        }

        return res.status(200).json({
            message: "No reviews found for this book."
        });
    }

    return res.status(404).json({
        message: "Book not found."
    });
});


// =====================================================
// Tasks 10-13 - Axios + Async/Await
// =====================================================

// Task 10 - Get all books using Axios
async function getAllBooks() {
    try {
        const response = await axios.get('http://localhost:5001/');
        return response.data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}


// Task 11 - Get book by ISBN using Axios
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(
            `http://localhost:5001/isbn/${isbn}`
        );
        return response.data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}


// Task 12 - Get books by author using Axios
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(
            `http://localhost:5001/author/${encodeURIComponent(author)}`
        );
        return response.data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}


// Task 13 - Get books by title using Axios
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(
            `http://localhost:5001/title/${encodeURIComponent(title)}`
        );
        return response.data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}


module.exports.general = public_users;

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;