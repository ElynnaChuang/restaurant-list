const express = require('express')
const router = express.Router()

const User = require('../../models/user')

const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const err_msg = []
  if( !name || !email || !password || !confirmPassword) {
    err_msg.push({ message: '所有欄位皆為必填' })
  }
  if (password !== confirmPassword) {
    err_msg.push({ message: '密碼與確認密碼不同' })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        err_msg.push({ message: '此email已被註冊過' })
      }
      if(err_msg.length) {
        return res.render('register', { name, email,  err_msg})
      }
      return User.create({ name, email, password })
        .then(() => res.redirect('/'))
        .catch((err) => {
          console.log(err)
          res.render('errorPage')
        })
    })
    .catch((err) => {
      console.log(err)
      res.render('errorPage')
    })
})

router.get('/logout', function(req, res, next){
  req.logout(err => {
    if (err)  return next(err);
    req.flash('success_msg', '成功登出')
    res.redirect('/users/login')
  });
});

module.exports = router
