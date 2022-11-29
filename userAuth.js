const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const { authenticate } = require('passport');
const errMessage = 'User information not found, please check your information.';

function initialize(passport) {
  const authUser = (email, password, done) => {
    pool.query(
      `SELECT * FROM users WHERE userEmails = $1`,
      [email],
      (error, result) => {
        if (error) {
          throw error;
        }
        if (result.rowCount > 0) {
          const user = result.rows[0];

          bcrypt.compare(password, user.userpwords, (error, match) => {
            if (match) {
              return done(null, user);
            } else {
              return done(null, false, { message: errMessage });
            }
          });
        } else {
          return done(null, false, { message: errMessage });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      authUser
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`, [id], (error, result) => {
      if (error) {
        throw error;
      }
      return done(null, result.rows[0]);
    });
  });
}

module.exports = initialize;
