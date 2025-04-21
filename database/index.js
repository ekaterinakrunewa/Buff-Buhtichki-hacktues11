const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5500;

connectDB();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5500',
    credentials: true,
}));

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('TimeLink API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});