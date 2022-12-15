const restaurants = require('../../restaurant.json')
const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')

const SEEDER_USER = [{
  email: 'user1@example.com',
  password: '12345678'
},{
  email: 'user2@example.com',
  password: '12345678'
}]
// 連線成功（因為有for迴圈...，與mongoose.js裡不同，所以在mongoose.js先export，在這邊再繼續寫其他動作）
db.once('open', () => {
  Promise.all(Array.from({ length: SEEDER_USER.length }, (_, i) => {
    return bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(SEEDER_USER[i].password, salt))
      .then(hash => {
        const { email } = SEEDER_USER[i]
        return User.create({ email, password: hash })
          .then(user => {
            const userID = user._id
            if(i === 0) {
              return Promise.all(Array.from({ length: 3 }, (_, index) => {
                // console.log('rest', index)
                const { name, name_en, category, image, location, phone, google_map, rating, description } = restaurants.results[index]
                return Restaurant.create({ userID, name, name_en, category, image, location, phone, google_map, rating, description })
              }))
            }else {
              return Promise.all(Array.from({ length: 3 }, (_, index) => {
                // console.log('rest', index+3)
                const { name, name_en, category, image, location, phone, google_map, rating, description } = restaurants.results[index + 3]
                return Restaurant.create({ userID, name, name_en, category, image, location, phone, google_map, rating, description })
              }))
            }
          })
          .then(() => console.log('Reataurant create done!'))
          .catch(err => console.log('create Reataurant error', err))
      })
  }))
    .then(() => {
      console.log('User create done!')
      process.exit()
    })
    .catch(err => console.log('create User error', err))
})
