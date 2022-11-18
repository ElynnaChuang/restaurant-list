const express = require('express')
const router = express.Router()

// 引入 路由模組程式碼
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')

// 設定路徑
router.use('/', home)
router.use('/restaurants', restaurants)

// 匯出總路由
module.exports = router
