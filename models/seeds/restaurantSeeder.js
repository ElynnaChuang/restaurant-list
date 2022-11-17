const mongoose = require('mongoose')
const restaurants = require('../../restaurant.json')
const Restaurant = require('../restaurant')

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 取得連線狀態
const db = mongoose.connection
db.on('error', () => console.log('mongoose error !'))
db.once('open', ()=> {
  console.log('mongoose connected !')
  restaurants.results.forEach( item => {
    Restaurant.create({
      name: item.name,
      name_en: item.name_en,
      category: item.category,
      image: item.image,
      location: item.location,
      phone: item.phone,
      google_map: item.google_map,
      rating: item.rating,
      description: item.description,
    })
  })
  console.log('done')
})
