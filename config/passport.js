const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const User = require('../models/user')
const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  // 本地登入
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true // 開啟後，req就可以做為參數回傳給callback
  },
  (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) return done(null, false, req.flash('warning_msg', '此email尚未註冊'), req.flash('email', `${email}`))
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, req.flash('login_err_msg', '密碼錯誤'), req.flash('email', `${email}`))
            }
            return done(null, user) // 成功登入
          })
      })
      .catch((err) => { return done(err, false) })
  }))

  // FB登入
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
  (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        // 已註冊過
        if (user) return done(null, user)
        // 未註冊過
        const randomPassword = Math.random().toString(36).slice(-8)
        return bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({ name, email, password: hash }))
          .then(user => done(null, user))
          .catch((err) => { return done(err, false) })
      })
      .catch((err) => { return done(err, false) })
  }))

  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, false))
  })
}
