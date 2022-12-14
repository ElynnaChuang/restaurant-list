const express = require('express')
const router = express.Router()

// 引入 路由模組程式碼
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')

//引入middleware
const { authenticator } = require('../middleware/authentication')

// 設定路徑
router.use('/users', users)
router.use('/restaurants', authenticator, restaurants)
router.use('/', authenticator, home)

// 匯出總路由
module.exports = router
