const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const categories = [
  {'value': 1, 'name':'中東料理'},
  {'value': 2, 'name':'日本料理'},
  {'value': 3, 'name':'義式餐廳'},
  {'value': 4, 'name':'美式'},
  {'value': 5, 'name':'酒吧'},
  {'value': 6, 'name':'咖啡'}
]

// -------- add new restaurant -------- //
router.get('/new', (req, res)=>{
  res.render('new', {categories})
})

router.post('/', (req, res)=>{
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
router.get('/:id', (req, res)=>{
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
router.get('/:id/edit', (req, res)=>{
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then( restaurant => {
      const selectedValue = categories.find(item => item.name === restaurant.category).value
      res.render('edit', {restaurant, categories, value: selectedValue})
    })
})
//re-render
router.put('/:id', (req, res)=>{
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
router.delete('/:id', (req, res)=>{
  const id = req.params.id
  return Restaurant.findById(id)
    .then( restaurant => restaurant.remove() )
    .then( () => res.redirect('/') )
    .catch( error => console.log(`when get '/restaurants/:id/delete': ${error}`))
})

// 匯出路由模組
module.exports = router