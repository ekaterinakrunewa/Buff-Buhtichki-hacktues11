const bcrypt = require('bcrypt');
const db = require('../config/db'); 

const signup = async (req, res) => {
    const { first_name, last_name, phone, email, password } = req.body;

    if (!first_name || !last_name || !phone || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO users (first_name, last_name, phone, email, password) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, phone, email, hashedPassword]
        );

        //biscuits

        res.status(201).json({ message: 'Signup successful!' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'An error occurred during signup.' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(400).json({ error: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password.' });
        }

        res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
};

module.exports = { signup, login };