const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const mongoose = require('mongoose')// 載入 mongoose
const routes = require('./routes')//載入index.js 總路由
const app = express()
const port = 3000

// 加入這段 code, 僅在非正式環境時, 使用 dotenv:管理環境變數
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', ()=>console.log('mongodb error!'))
// 連線成功
db.once('open', ()=>console.log('mongodb connecting!'))

//使用handlebars(extname: '.hbs'，是指定副檔名為 .hbs，有了這行以後，我們才能把預設的長檔名改寫成短檔名)
app.engine('hbs', exphbs({
  defaultLayout :'main',
  extname: '.hbs',
  helpers: {
    isSelected: function(array, value, options){
      let option = ''
      for(let i=0 ; i < array.length ; i++) {
        let item = options.fn(array[i]);
        if (array[i].value === value) {
          option += `<option value="${array[i].value}" selected>`+ item + `</option>`
        }else {
          option += `<option value="${array[i].value}">`+ item + `</option>`
        }
      }
      return option
    }
  }
}))
app.set('view engine', 'hbs')

app.use(express.static('public')) //載入 public 的css
app.use(express.urlencoded({extended: true}))//載入 body-parser 解析透過 POST 方法傳來的資料
app.use(methodOverride('_method'))

app.use(routes)

app.listen(port, ()=>{
  console.log(`Running on http://localhost:${port}`)
})