const express = require('express')

const HumidityCtrl = require('../controllers/humidity-controller')

const router = express.Router()

router.get('/humidity', HumidityCtrl.getHumidity)

module.exports = router