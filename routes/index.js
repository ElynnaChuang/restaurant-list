const express = require('express')
const router = express.Router()

// 引入 路由模組程式碼
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const auth = require('./modules/auth')

// 引入middleware
const { authenticator } = require('../middleware/authentication')

// 設定路徑
router.use('/auth', auth)
router.use('/users', users)
router.use('/restaurants', authenticator, restaurants)
router.use('/', authenticator, home)

// 匯出總路由
module.exports = router
