//comandite za mene si http://localhost:3000/signup.html
// http://localhost:3000/login.html


const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'George2121',
    database: process.env.DB_NAME || 'login_system'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


app.post('/signup', (req, res) => {
    const { username, password, email } = req.body;

 
    if (!username || !password || !email) {
        return res.status(400).send('All fields are required');
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Internal server error');
        }


        const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        db.query(query, [username, hash, email], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).send('Internal server error');
            }
            res.send('User registered successfully!');
        });
    });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

 
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length > 0) {

            bcrypt.compare(password, results[0].password, (err, result) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).send('Internal server error');
                }

                if (result) {
                    res.send('Login successful!');
                } else {
                    res.status(401).send('Invalid username or password');
                }
            });
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});


app.listen(port, '0.0.0.0', () => {
    console.log('Server running on http://localhost:' + port);
});

