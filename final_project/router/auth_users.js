const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username;
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }  
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn; 
  const book = books[isbn];
  const userName = req.session.authorization.username;
  const reviewTxt = req.body.reviewText;
//  const { user, review } = req.body; 
    if (books.hasOwnProperty(isbn)) {
        if (book.reviews.hasOwnProperty(userName)) {
            // If the user has reviewed before, update the existing review
            book.reviews[userName] = reviewTxt;
            res.status(200).send("Review updated successfully.");
        } else {
            // If the user has not reviewed before, add a new review
            book.reviews[userName] = reviewTxt;
            res.status(200).send("Review added successfully.");
        }
    } else {
        res.status(404).send("Book not found.");
    }
//  return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; 
  const book = books[isbn];
  const userName = req.session.authorization.username;
  const reviewTxt = req.body.reviewText;
  if (books.hasOwnProperty(isbn)){
    if (book.reviews.hasOwnProperty(userName)) {
      delete book.reviews[userName];
      res.status(200).send("Review deleted successfully.");
    } else {
      // If the user doesn't have a review for the book, send a 404 error response
      res.status(404).json({ error: "Your user hasn't reviewed this book." });
    }
  } else {
        res.status(404).json({ error: "Book does not exist." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
