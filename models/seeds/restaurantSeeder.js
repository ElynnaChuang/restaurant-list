const restaurants = require('../../restaurant.json').results
const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')

const SEEDER_USER = [{
  email: 'user1@example.com',
  password: '12345678',
  restaurantId: [1, 2, 3]
},{
  email: 'user2@example.com',
  password: '12345678',
  restaurantId: [4, 5, 6]
}]

db.once('open', () => {
  Promise.all(Array.from({ length: 2 }, (_, i) => {
    // const { email, password } = SEEDER_USER[i]
    return bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(SEEDER_USER[i].password, salt))
      .then(hash => {
        const { email } = SEEDER_USER[i]
        return User.create({email, password: hash})
      })
      .then(user => {
        const newRestaurants = restaurants
          .filter( r => SEEDER_USER[i].restaurantId.includes(r.id))//SEEDER_USER裡的restaurantId 跟 遍歷restaurants 的 id 對比，會回傳為true的restaurant
          .map(r => ({ ...r, userID: user.id})) //將得到的restaurant，每一項都加入當前的userID
        return Restaurant.create( newRestaurants )
      })
  }))
  .then(() => {
    console.log('Create seeder done!')
    process.exit()
  })
  .catch(err => console.log('Create seeder error', err))
})
