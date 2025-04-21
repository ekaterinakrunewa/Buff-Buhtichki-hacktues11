const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'George2121',
    database: 'timelink_reviews'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Successfully connected to MySQL as thread ID ' + db.threadId);
});

app.get('/api/reviews', (req, res) => {
    db.query('SELECT * FROM reviews ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).json({ error: 'Error fetching reviews' });
            return;
        }
        res.json(results);
    });
});

app.post('/api/reviews', (req, res) => {
    const { name, rating, type, review } = req.body;
    if (!name || !rating || !type || !review) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newReview = { name, rating: parseInt(rating), type, review };

    db.query('INSERT INTO reviews SET ?', newReview, (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).json({ error: 'Error adding review' });
            return;
        }
        res.status(201).json({ message: 'Review added successfully', reviewId: results.insertId });
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});