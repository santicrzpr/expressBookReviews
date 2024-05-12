const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    try {
    // Stringify the books object and send it as JSON response
    const booksJSON = JSON.stringify(books);
    return res.status(200).json(booksJSON);
  } catch (error) {
    console.error("Error parsing file:", error);
    return res.status(500).json({ error: "Internal Error" });
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn); // Convert ISBN to integer
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    return res.status(200).json({ book });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
//    return res.status(300).json({message: "Yet to be implemented"});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const providedAuthor = req.params.author; // Get the provided author from request parameters
  const matchingBooks = []; // Array to store matching books

  // Iterate through each key in the books object
  Object.keys(books).forEach(key => {
    const book = books[key]; // Get the book object for the current key
    // Check if the author of the current book matches the provided author
    if (book.author === providedAuthor) {
      matchingBooks.push(book); // Add the matching book to the array
    }
  });

  // Check if any matching books were found
  if (matchingBooks.length > 0) {
    return res.status(200).json({ books: matchingBooks });
  } else {
    return res.status(404).json({ message: "No books found for the provided author" });
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
