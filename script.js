//comandite za mene si http://localhost:3000/signup.html
// http://localhost:3000/login.html


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const db = require('./config/db');
db.query('SELECT 1')
  .then(() => {
    console.log('Database connection established successfully');
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});