module.exports = {
  authenticator: (req, res, next) => {
    //Passport.js 提供的 req.isAuthenticated() 可以用來檢查登入狀態
    if (req.isAuthenticated()) return next()
    res.redirect('/users/login')
  }
}