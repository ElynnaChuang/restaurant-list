const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
let searchResults = []

// -------- home page -------- //
router.get('/', (req, res)=>{
  Restaurant.find()
    .lean()
    .then( restaurants => res.render('index', {restaurants}))
    .catch( error => console.log(`when get '/': ${error}`))
})

// -------- search -------- //
router.get('/search', (req, res)=>{
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

// 匯出路由模組
module.exports = router