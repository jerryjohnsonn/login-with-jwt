const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if the username and password are valid
  if (username === 'admin' && password === 'password') {
    // Generate a JWT Token
    const token = jwt.sign(
      {
        username,
        isAdmin: true,
      },
      'secret'
    );
    res.json({
      token,
    });
  } else {
    // Return an error message to the client application
    res.status(401).send('Invalid username or password');
  }
});

app.get('/protected', (req, res) => {
  // Check if the JWT token is present in the request header.
  let token = req.headers.authorization;
  token = token.split(' ')[1];

  if (!token) {
    // Return an error message to the client application.
    res.status(401).send('Unauthorized.');
  } else {
    // Verify the JWT token.
    try {
      const decoded = jwt.verify(token, 'secret');

      // If the JWT token is valid, allow the request.
      res.send('Hello, ' + decoded.username);
    } catch (error) {
      // If the JWT token is invalid, return an error message to the client application.
      res.status(401).send('Unauthorized.');
    }
  }
});

app.listen(3000);
