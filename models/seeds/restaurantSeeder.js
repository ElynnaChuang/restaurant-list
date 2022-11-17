const restaurants = require('../../restaurant.json')
const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

// 連線成功（因為有for迴圈，與mongoose.js裡不同，所以在mongoose.js先export，在這邊再繼續寫其他動作）
db.once('open', ()=> {
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
