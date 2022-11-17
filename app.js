const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const mongoose = require('mongoose')// 載入 mongoose
const app = express()
const port = 3000
const Restaurant = require('./models/restaurant')
const categories = [
  {'value': 1, 'name':'中東料理'},
  {'value': 2, 'name':'日本料理'},
  {'value': 3, 'name':'義式餐廳'},
  {'value': 4, 'name':'美式'},
  {'value': 5, 'name':'酒吧'},
  {'value': 6, 'name':'咖啡'}
]
let searchResults = []

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

// -------- home page -------- //
app.get('/', (req, res)=>{
  Restaurant.find()
    .lean()
    .then( restaurants => res.render('index', {restaurants}))
    .catch( error => console.log(`when get '/': ${error}`))
})

// -------- search -------- //
app.get('/search', (req, res)=>{
  const keyWord = req.query.keyword.toLowerCase().trim()
  //若搜尋內容為空白則返回首頁
  if(!keyWord){ return res.redirect('/')}

  //搜尋內容
  return Restaurant.find()
    .lean()
    .then(restaurants => {
      searchResults = restaurants.filter( restaurant => {
        return restaurant.name.toLowerCase().includes(keyWord) || restaurant.category.includes(keyWord)
      })
      //若搜尋內容找不到則顯示找不到
      if(searchResults.length === 0){
        return res.render('noResult', {keyWord})
      }
      res.render('index', {restaurants: searchResults, keyWord})
    })
    .catch(error => console.log(`get'/search': ${error}`))
})


// -------- add new restaurant -------- //
app.get('/restaurants/new', (req, res)=>{
  res.render('new', {categories})
})

app.post('/restaurants', (req, res)=>{
  const name = req.body.name
  const name_en = req.body.name_en
  const category = categories.find(item => item.value === Number(req.body.category)).name
  const image= req.body.image
  const location= req.body.location
  const phone= req.body.phone
  const google_map= req.body.google_map
  const rating= Number(req.body.rating)
  const description= req.body.description

  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description})
    .then(res.redirect('/'))
    .catch(error => console.log(`when get '/restaurants':${error}`))
})


// -------- read more info -------- //
app.get('/restaurants/:id', (req, res)=>{
  const id = req.params.id
  return Restaurant.findById(id)
  .lean()
  .then((restaurant)=> {
    res.render('show', {restaurant})
  })
  .catch( error => console.log(`when get '/restaurants/:id': ${error}`))
})

// -------- edit restaurant info -------- //
// in the edit page
app.get('/restaurants/:id/edit', (req, res)=>{
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then( restaurant => {
      const selectedValue = categories.find(item => item.name === restaurant.category).value
      res.render('edit', {restaurant, categories, value: selectedValue})
    })
})
//re-render
app.put('/restaurants/:id', (req, res)=>{
  const id = req.params.id
  const data = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = data.name
      restaurant.name_en = data.name_en
      restaurant.category = categories.find(category => category.value === Number(data.category)).name
      restaurant.image = data.image
      restaurant.location = data.location
      restaurant.phone = data.phone
      restaurant.google_map = data.google_map
      restaurant.rating = data.rating
      restaurant.description = data.description

      return restaurant.save()
    })
    .then(()=> res.redirect('/'))
})

// -------- delete -------- //
app.delete('/restaurants/:id', (req, res)=>{
  const id = req.params.id
  return Restaurant.findById(id)
    .then( restaurant => restaurant.remove() )
    .then( () => res.redirect('/') )
    .catch( error => console.log(`when get '/restaurants/:id/delete': ${error}`))
})


app.listen(port, ()=>{
  console.log(`Running on http://localhost:${port}`)
})