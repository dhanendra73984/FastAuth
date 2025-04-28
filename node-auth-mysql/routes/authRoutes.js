const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticate, (req, res) => {
  res.json({ message: `Hello ${req.user.email}, this is a protected route.` });
});

// GitHub OAuth Routes
//authentication with jwt github and Oauth

// Redirect user to GitHub for authentication
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

// GitHub redirects here after login
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT and redirect to frontend
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // You can change this URL to match your frontend
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

// Redirect user to Google for authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google redirects here after login
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Create JWT and redirect to frontend
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);


module.exports = router;
