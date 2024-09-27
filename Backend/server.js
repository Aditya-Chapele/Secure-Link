
// const express = require('express');
// const mysql = require('mysql');
// const path = require('path');

// const app = express();
// const PORT = 3000;

// // Middleware to parse incoming request bodies
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Serve static files from the Frontend folder
// app.use(express.static(path.join(__dirname, '../Frontend')));

// // MySQL connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root', // Replace with your MySQL username
//     password: 'password', // Replace with your MySQL password
//     database: 'login' // Replace with your MySQL database name
// });

// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL database:', err);
//         return;
//     }
//     console.log('Connected to MySQL database.');
// });

// // Route to serve the HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../Frontend/LoginPage.html'));
// });

// // Route to handle user signup
// app.post('/signup', (req, res) => {
//     const { firstName, middleName, lastName, email, password } = req.body;
//     const sql = 'INSERT INTO users (first_name, middle_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)';
    
//     db.query(sql, [firstName, middleName, lastName, email, password], (err, result) => {
//         if (err) {
//             console.error('Error inserting data into database:', err);
//             res.status(500).send('Server error');
//             return;
//         }
//         res.send('User signed up successfully');
//     });
// });

// // Route to handle user login (you can add more logic here)
// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     // You can add login logic here (authentication)
//     res.send('Login functionality not implemented yet');
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files like CSS and JS
app.use(express.static(path.join(__dirname, '../Frontend')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'login',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Render LoginPage.html on accessing root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend', 'LoginPage.html'));
});

// Handle Signup
app.post('/signup', (req, res) => {
  const { firstName, middleName, lastName, email, password } = req.body;

  const query = 'INSERT INTO users (first_name, middle_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [firstName, middleName, lastName, email, password], (err, result) => {
    if (err) throw err;
    res.json({ message: 'User created successfully!' });
  });
});

// Handle Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) throw err;
      if (results.length > 0 && results[0].password === password) {
        // On successful login, return redirect URL
        res.json({ redirectUrl: '/PostLogin.html' });
      } else {
        // On failure, return an error message
        res.json({ error: 'Email and/or password is incorrect' });
      }
    });
  });
  

// Serve abcd.html after login
app.get('/Frontend/PostLogin.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend', 'PostLogin.html')); // Ensure PostLogin.html exists in Frontend folder
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
