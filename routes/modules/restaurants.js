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
  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description })
    .then(res.redirect('/'))
    .catch(err => {
      console.log(console.log(`when get '/restaurants':${err}`))
      res.render('errorPage', { error: err.message })
    })
})

// -------- read more info -------- //
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => {
      if (!restaurant) {
        const error = '項目內容不存在'
        return res.render('errorPage', { error })
      }
      res.render('show', { restaurant })
    })
    .catch(err => {
      console.log(console.log(`when get '/restaurants/:id': ${err}`))
      res.render('errorPage', { error: err.message })
    })
})

// -------- edit restaurant info -------- //
// in the edit page
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
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
      console.log(console.log(`when get '/restaurants/:id/edit': ${err}`))
      res.render('errorPage', { error: err.message })
    })
})

// re-render
router.put('/:id', (req, res) => {
  const id = req.params.id
  const data = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      if (!restaurant) {
        const error = '該項目不存在'
        return res.render('errorPage', { error })
      }
      restaurant.name = data.name
      restaurant.name_en = data.name_en
      restaurant.category = data.category
      restaurant.image = data.image
      restaurant.location = data.location
      restaurant.phone = data.phone
      restaurant.google_map = data.google_map
      restaurant.rating = data.rating
      restaurant.description = data.description
      return restaurant.save()
    })
    .then(() => res.redirect('/'))
})

// -------- delete -------- //
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => {
      if (!restaurant) {
        const error = '該項目不存在'
        return res.render('errorPage', { error })
      }
      restaurant.remove()
    })
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(console.log(`when get '/restaurants/:id/delete': ${err}`))
      res.render('errorPage', { error: err.message })
    })
})

// 匯出路由模組
module.exports = router
