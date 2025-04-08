// config/passport.js
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('./db'); // your mysql db connection
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
  const githubId = profile.id;
  const email = profile.emails && profile.emails.length > 0
  ? profile.emails[0].value
  : `${profile.username}@noemail.github.com`; // fallback dummy email
  const name = profile.displayName || profile.username;

  // Find or insert user
  try {
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, results) => {
        if (results.length > 0) {
          return done(null, results[0]);
        } else {
          // Insert user
          db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, 'github_oauth'], // password can be dummy
            (err, result) => {
              if (err) return done(err);
              const newUser = { id: result.insertId, name, email };
              return done(null, newUser);
            }
          );
        }
      }
    );
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return done(err);
    done(null, results[0]);
  });
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails?.[0]?.value;
  const name = profile.displayName;

  if (!email) return done(new Error("No email from Google"));

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return done(err);
      if (results.length > 0) {
        return done(null, results[0]);
      } else {
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, 'google_oauth'], (err, result) => {
          if (err) return done(err);
          const newUser = { id: result.insertId, name, email };
          return done(null, newUser);
        });
      }
    });
  } catch (err) {
    return done(err);
  }
}));
