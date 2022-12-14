const express = require('express')
const router = express.Router()

const User = require('../../models/user')

const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect:'/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then(user => {
      //帳號已註冊過
      if(user) {
        console.log('此email已被註冊過')
        return res.render('register', { name, email })
      }
      //密碼與確認密碼不同
      if(password !== confirmPassword) {
        console.log('密碼與確認密碼不同')
        return res.render('register', { name, email })
      }

      return User.create({ name, email, password })
        .then(() => res.redirect('/'))
        .catch((err) => {
          console.log(err);
          res.render('errorPage')
        })
    })
    .catch((err) => {
      console.log(err);
      res.render('errorPage')
    })
})


module.exports = router