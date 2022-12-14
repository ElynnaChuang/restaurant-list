const express = require('express')
const app = express()

const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const usePassport = require('./config/passport')
require('./config/mongoose')

const routes = require('./routes')// 載入index.js 總路由
const port = process.env.PORT

// 使用handlebars(extname: '.hbs'，是指定副檔名為 .hbs，有了這行以後，我們才能把預設的長檔名改寫成短檔名)
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    isSelected: function (array, value) {
      let option = ''
      if (array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].value === value) {
            option += `<option value="${array[i].value}" selected>${array[i].name}</option>`
          } else {
            option += `<option value="${array[i].value}">${array[i].name}</option>`
          }
        }
        return option
      }
    }
  }
}))
app.set('view engine', 'hbs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(express.static('public')) // 載入 public 的css
app.use(express.urlencoded({ extended: true }))// 載入 body-parser 解析透過 POST 方法傳來的資料
app.use(methodOverride('_method'))

usePassport(app)
app.use(flash())

// 新增middleware，將passport的驗證狀態放入res中，讓routes可以取用
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()// 回傳值是布林
  res.locals.user = req.user

  //設定flash message
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.success_msg = req.flash('success_msg')
  next()
})
app.use(routes)

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})
