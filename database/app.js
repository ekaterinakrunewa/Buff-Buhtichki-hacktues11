const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

// Main route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the TimeBank API!',
    endpoints: {
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
    },
  });
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));