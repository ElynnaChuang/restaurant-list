const express = require('express')
const router = express.Router()

const User = require('../../models/user')

const passport = require('passport')
const bcrypt = require('bcryptjs')

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
  const register_err_msg = []
  if (!email || !password || !confirmPassword) {
    register_err_msg.push({ message: '密碼與Email為必填' })
  }
  if (password !== confirmPassword) {
    register_err_msg.push({ message: '密碼與確認密碼不同' })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        register_err_msg.push({ message: '此email已被註冊過' })
      }
      if (register_err_msg.length) {
        return res.render('register', { name, email, register_err_msg })
      }

      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ name, email, password: hash }))
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

router.get('/logout', function (req, res, next) {
  req.logout()
  req.flash('success_msg', '成功登出')
  res.redirect('/users/login')
})

module.exports = router
