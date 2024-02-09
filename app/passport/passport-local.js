const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('app/models/user');


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


passport.use('local.register', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const user = await User.findOne({ 'email': email });

    if (user) {
      return done(null, false, req.flash('errors', 'چنین کاربری قبلا در سایت ثبت نام کرده است'));
    }

    const newUser = new User({
      name: req.body.name,
      email,
      password
    });

    await newUser.save();
    done(null, newUser);

  } catch (err) {
    return done(err, false, req.flash('errors', 'ثبت نام با موفقیت انجام نشد لطفا دوباره سعی کنید'));
  }
}));


passport.use('local.login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const user = await User.findOne({ 'email': email });

    if (!user || !user.comparePassword(password)) {
      return done(null, false, req.flash('errors', 'اطلاعات وارد شده مطابقت ندارد'));
    }

    done(null, user);

  } catch (err) {
    return done(err);
  }
}));