const bcrypt = require('bcrypt');
const db = require('../config/db');

const signup = async (req, res) => {
    const { first_name, last_name, phone, email, password } = req.body;

    if (!first_name || !last_name || !phone || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ error: 'User already exists with this email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.query(
            'INSERT INTO users (first_name, last_name, phone, email, password) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, phone, email, hashedPassword]
        );

        res.status(201).json({ 
            message: 'Signup successful!',
            userId: result.insertId 
        });
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
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const user = rows[0];
        console.log(user);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });

        
        res.cookie('authToken', token, {
            httpOnly: true, 
            secure: false, 
            maxAge: 3600000 
        });

        res.status(200).json({ 
            message: 'Login successful!',
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
};

module.exports = { signup, login };