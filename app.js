const express = require('express')
const app = express()

const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const routes = require('./routes')// 載入index.js 總路由
const port = 3000

const usePassport = require('./config/passport')
require('./config/mongoose')


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
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true,
}))
app.use(express.static('public')) // 載入 public 的css
app.use(express.urlencoded({ extended: true }))// 載入 body-parser 解析透過 POST 方法傳來的資料
app.use(methodOverride('_method'))

usePassport(app)
app.use(routes)

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})
