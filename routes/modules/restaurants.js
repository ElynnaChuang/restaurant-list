const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const categories = [
  { value: '中東料理', name: '中東料理' },
  { value: '日本料理', name: '日本料理' },
  { value: '義式餐廳', name: '義式餐廳' },
  { value: '美式', name: '美式' },
  { value: '酒吧', name: '酒吧' },
  { value: '咖啡', name: '咖啡' }
]

// -------- add new restaurant -------- //
router.get('/new', (req, res) => {
  res.render('new', { categories })
})

router.post('/', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  const userID = req.user._id
  Restaurant.create({ userID, name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(`when post '/restaurants':${err}`)
      res.render('errorPage', { error: err.message })
    })
})

// -------- read more info -------- //
router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userID = req.user._id
  return Restaurant.findOne({ userID, _id})
    .lean()
    .then((restaurant) => {
      if (!restaurant) {
        const error = '項目內容不存在'
        return res.render('errorPage', { error })
      }
      res.render('show', { restaurant })
    })
    .catch(err => {
      console.log(`when get '/restaurants/:id': ${err}`)
      res.render('errorPage', { error: err.message })
    })
})

// -------- edit restaurant info -------- //
// in the edit page
router.get('/:id/edit', (req, res) => {
  const userID = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ userID, _id})
    .lean()
    .then(restaurant => {
      if (!restaurant) {
        const error = '項目內容不存在'
        return res.render('errorPage', { error })
      }
      const selectedValue = categories.find(item => item.value === restaurant.category).value
      res.render('edit', { restaurant, categories, selectedValue })
    })
    .catch(err => {
      console.log(`when get '/restaurants/:id/edit': ${err}`)
      res.render('errorPage', { error: err.message })
    })
})

// re-render
router.put('/:id', (req, res) => {
  const userID = req.user._id
  const _id = req.params.id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.findOne({ userID, _id})
    .then(restaurant => {
      if (!restaurant) {
        const error = '該項目不存在'
        return res.render('errorPage', { error })
      }
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(`when put '/restaurants/:id': ${err}`)
      res.render('errorPage', { error: err.message })
    })
})

// -------- delete -------- //
router.delete('/:id', (req, res) => {
  const userID = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ userID, _id})
    .then(restaurant => {
      if (!restaurant) {
        const error = '該項目不存在'
        return res.render('errorPage', { error })
      }
      restaurant.remove()
    })
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(`when delete '/restaurants/:id' : ${err}`)
      res.render('errorPage', { error: err.message })
    })
})

// 匯出路由模組
module.exports = router
