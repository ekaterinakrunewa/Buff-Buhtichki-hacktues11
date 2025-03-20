//comandite za mene si http://localhost:3000/signup.html
// http://localhost:3000/login.html

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'George2121', 
    database: 'login_system'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

app.post('/signup', (req, res) => {
    const { username, password, email } = req.body;
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(query, [username, password, email], (err, result) => {
        if (err) throw err;
        res.send('User registered successfully!');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.send('Login successful!');
        } else {
            res.send('Invalid username or password');
        }
    });
});

app.listen(port, () => {
    console.log('Server running on http://localhost:' + port);
});