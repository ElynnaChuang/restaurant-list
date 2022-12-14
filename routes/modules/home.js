const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const sortsArray = [
  { value: 'name_asc', name: 'A > Z', sort: { name: 1 } },
  { value: 'name_desc', name: 'Z > A', sort: { name: -1 } },
  { value: 'category', name: '種類', sort: { category: 1 } }
]

// -------- home page -------- //
router.get('/', (req, res) => {
  // --- 顯示排序（預設為A > Z）--- //
  const sortBy = req.query.sort
  let sortInMongoose = { name: 1 }
  if (sortBy) {
    sortInMongoose = sortsArray.find(item => item.value === sortBy).sort
  }

  const userID = req.user._id //只顯示自己的餐廳list
  Restaurant.find({ userID })
    .lean()
    .sort(sortInMongoose)
    .then(restaurants => {
      let searchResults = []
      const keyWord = req.query.keyword
      // 若搜尋內容為空白 ---> 首頁
      if (!keyWord) return res.render('index', { restaurants, keyWord, sortsArray, sortBy })

      searchResults = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyWord.trim().toLowerCase()) || restaurant.category.includes(keyWord.trim().toLowerCase())
      })
      // 若搜尋內容找不到，則顯示找不到結果
      if (searchResults.length === 0) {
        return res.render('noResult', { keyWord })
      }else { // 有結果，顯示搜尋結果
        res.render('index', { restaurants: searchResults, keyWord, sortsArray, sortBy })
      }
    })
    .catch(err => {
      console.log(console.log(`when get '/': ${err}`))
      res.render('errorPage', { error: err.message })
    })
})

// 匯出路由模組
module.exports = router
