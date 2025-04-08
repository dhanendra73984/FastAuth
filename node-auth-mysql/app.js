const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./config/passport'); // 👈 Load GitHub strategy

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // 👈 your frontend origin
  credentials: true,
}));

app.use(express.json());

// 🔐 Express session (required for Passport to work)
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
}));

// 🔐 Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes); // 👈 Ensure this path matches your GitHub URL

app.get('/', (req, res) => {
    res.send('🚀 Auth server is running...');
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
