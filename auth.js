const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('./db/pool');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = rows[0];

      if (!user) {
        console.log('User not found');
        return done(null, false, { message: "Incorrect email" });
      }
      console.log('User found:', user);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password does not match');
        return done(null, false, { message: "Incorrect password" });
      }
      console.log('Password matches');
      return done(null, user);
    } catch (err) {
      console.log('Error:', err);
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.user_id); // Use user.user_id instead of user.id
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;