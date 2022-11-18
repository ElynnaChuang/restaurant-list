const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const sortDefault = { _id : 1 }
const sortsArray = [
  { value: 'name_asc', name: 'A > Z', sort: { name: 1 }},
  { value: 'name_desc', name: 'Z > A', sort: { name: -1 }},
  { value: 'category', name: '種類', sort: { category: 1 }}
]
let sortSelected = undefined
let searchResults = []


// -------- home page -------- //
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort(sortDefault)
    .then(restaurants => {
      sortSelected = false
      res.render('index', { restaurants, sortSelected, sortsArray})
    })
    .catch(error => console.log(`when get '/': ${error}`))
})

// -------- sort -------- //
router.get('/sort', (req, res) => {
  const sortBy = req.query.sort
  const sortInMongoose = sortsArray.find( item => item.value === sortBy).sort
  Restaurant.find()
  .lean()
  .sort(sortInMongoose)
    .then(restaurants => {
      sortSelected = true
      res.render('index', { restaurants, sortSelected, sortsArray, sortBy})
    })
})

// -------- search -------- //
router.get('/search', (req, res) => {
  console.log(req.query)
  const keyWord = req.query.keyword.toLowerCase().trim()
  // 若搜尋內容為空白則返回首頁
  if (!keyWord) { return res.redirect('/') }

  // 搜尋內容
  return Restaurant.find()
    .lean()
    .then(restaurants => {
      searchResults = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyWord) || restaurant.category.includes(keyWord)
      })
      // 若搜尋內容找不到則顯示找不到
      if (searchResults.length === 0) {
        return res.render('noResult', { keyWord })
      }
      res.render('index', { restaurants: searchResults, keyWord })
    })
    .catch(error => console.log(`get'/search': ${error}`))
})

// 匯出路由模組
module.exports = router
