const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token.' });
        }

        req.user = decoded; 
        next();
    });
};

module.exports = authenticateUser;