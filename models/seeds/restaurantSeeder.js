const restaurants = require('../../restaurant.json')
const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')

const SEEDER_USER = {
  name: 'test',
  email: 'test@test.com',
  password: '12345678'
}
// 連線成功（因為有for迴圈...，與mongoose.js裡不同，所以在mongoose.js先export，在這邊再繼續寫其他動作）
db.once('open', () => {

  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEEDER_USER.password, salt))
    .then(hash => {
      const { name, email } = SEEDER_USER
      User.create({ name, email, password: hash})
        .then(user => {
          const userID = user._id
          Promise.all(Array.from({ length: restaurants.results.length }, (_, i) => {
              const {name, name_en, category, image, location, phone, google_map, rating, description} = restaurants.results[i]
              return Restaurant.create({userID, name, name_en, category, image, location, phone, google_map, rating, description})
            }))
            .then(() => {
              console.log('done.')
              process.exit()
            })
        })
        .catch(err => console.log('create seeder error', err))
    })
})
